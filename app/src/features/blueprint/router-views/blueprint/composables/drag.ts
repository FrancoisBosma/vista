import { objectMap } from '@GLOBAL/functions/objects'
import type { Ref } from 'vue'
import type { setCommonHandling } from './'
import type { DragState } from '@SRC/types'
import type { Dimension, GridRefs, Offset, Offsets, useUiStore } from '@FEATURES/blueprint/stores'

interface DragSetterArguments {
  ui: ReturnType<typeof useUiStore>
  gridRefs: GridRefs
  bgOffsets: Ref<Offsets>
  updateContentOffsets: ReturnType<typeof setCommonHandling>['updateContentOffsets']
  updateBackgroundOffsets: ReturnType<typeof setCommonHandling>['updateBackgroundOffsets']
  getCurrentBiggestSquareLength: ReturnType<typeof setCommonHandling>['getCurrentBiggestSquareLength']
  computeExtraOffset: ReturnType<typeof setCommonHandling>['computeExtraOffset']
}

export default function setDragHandling({
  ui,
  gridRefs,
  bgOffsets,
  updateContentOffsets,
  updateBackgroundOffsets,
  getCurrentBiggestSquareLength,
  computeExtraOffset,
}: DragSetterArguments) {
  const handleDrag = ({ delta, first, last }: DragState) => {
    // Offsets
    const contentOffsets = { width: delta[0], height: delta[1] } as Offsets
    updateContentOffsets(contentOffsets)
    const gridOffsets = objectMap(contentOffsets, (offset: Offset, dim: Dimension) =>
      computeExtraOffset(-1 * offset, bgOffsets.value[dim], getCurrentBiggestSquareLength(gridRefs))
    )
    updateBackgroundOffsets(gridOffsets)
    // Drag
    ui.dragState = last ? 'idle' : first ? 'dragStart' : 'dragged'
  }

  return {
    handleDrag,
  }
}
