import { useBlueprintStore } from '@FEATURES/BlueprintV2/stores'
import type { Dimension, Offsets } from '@FEATURES/BlueprintV2/types'

const ui = useBlueprintStore()

export default function setDynamicAppearance() {
  const contentOffsets = reactive({ width: 0, height: 0 } as Offsets)
  const contentScale = ref(1)
  const contentTransform = computed(
    () => `translate(calc(-50% + ${contentOffsets.width}px), calc(-50% + ${contentOffsets.height}px))\
    scale(${contentScale.value})`
  )
  const contentZIndex = 2 * ui.gridConfig.zoom.levelReset + 1
  //
  // >> Methods
  //
  const updateContentOffsets = (extraOffsets: Offsets) =>
    (Object.keys(extraOffsets) as Dimension[]).forEach((dim) => {
      contentOffsets[dim] += extraOffsets[dim]
    })
  const updateContentScale = (zoomToApply: number): void => {
    contentScale.value *= zoomToApply
  }

  return {
    contentOffsets,
    contentScale,
    contentTransform,
    contentZIndex,
    updateContentOffsets,
    updateContentScale,
  }
}
