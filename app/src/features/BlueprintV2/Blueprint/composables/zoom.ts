import { useUiStore } from '@FEATURES/BlueprintV2/stores'
import type { setDynamicContent } from '.'
import type { PinchState } from '@SRC/types'
import type {
  Axis,
  Coordinates,
  Dimension,
  Offsets,
  ZoomDirectionFactor,
} from '@FEATURES/BlueprintV2/types'
import type { BlueprintBackgroundSFC } from '@FEATURES/BlueprintV2/Blueprint/BlueprintBackground/types'
import type { GridSFC  } from '@FEATURES/BlueprintV2/Blueprint/BlueprintBackground/Grid/types'

const ui = useUiStore()

type ZoomSetterArguments = {
  boundingRect: ReturnType<typeof useElementBounding>
  bpBackground: Ref<BlueprintBackgroundSFC | null>
} & ReturnType<typeof setDynamicContent>

export default function setZoomHandling({
  contentOffsets,
  boundingRect,
  bpBackground,
  updateContentScale,
  updateContentOffsets,
}: ZoomSetterArguments) {

  // zoom computation
  const computeZoomToApply = (zoomFactor: ZoomDirectionFactor): number => toTheNth(ui.zoomRate, zoomFactor)
  const computeLengthDelta = (zoomToApply: number, length: number): number => (zoomToApply - 1) * length
  const computeZoomedContentOffsets = (zoomRelCoords: Coordinates, zoomFactor: ZoomDirectionFactor): Offsets => {
    const output: Record<string, number> = {}
    const { axes } = ui
    const zoomToApply = computeZoomToApply(zoomFactor)
    Object.entries(axes).forEach(([dim, axis]) => {
      const contentToZoomCenterDistance =
        boundingRect[<Dimension>dim].value / 2 + contentOffsets[<Dimension>dim] - zoomRelCoords[axis]
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
      const svgToZoomCenterDistance = bpBackground.value!.bgOffsets[<Dimension>dim] + zoomRelCoords[axis]
      const lengthDelta = (toTheNth(zoomRate, zoomFactor) - 1) * svgToZoomCenterDistance
      const extraOffset = bpBackground.value!.computeExtraOffset(
        lengthDelta,
        bpBackground.value!.bgOffsets[<Dimension>dim],
        biggestSquareLength
      )
      output[dim] = extraOffset
    })
    return output as Offsets
  }

  // update functions
  const updateGridsAppearance = (zoomFactor: ZoomDirectionFactor): number => {
    bpBackground.value!.applyForEveryGrid(
      bpBackground.value!.grids,
      (grid: GridSFC) => grid.updateAppearance(zoomFactor)
    )
    return bpBackground.value!.getCurrentBiggestSquareLength(bpBackground.value!.grids)
  }
  const updateBackground = (zoomRelativeCoords: Coordinates, zoomFactor: ZoomDirectionFactor): void => {
    const currentBiggestSquareLength = updateGridsAppearance(zoomFactor)
    const extraOffsets = computeZoomedGridOffsets(zoomRelativeCoords, zoomFactor, currentBiggestSquareLength)
    bpBackground.value!.updateBackgroundOffsets(extraOffsets)
  }
  const applyZoom = (zoomFactor: ZoomDirectionFactor, zoomRelativeCoords: Coordinates): void => {
    const zoomToApply = computeZoomToApply(zoomFactor)
    updateContentScale(zoomToApply)
    const extraContentOffsets = computeZoomedContentOffsets(zoomRelativeCoords, zoomFactor)
    updateContentOffsets(extraContentOffsets)
    updateBackground(zoomRelativeCoords, zoomFactor)
  }

  // ****************
  // Handle functions
  // ****************
  const canProceedWithHandle = (): boolean =>  {
    return Boolean(bpBackground.value)
  }
  const handleWheel = (event: WheelEvent): void => {
    if (!canProceedWithHandle()) return
    const zoomFactor: ZoomDirectionFactor =
      event.deltaY > 0 ? ui.zoomTypes.out.directionFactor : ui.zoomTypes.in.directionFactor
    const zoomRelativeCoords: Coordinates = objectMap(
      ui.axes,
      (axis: Axis) => event[axis] - boundingRect[axis].value,
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
      (axis: Axis, dim: Dimension, i: number) => origin[i] - boundingRect[axis].value,
      true
    )
    applyZoom(zoomFactor, zoomRelativeCoords)
  }, 250)
  const handlePinch = (pinch: PinchState): void => {
    pinch.event?.preventDefault()
    pinch.event?.stopPropagation()
    if (!canProceedWithHandle()) return
    throttledPinch(pinch.origin, pinch.offset)
  }

  return {
    handleWheel,
    handlePinch,
  }
}
