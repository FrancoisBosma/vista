import { useBlueprintStore } from '@FEATURES/BlueprintV2/stores'
import type { Dimension, Offsets, OffsetSide } from '@FEATURES/BlueprintV2/types'
import type { GridSFC, Grids } from '@FEATURES/BlueprintV2/Blueprint/BlueprintBackground/Grid/types'

const ui = useBlueprintStore()

interface DynamicAppearanceSetterArguments {
  contentOffsets: Ref<Offsets>
}

export default function setDynamicAppearance({
  contentOffsets,
}: DynamicAppearanceSetterArguments) {
  const bgOffsets = reactive({
    width: ui.gridConfig.middleSizeSquare.length / 2,
    height: ui.gridConfig.middleSizeSquare.length / 2,
  } as Offsets)
  const bgDimensions = computed(() => ({
    left: `-${bgOffsets.width}px`,
    top: `-${bgOffsets.height}px`,
    width: `calc(100% + ${bgOffsets.width}px)`,
    height: `calc(100% + ${bgOffsets.height}px)`,
  }))
  const bgExtraPosition = computed(
    () =>
      ({
        left: `calc(50% + ${contentOffsets.value.width}px)`,
        top: `calc(50% + ${contentOffsets.value.height}px)`,
      } as Record<OffsetSide, string>)
  )
  //
  // ** Methods **
  //
  const updateBackgroundOffsets = (extraOffsets: Offsets): void =>
    (Object.keys(extraOffsets) as Dimension[]).forEach((dim) => {
      bgOffsets[dim] += extraOffsets[dim]
    })
  const applyForEveryGrid = (grids: Grids, fn: (grid: GridSFC) => any): Array<ReturnType<typeof fn>> => {
    const outputs: ReturnType<typeof fn>[] = []
    range(ui.gridConfig.gridAmount).forEach((i) => {
      outputs.push(fn(grids[i]))
    })
    return outputs
  }
  const getCurrentBiggestSquareLength = (grids: Grids): number => {
    const squareLengths = applyForEveryGrid(grids, (grid: GridSFC) => grid.squareLength)
    return Math.max(...squareLengths)
  }
  const computeExtraOffset = (extraOffsetToBe: number, oldOffset: number, limit: number): number => {
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
    bgDimensions,
    bgExtraPosition,
    updateBackgroundOffsets,
    applyForEveryGrid,
    getCurrentBiggestSquareLength,
    computeExtraOffset,
  }
}
