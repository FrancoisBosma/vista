<script setup lang="ts">
  import Concept from '@FEATURES/BlueprintV2/Content/Concept'
  import { contentProvideKey, getContentInfo } from '@FEATURES/BlueprintV2/Blueprint/ContentNode/utils'
  
  import type { ContentIdentification } from '@FEATURES/BlueprintV2/types'
  import type { Position } from '@FEATURES/BlueprintV2/Blueprint/ContentNode'

  type Props = { content: ContentIdentification, relativeToParentPosition?: Position }

  const DEFAULT_POSITION = { left: 0, top: 0 }

  const props = defineProps<Props>()
  
  const [contentType, contentKey] = getContentInfo(props.content)

  const nodeData = inject(contentProvideKey, {
    content: props.content,
    relativeToParentPosition: DEFAULT_POSITION,
    depth: 0,
    parentNodeAttributes: { position: DEFAULT_POSITION, scale: 1 },
  })

  provide(contentProvideKey, {
    ...nodeData,
    content: props.content,
    relativeToParentPosition: props.relativeToParentPosition ?? DEFAULT_POSITION,
  })
</script>

<template>
  <!-- <Concept v-if="contentType === 'concept'" :concept-name="contentKey" @content-fetched="" /> -->
  <Concept v-if="contentType === 'concept'" :concept-name="contentKey" />
</template>
