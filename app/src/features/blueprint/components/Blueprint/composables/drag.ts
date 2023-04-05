import { objectMap } from '@GLOBAL/functions/objects'
import { useUiStore } from '@FEATURES/blueprint/stores'
import type { setCommonHandling, setElemBoundingHandling } from './'
import type { DragState } from '@SRC/types'
import type { Dimension, Offset, Offsets } from '@FEATURES/blueprint/types'

const ui = useUiStore()

type DragSetterArguments = {
  gridRefs: Ref<(HTMLElement | null)[]>
  bgOffsets: Offsets
  updateBpBounding: ReturnType<typeof setElemBoundingHandling>['updateBpBounding']
} & ReturnType<typeof setCommonHandling>

export default function setDragHandling({
  gridRefs,
  bgOffsets,
  updateBpBounding,
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
    ui.isDragging = !(first || last)
    // Update Blueprint bounding info
    updateBpBounding()
  }

  return {
    handleDrag,
  }
}
