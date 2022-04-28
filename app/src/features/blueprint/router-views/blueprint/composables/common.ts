import { absoluteValue, floorRoundUp, range } from '@GLOBAL/functions/numbers'
import type { Dimension, GridExposed, GridRefs, Offsets, useUiStore } from '@FEATURES/blueprint/stores'

interface CommonSetterArguments {
  ui: ReturnType<typeof useUiStore>
}

export default function setCommonHandling({ ui }: CommonSetterArguments) {
  const bgOffsets = ref({
    width: ui.gridConfig.middleSizeSquare.length / 2,
    height: ui.gridConfig.middleSizeSquare.length / 2,
  } as Offsets)
  const contentOffsets = ref({ width: 0, height: 0 } as Offsets)

  const updateContentOffsets = (extraOffsets: Offsets) =>
    (Object.keys(extraOffsets) as Dimension[]).forEach((dim) => {
      contentOffsets.value[dim] += extraOffsets[dim]
    })
  const updateBackgroundOffsets = (extraOffsets: Offsets) =>
    (Object.keys(extraOffsets) as Dimension[]).forEach((dim) => {
      bgOffsets.value[dim] += extraOffsets[dim]
    })
  const applyForEveryGrid = (gridRefs: GridRefs, fn: Function) => {
    const outputs: ReturnType<any>[] = []
    range(ui.gridConfig.gridAmount).forEach((i) => {
      outputs.push(fn(gridRefs.value[i]))
    })
    return outputs
  }
  const getCurrentBiggestSquareLength = (gridRefs: GridRefs) => {
    const squareLengths = applyForEveryGrid(gridRefs, (grid: GridExposed) => grid.squareLength)
    return Math.max(...squareLengths)
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
  return {
    bgOffsets,
    contentOffsets,
    updateContentOffsets,
    updateBackgroundOffsets,
    applyForEveryGrid,
    getCurrentBiggestSquareLength,
    computeExtraOffset,
  }
}
