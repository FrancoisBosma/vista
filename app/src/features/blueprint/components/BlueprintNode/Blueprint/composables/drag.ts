import { useUiStore } from '@FEATURES/blueprint/stores'
import type { setCommonHandling, setElemBoundingHandling } from '.'
import type { DragState } from '@SRC/types'
import type { Dimension, GridRefs, Offset, Offsets } from '@FEATURES/blueprint/types'

const ui = useUiStore()

type DragSetterArguments = {
  gridRefs: GridRefs
  bgOffsets: Offsets
  shouldDelegateTaskToRoot: boolean
  updateBpSubtreeBoundings: ReturnType<typeof setElemBoundingHandling>['updateBpSubtreeBoundings']
} & ReturnType<typeof setCommonHandling>

export default function setDragHandling({
  gridRefs,
  bgOffsets,
  shouldDelegateTaskToRoot,
  updateBpSubtreeBoundings,
  updateContentOffsets,
  updateBackgroundOffsets,
  getCurrentBiggestSquareLength,
  computeExtraOffset,
}: DragSetterArguments) {
  const handleDrag = (drag: DragState): void => {
    drag.event?.stopPropagation()
    if (shouldDelegateTaskToRoot) return ui.getBlueprintTreeRoot()?.bpRef.handleDrag(drag)
    // Offsets
    const contentOffsets = { width: drag.delta[0], height: drag.delta[1] } as Offsets
    updateContentOffsets(contentOffsets)
    const gridOffsets = objectMap(contentOffsets, (offset: Offset, dim: Dimension) =>
      computeExtraOffset(-1 * offset, bgOffsets[dim], getCurrentBiggestSquareLength(gridRefs))
    )
    updateBackgroundOffsets(gridOffsets)
    // Drag
    ui.isDragging = !(drag.first || drag.last)
    if (drag.first) ui.lastDragDistance = 0
    if (drag.last) {
      ui.lastDragDistance = drag.distance
      updateBpSubtreeBoundings()
    }
  }

  return {
    handleDrag,
  }
}
