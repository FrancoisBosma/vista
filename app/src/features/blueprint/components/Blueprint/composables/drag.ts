import { objectMap } from '@GLOBAL/functions/objects'
import type { setCommonHandling } from './'
import type { DragState } from '@SRC/types'
import type { Dimension, GridRefs, Offset, Offsets } from '@FEATURES/blueprint/types'
import type { useUiStore } from '@FEATURES/blueprint/stores'

type DragSetterArguments = {
  ui: ReturnType<typeof useUiStore>
  gridRefs: GridRefs
  bgOffsets: Offsets
} & ReturnType<typeof setCommonHandling>

export default function setDragHandling({
  ui,
  gridRefs,
  bgOffsets,
  updateContentOffsets,
  updateBackgroundOffsets,
  getCurrentBiggestSquareLength,
  computeExtraOffset,
}: DragSetterArguments) {
  const handleDrag = ({ delta, first, last, event }: DragState) => {
    event?.stopPropagation()
    // Offsets
    const contentOffsets = { width: delta[0], height: delta[1] } as Offsets
    updateContentOffsets(contentOffsets)
    const gridOffsets = objectMap(contentOffsets, (offset: Offset, dim: Dimension) =>
      computeExtraOffset(-1 * offset, bgOffsets[dim], getCurrentBiggestSquareLength(gridRefs))
    )
    updateBackgroundOffsets(gridOffsets)
    // Drag
    ui.dragState = last ? 'idle' : first ? 'dragStart' : 'dragged'
  }

  return {
    handleDrag,
  }
}
