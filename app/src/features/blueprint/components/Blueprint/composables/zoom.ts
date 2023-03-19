import { toTheNth } from '@GLOBAL/functions/numbers'
import { objectMap } from '@GLOBAL/functions/objects'
import type { setCommonHandling } from '.'
import type { PinchState } from '@SRC/types'
import type {
  Axis,
  BlueprintInfo,
  Coordinates,
  Dimension,
  GridExposed,
  GridRefs,
  Offsets,
  ZoomDirectionFactor,
} from '@FEATURES/blueprint/types'
import type { useUiStore } from '@FEATURES/blueprint/stores'

type ZoomSetterArguments = {
  ui: ReturnType<typeof useUiStore>
  bpInfo: BlueprintInfo
  gridRefs: GridRefs
} & ReturnType<typeof setCommonHandling>

export default function setZoomHandling({
  ui,
  contentOffsets,
  bgOffsets,
  bpInfo,
  gridRefs,
  updateContentOffsets,
  updateBackgroundOffsets,
  applyForEveryGrid,
  getCurrentBiggestSquareLength,
  computeExtraOffset,
}: ZoomSetterArguments) {
  const contentScale = ref(1)

  const computeLengthDelta = (newScale: number, lastScale: number, length: number) =>
    (newScale / lastScale - 1) * length
  const computeZoomedContentOffsets = (zoomRelCoords: Coordinates, newScale: number, lastScale: number): Offsets => {
    const output: Record<string, number> = {}
    const { axes } = ui
    Object.entries(axes).forEach(([dim, axis]) => {
      const contentToZoomCenterDistance = bpInfo[dim].value / 2 + contentOffsets[dim as Dimension] - zoomRelCoords[axis]
      const extraContentOffset = computeLengthDelta(newScale, lastScale, contentToZoomCenterDistance)
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
      const svgToZoomCenterDistance = bgOffsets[dim as Dimension] + zoomRelCoords[axis]
      const lengthDelta = (toTheNth(zoomRate, zoomFactor) - 1) * svgToZoomCenterDistance
      const extraOffset = computeExtraOffset(lengthDelta, bgOffsets[dim as Dimension], biggestSquareLength)
      output[dim] = extraOffset
    })
    return output as Offsets
  }
  const updateContentScale = (zoomFactor: ZoomDirectionFactor) => {
    const lastScaleContent = contentScale.value
    contentScale.value *= toTheNth(ui.zoomRate, zoomFactor)
    return { lastScaleContent, newScaleContent: contentScale.value }
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
    const { lastScaleContent, newScaleContent } = updateContentScale(zoomFactor)
    const extraContentOffsets = computeZoomedContentOffsets(zoomRelativeCoords, newScaleContent, lastScaleContent)
    updateContentOffsets(extraContentOffsets)
    updateBackground(zoomRelativeCoords, zoomFactor)
  }
  const handleWheel = (event: WheelEvent) => {
    const zoomFactor: ZoomDirectionFactor =
      event.deltaY > 0 ? ui.zoomTypes.out.directionFactor : ui.zoomTypes.in.directionFactor
    const zoomRelativeCoords: Coordinates = objectMap(ui.axes, (axis: Axis) => event[axis] - bpInfo[axis].value, true)
    applyZoom(zoomFactor, zoomRelativeCoords)
  }
  const throttledPinch = useThrottleFn((origin, offset) => {
    const scaleFactor = offset[0]
    if (scaleFactor === 1) return
    const zoomFactor: ZoomDirectionFactor =
      scaleFactor > 1 ? ui.zoomTypes.in.directionFactor : ui.zoomTypes.out.directionFactor
    const zoomRelativeCoords: Coordinates = objectMap(
      ui.axes,
      (axis: Axis, dim: Dimension, i: number) => origin[i] - bpInfo[axis].value,
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
