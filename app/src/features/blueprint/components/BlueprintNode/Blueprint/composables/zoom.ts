import { useConceptStore, useUiStore } from '@FEATURES/blueprint/stores'
import type { setCommonHandling, setElemBoundingHandling } from '.'
import type { Pair, PinchState } from '@SRC/types'
import type {
  Axis,
  ContentIdentification,
  Coordinates,
  Dimension,
  GridExposed,
  GridRefs,
  Offsets,
  ZoomDirectionFactor,
} from '@FEATURES/blueprint/types'

const ui = useUiStore()
const concepts = useConceptStore()

type ZoomSetterArguments = {
  boundingRect: ReturnType<typeof setElemBoundingHandling>['boundingRect']
  gridRefs: GridRefs
  contentIdentification: Ref<ContentIdentification | undefined>
  isRootBp: boolean
} & ReturnType<typeof setCommonHandling>

export default function setZoomHandling({
  contentOffsets,
  bgOffsets,
  boundingRect,
  gridRefs,
  contentIdentification,
  isRootBp,
  updateContentOffsets,
  updateBackgroundOffsets,
  applyForEveryGrid,
  getCurrentBiggestSquareLength,
  computeExtraOffset,
}: ZoomSetterArguments) {
  // content scale
  const initialContentScale = computed(() => {
    const leaveFunction = () => 1
    if (isRootBp) return leaveFunction()
    if (!contentIdentification.value) return leaveFunction()
    const [contentType, contentKey] = contentIdentification.value.split(':')
    if (contentType === 'concept') {
      const content = concepts.getStoreConcept(contentKey)
      if (!content?.wh) return leaveFunction()
      const [containerW, containerH] = getNumbersFromPair(content.wh as Pair<number>)
      const contentEdgePositions = ui.getContentEdgePositions(content)
      const contentDimensions = ui.getContentDisplayDimensions(contentEdgePositions)
      const extractedContentDimensions = getNumbersFromPair(contentDimensions)
      const widthNecessaryScale = containerW / extractedContentDimensions[0]
      const heightNecessaryScale = containerH / extractedContentDimensions[1]
      return Math.min(widthNecessaryScale, heightNecessaryScale)
    }
    return leaveFunction()
  })
  const contentScaleModifier = ref(1)
  const contentScale = computed(() => initialContentScale.value * contentScaleModifier.value)

  // zoom computation
  const computeZoomToApply = (zoomFactor: ZoomDirectionFactor): number => toTheNth(ui.zoomRate, zoomFactor)
  const computeLengthDelta = (zoomToApply: number, length: number): number => (zoomToApply - 1) * length
  const computeZoomedContentOffsets = (zoomRelCoords: Coordinates, zoomFactor: ZoomDirectionFactor): Offsets => {
    const output: Record<string, number> = {}
    const { axes } = ui
    const zoomToApply = computeZoomToApply(zoomFactor)
    Object.entries(axes).forEach(([dim, axis]) => {
      const contentToZoomCenterDistance =
        boundingRect.value![<Dimension>dim] / 2 + contentOffsets[<Dimension>dim] - zoomRelCoords[axis]
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

  // update functions
  const updateContentScale = (zoomFactor: ZoomDirectionFactor): void => {
    const zoomToApply = computeZoomToApply(zoomFactor)
    contentScaleModifier.value *= zoomToApply
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
  const applyZoom = (zoomFactor: ZoomDirectionFactor, zoomRelativeCoords: Coordinates): void => {
    updateContentScale(zoomFactor)
    const extraContentOffsets = computeZoomedContentOffsets(zoomRelativeCoords, zoomFactor)
    updateContentOffsets(extraContentOffsets)
    updateBackground(zoomRelativeCoords, zoomFactor)
  }

  // handle functions
  const handleWheel = (event: WheelEvent): void => {
    if (!isRootBp) return ui.getBlueprintTreeRoot()?.bpRef.handleWheel(event)
    const zoomFactor: ZoomDirectionFactor =
      event.deltaY > 0 ? ui.zoomTypes.out.directionFactor : ui.zoomTypes.in.directionFactor
    const zoomRelativeCoords: Coordinates = objectMap(
      ui.axes,
      (axis: Axis) => event[axis] - boundingRect.value![axis],
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
      (axis: Axis, dim: Dimension, i: number) => origin[i] - boundingRect.value![axis],
      true
    )
    applyZoom(zoomFactor, zoomRelativeCoords)
  }, 250)
  const handlePinch = (pinch: PinchState): void => {
    if (!isRootBp) return ui.getBlueprintTreeRoot()?.bpRef.handlePinch(pinch)
    pinch.event?.preventDefault()
    pinch.event?.stopPropagation()
    throttledPinch(pinch.origin, pinch.offset)
  }

  return {
    contentScale,
    handleWheel,
    handlePinch,
  }
}
