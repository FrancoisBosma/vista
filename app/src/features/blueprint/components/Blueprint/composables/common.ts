import { absoluteValue, floorRoundUp, range } from '@GLOBAL/functions/numbers'
import { useUiStore } from '@FEATURES/blueprint/stores'
import type { Dimension, GridExposed, Offsets } from '@FEATURES/blueprint/types'

type GridRefs = Ref<Array<HTMLElement | null>>

const ui = useUiStore()

export default function setCommonHandling() {
  const bgOffsets = reactive({
    width: ui.gridConfig.middleSizeSquare.length / 2,
    height: ui.gridConfig.middleSizeSquare.length / 2,
  } as Offsets)
  const contentOffsets = reactive({ width: 0, height: 0 } as Offsets)

  const updateContentOffsets = (extraOffsets: Offsets) =>
    (Object.keys(extraOffsets) as Dimension[]).forEach((dim) => {
      contentOffsets[dim] += extraOffsets[dim]
    })
  const updateBackgroundOffsets = (extraOffsets: Offsets) =>
    (Object.keys(extraOffsets) as Dimension[]).forEach((dim) => {
      bgOffsets[dim] += extraOffsets[dim]
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
