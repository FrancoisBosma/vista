import { useUiStore } from '@FEATURES/BlueprintV2/stores'
import type { Dimension, Offsets } from '@FEATURES/BlueprintV2/types'

const ui = useUiStore()

export default function setDynamicAppearance() {
  const contentOffsets = reactive({ width: 0, height: 0 } as Offsets)
  // const initialContentScale = computed(() => {
  //   const leaveFunction = () => 1
  //   if (isRootBp) return leaveFunction()
  //   if (!contentIdentification.value) return leaveFunction()
  //   const [contentType, contentKey] = contentIdentification.value.split(':')
  //   if (contentType === 'concept') {
  //     const content = concepts.getStoreConcept(contentKey)
  //     if (!content?.wh) return leaveFunction()
  //     const [containerW, containerH] = getNumbersFromPair(content.wh as Pair<number>)
  //     const contentEdgePositions = ui.getContentEdgePositions(content)
  //     const contentDimensions = ui.getContentDisplayDimensions(contentEdgePositions)
  //     const extractedContentDimensions = getNumbersFromPair(contentDimensions)
  //     const widthNecessaryScale = containerW / extractedContentDimensions[0]
  //     const heightNecessaryScale = containerH / extractedContentDimensions[1]
  //     return Math.min(widthNecessaryScale, heightNecessaryScale)
  //   }
  //   return leaveFunction()
  // })
  // const contentScaleModifier = ref(1)
  // const contentScale = computed(() => initialContentScale.value * contentScaleModifier.value)
  const contentScale = ref(1)
  const contentTransform = computed(
    () => `translate(${contentOffsets.width}px, ${contentOffsets.height}px) scale(${contentScale.value})`
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
