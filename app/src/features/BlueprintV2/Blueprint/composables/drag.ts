import { useBlueprintStore } from '@FEATURES/BlueprintV2/stores'
import type { setDynamicContent } from '.'
import type { DragState } from '@SRC/types'
import type { Dimension, Offset, Offsets } from '@FEATURES/BlueprintV2/types'
import type { BlueprintBackgroundSFC } from '@FEATURES/BlueprintV2/Blueprint/BlueprintBackground/types'

const ui = useBlueprintStore()

type DragSetterArguments = {
  bpBackground: Ref<BlueprintBackgroundSFC | null>
} & ReturnType<typeof setDynamicContent>

export default function setDragHandling({
  bpBackground,
  updateContentOffsets,
}: DragSetterArguments) {

  const canProceedWithHandle = (elRef: typeof bpBackground): elRef is Ref<BlueprintBackgroundSFC>  =>  {
    return Boolean(elRef.value)
  }
  const handleDrag = (drag: DragState): void => {
    drag.event?.stopPropagation()
    if (!canProceedWithHandle(bpBackground)) return
    const {
      computeExtraOffset,
      getCurrentBiggestSquareLength,
      updateBackgroundOffsets,
      grids,
      bgOffsets,
    } = bpBackground.value
    // Offsets
    const contentOffsets = { width: drag.delta[0], height: drag.delta[1] } as Offsets
    updateContentOffsets(contentOffsets)
    const gridOffsets = objectMap(contentOffsets, (offset: Offset, dim: Dimension) =>
      computeExtraOffset(
        -1 * offset, bgOffsets[dim],
        getCurrentBiggestSquareLength(grids)
      )
    )
    updateBackgroundOffsets(gridOffsets)
    // Drag
    ui.isDragging = !(drag.first || drag.last)
    if (drag.first) ui.lastDragDistance = 0
    if (drag.last) ui.lastDragDistance = drag.distance
  }

  return {
    handleDrag,
  }
}
