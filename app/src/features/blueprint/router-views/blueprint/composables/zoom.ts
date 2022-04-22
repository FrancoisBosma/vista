import { toTheNth } from '@GLOBAL/functions/numbers'
import { objectMap } from '@GLOBAL/functions/objects'
import type { setCommonHandling } from './'
import type { Ref } from 'vue'
import type { Axis, Dimension, ZoomDirectionFactor, useUiStore } from '@FEATURES/blueprint/stores'
import type { Dictionary } from '@ROOT/src/types'
import type { BlueprintInfo, Coordinates, GridExposed, GridRefs, Offsets } from '../types'

interface ZoomSetterArguments {
  ui: ReturnType<typeof useUiStore>
  contentOffsets: Ref<Offsets>
  bgOffsets: Ref<Offsets>
  bpInfo: BlueprintInfo
  gridRefs: GridRefs
  updateContentOffsets: ReturnType<typeof setCommonHandling>['updateContentOffsets']
  updateBackgroundOffsets: ReturnType<typeof setCommonHandling>['updateBackgroundOffsets']
  applyForEveryGrid: ReturnType<typeof setCommonHandling>['applyForEveryGrid']
  getCurrentBiggestSquareLength: ReturnType<typeof setCommonHandling>['getCurrentBiggestSquareLength']
  computeExtraOffset: ReturnType<typeof setCommonHandling>['computeExtraOffset']
}

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
    const output: Dictionary<number> = {}
    const { axes } = ui
    Object.entries(axes).forEach(([dim, axis]) => {
      const contentToZoomCenterDistance =
        bpInfo[dim].value / 2 + contentOffsets.value[dim as Dimension] - zoomRelCoords[axis]
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
    const output: Dictionary<number> = {}
    const { axes, zoomRate } = ui
    Object.entries(axes).forEach(([dim, axis]) => {
      const svgToZoomCenterDistance = bgOffsets.value[dim as Dimension] + zoomRelCoords[axis]
      const lengthDelta = (toTheNth(zoomRate, zoomFactor) - 1) * svgToZoomCenterDistance
      const extraOffset = computeExtraOffset(lengthDelta, bgOffsets.value[dim as Dimension], biggestSquareLength)
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
  const handleZoom = (event: WheelEvent) => {
    const zoomFactor: ZoomDirectionFactor =
      event.deltaY > 0 ? ui.zoomTypes.out.directionFactor : ui.zoomTypes.in.directionFactor
    const zoomRelativeCoords: Coordinates = objectMap(ui.axes, (axis: Axis) => event[axis] - bpInfo[axis].value, true)
    // Calling update methods ...
    const { lastScaleContent, newScaleContent } = updateContentScale(zoomFactor)
    const extraContentOffsets = computeZoomedContentOffsets(zoomRelativeCoords, newScaleContent, lastScaleContent)
    updateContentOffsets(extraContentOffsets)
    updateBackground(zoomRelativeCoords, zoomFactor)
  }

  return {
    contentScale,
    handleZoom,
  }
}
