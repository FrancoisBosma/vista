import { useUiStore } from '@FEATURES/blueprint/stores'
import type { setCommonHandling, setElemBoundingHandling } from '.'
import type { PinchState } from '@SRC/types'
import type {
  Axis,
  BlueprintBounding,
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
} & ReturnType<typeof setCommonHandling>

export default function setZoomHandling({
  contentOffsets,
  bgOffsets,
  bpBounding,
  gridRefs,
  updateBpSubtreeBoundings,
  updateContentOffsets,
  updateBackgroundOffsets,
  applyForEveryGrid,
  getCurrentBiggestSquareLength,
  computeExtraOffset,
}: ZoomSetterArguments) {
  const contentScale = ref(1)
  const computeZoomToApply = (zoomFactor: ZoomDirectionFactor): number => toTheNth(ui.zoomRate, zoomFactor)
  const computeLengthDelta = (zoomToApply: number, length: number) => (zoomToApply - 1) * length
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
  const updateContentScale = (zoomFactor: ZoomDirectionFactor) => {
    const zoomToApply = computeZoomToApply(zoomFactor)
    contentScale.value *= zoomToApply
  }
  const updateGridsAppearance = (zoomFactor: ZoomDirectionFactor) => {
    applyForEveryGrid(gridRefs, (grid: GridExposed) => grid.updateAppearance(zoomFactor))
    return getCurrentBiggestSquareLength(gridRefs)
  }
  const updateBackground = (zoomRelativeCoords: Coordinates, zoomFactor: ZoomDirectionFactor) => {
    const currentBiggestSquareLength = updateGridsAppearance(zoomFactor)
    const extraOffsets = computeZoomedGridOffsets(zoomRelativeCoords, zoomFactor, currentBiggestSquareLength)
    updateBackgroundOffsets(extraOffsets)
  }
  const applyZoom = (zoomFactor: ZoomDirectionFactor, zoomRelativeCoords: Coordinates) => {
    updateContentScale(zoomFactor)
    const extraContentOffsets = computeZoomedContentOffsets(zoomRelativeCoords, zoomFactor)
    updateContentOffsets(extraContentOffsets)
    updateBackground(zoomRelativeCoords, zoomFactor)
    updateBpSubtreeBoundings()
  }
  const handleWheel = (event: WheelEvent) => {
    const zoomFactor: ZoomDirectionFactor =
      event.deltaY > 0 ? ui.zoomTypes.out.directionFactor : ui.zoomTypes.in.directionFactor
    const zoomRelativeCoords: Coordinates = objectMap(
      ui.axes,
      (axis: Axis) => event[axis] - bpBounding[axis].value,
      true
    )
    applyZoom(zoomFactor, zoomRelativeCoords)
  }
  const throttledPinch = useThrottleFn((origin, offset) => {
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
  const handlePinch = ({ origin, offset, event }: PinchState) => {
    event?.preventDefault()
    event?.stopPropagation()
    throttledPinch(origin, offset)
  }

  return {
    contentScale,
    handleWheel,
    handlePinch,
  }
}