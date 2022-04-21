import { absoluteValue, floorRoundUp, range, toTheNth } from '@GLOBAL/functions/numbers'
import { objectMap } from '@GLOBAL/functions/objects'
import type { Axis, Dimension, ZoomDirectionFactor, useUiStore } from '@FEATURES/blueprint/stores'
import type { Ref } from 'vue'
import type { Dictionary } from '@ROOT/src/types'
import type { Coordinates, GridExposed, Offsets } from '../types'

interface zoomSetterArguments {
  ui: ReturnType<typeof useUiStore>
  updateContentOffsets: (extraOffsets: Offsets) => void
  updateBackgroundOffsets: (extraOffsets: Offsets) => void
  bpInfo: Dictionary<Ref<number>>
  contentOffsets: Ref<Offsets>
  bgOffsets: Ref<Offsets>
  gridRefs: Ref<Object[]>
  contentScale: Ref<number>
}

export default function setZoomHandling({
  ui,
  updateContentOffsets,
  updateBackgroundOffsets,
  bpInfo,
  contentOffsets,
  bgOffsets,
  gridRefs,
  contentScale,
}: zoomSetterArguments) {
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
  const computeExtraOffset = (extraOffsetToBe: number, oldOffset: number, limit: number) => {
    const offsetTest = oldOffset + extraOffsetToBe
    if (offsetTest < 0) {
      const adjustmentFactor = absoluteValue(floorRoundUp(offsetTest / limit)) + (offsetTest % limit ? 1 : 0)
      return extraOffsetToBe + limit * adjustmentFactor
    }
    if (offsetTest >= limit) {
      const adjustmentFactor = floorRoundUp(offsetTest / limit)
      return extraOffsetToBe - limit * adjustmentFactor
    }
    return extraOffsetToBe
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
  const applyForEveryGrid = (fn: Function) => {
    const outputs: ReturnType<any>[] = []
    range(ui.gridConfig.gridAmount).forEach((i) => {
      outputs.push(fn(gridRefs.value[i]))
    })
    return outputs
  }
  const getCurrentBiggestSquareLength = () => {
    const squareLengths = applyForEveryGrid((grid: GridExposed) => grid.squareLength)
    return Math.max(...squareLengths)
  }
  const updateContentScale = (zoomFactor: ZoomDirectionFactor) => {
    const lastScaleContent = contentScale.value
    contentScale.value *= toTheNth(ui.zoomRate, zoomFactor)
    return { lastScaleContent, newScaleContent: contentScale.value }
  }
  const updateGridsAppearance = (zoomFactor: ZoomDirectionFactor) => {
    applyForEveryGrid((grid: GridExposed) => grid.updateAppearance(zoomFactor))
    return getCurrentBiggestSquareLength()
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
    handleZoom,
  }
}
