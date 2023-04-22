import { useUiStore } from '@FEATURES/blueprint/stores'
import type { setCommonHandling, setElemBoundingHandling } from '.'
import type { PinchState } from '@SRC/types'
import type {
  Axis,
  BlueprintBounding,
  BlueprintNodeProvideData,
  Coordinates,
  Dimension,
  GridExposed,
  GridRefs,
  Offsets,
  ZoomDirectionFactor,
} from '@FEATURES/blueprint/types'

const ui = useUiStore()

type ZoomSetterArguments = {
  bpBounding: BlueprintBounding
  gridRefs: GridRefs
  updateBpSubtreeBoundings: ReturnType<typeof setElemBoundingHandling>['updateBpSubtreeBoundings']
  parentBpNodeData: BlueprintNodeProvideData
} & ReturnType<typeof setCommonHandling>

export default function setZoomHandling({
  contentOffsets,
  bgOffsets,
  bpBounding,
  gridRefs,
  parentBpNodeData,
  updateBpSubtreeBoundings,
  updateContentOffsets,
  updateBackgroundOffsets,
  applyForEveryGrid,
  getCurrentBiggestSquareLength,
  computeExtraOffset,
}: ZoomSetterArguments) {
  const contentScale = ref(1)
  const computeZoomToApply = (zoomFactor: ZoomDirectionFactor): number => toTheNth(ui.zoomRate, zoomFactor)
  const computeLengthDelta = (zoomToApply: number, length: number): number => (zoomToApply - 1) * length
  const computeZoomedContentOffsets = (zoomRelCoords: Coordinates, zoomFactor: ZoomDirectionFactor): Offsets => {
    const output: Record<string, number> = {}
    const { axes } = ui
    const zoomToApply = computeZoomToApply(zoomFactor)
    Object.entries(axes).forEach(([dim, axis]) => {
      const contentToZoomCenterDistance =
        bpBounding[<Dimension>dim].value / 2 + contentOffsets[<Dimension>dim] - zoomRelCoords[axis]
      const extraContentOffset = computeLengthDelta(zoomToApply, contentToZoomCenterDistance)
      output[dim] = extraContentOffset
    })
    return output as Offsets
  }
  const computeZoomedGridOffsets = (
    zoomRelCoords: Coordinates,
    zoomFactor: ZoomDirectionFactor,
    biggestSquareLength: number
  ): Offsets => {
    const output: Record<string, number> = {}
    const { axes, zoomRate } = ui
    Object.entries(axes).forEach(([dim, axis]) => {
      const svgToZoomCenterDistance = bgOffsets[<Dimension>dim] + zoomRelCoords[axis]
      const lengthDelta = (toTheNth(zoomRate, zoomFactor) - 1) * svgToZoomCenterDistance
      const extraOffset = computeExtraOffset(lengthDelta, bgOffsets[<Dimension>dim], biggestSquareLength)
      output[dim] = extraOffset
    })
    return output as Offsets
  }
  const updateContentScale = (zoomFactor: ZoomDirectionFactor): void => {
    const zoomToApply = computeZoomToApply(zoomFactor)
    contentScale.value *= zoomToApply
  }
  const updateGridsAppearance = (zoomFactor: ZoomDirectionFactor): ReturnType<typeof getCurrentBiggestSquareLength> => {
    applyForEveryGrid(gridRefs, (grid: GridExposed) => grid.updateAppearance(zoomFactor))
    return getCurrentBiggestSquareLength(gridRefs)
  }
  const updateBackground = (zoomRelativeCoords: Coordinates, zoomFactor: ZoomDirectionFactor): void => {
    const currentBiggestSquareLength = updateGridsAppearance(zoomFactor)
    const extraOffsets = computeZoomedGridOffsets(zoomRelativeCoords, zoomFactor, currentBiggestSquareLength)
    updateBackgroundOffsets(extraOffsets)
  }
  const isFullyFledged = eagerComputed((): boolean => {
    const fullyFledgedDimensions = ui.getBlueprintTreeHead()?.bpRef.bpBounding
    if (!fullyFledgedDimensions) return false
    return (
      bpBounding.width.value >= fullyFledgedDimensions.width.value &&
      bpBounding.height.value >= fullyFledgedDimensions.height.value
    )
  })
  const delegateZoom = (zoomFactor: ZoomDirectionFactor, zoomRelativeCoords: Coordinates): void => {
    const myNode = ui.getBlueprintTreeNode(parentBpNodeData.id!)!
    const myParentNode = ui.getBlueprintTreeNode(myNode.parentId!)!
    myParentNode.bpRef.applyZoom(zoomFactor, zoomRelativeCoords)
  }
  const applyZoom = (zoomFactor: ZoomDirectionFactor, zoomRelativeCoords: Coordinates): void => {
    if (!isFullyFledged.value) {
      const zoomParentCoords = objectMap(
        ui.axes,
        (axis: Axis, dim: Dimension) => {
          const offsetSide = ui.dimensions[dim].offsetSide
          return bpBounding[offsetSide].value + zoomRelativeCoords[<Axis>axis]
        },
        true
      ) as Coordinates
      return delegateZoom(zoomFactor, zoomParentCoords)
    }
    updateContentScale(zoomFactor)
    const extraContentOffsets = computeZoomedContentOffsets(zoomRelativeCoords, zoomFactor)
    updateContentOffsets(extraContentOffsets)
    updateBackground(zoomRelativeCoords, zoomFactor)
    updateBpSubtreeBoundings()
  }
  const handleWheel = (event: WheelEvent): void => {
    const zoomFactor: ZoomDirectionFactor =
      event.deltaY > 0 ? ui.zoomTypes.out.directionFactor : ui.zoomTypes.in.directionFactor
    const zoomRelativeCoords: Coordinates = objectMap(
      ui.axes,
      (axis: Axis) => event[axis] - bpBounding[axis].value,
      true
    )
    applyZoom(zoomFactor, zoomRelativeCoords)
  }
  const throttledPinch = useThrottleFn((origin, offset): void => {
    const scaleFactor = offset[0]
    if (scaleFactor === 1) return
    const zoomFactor: ZoomDirectionFactor =
      scaleFactor > 1 ? ui.zoomTypes.in.directionFactor : ui.zoomTypes.out.directionFactor
    const zoomRelativeCoords: Coordinates = objectMap(
      ui.axes,
      (axis: Axis, dim: Dimension, i: number) => origin[i] - bpBounding[axis].value,
      true
    )
    applyZoom(zoomFactor, zoomRelativeCoords)
  }, 250)
  const handlePinch = ({ origin, offset, event }: PinchState): void => {
    event?.preventDefault()
    event?.stopPropagation()
    throttledPinch(origin, offset)
  }

  return {
    contentScale,
    applyZoom,
    handleWheel,
    handlePinch,
  }
}
