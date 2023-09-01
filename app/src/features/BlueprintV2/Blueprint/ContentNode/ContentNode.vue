<script setup lang="ts">
  import Concept from '@FEATURES/BlueprintV2/Content/Concept'
  import type { ContentIdentification } from '@FEATURES/BlueprintV2/types'
  
  const { content } = defineProps<{ content: ContentIdentification }>()
  const [contentType, contentKey] = content.split(':')
  const contentSFC = contentType === 'concept' ? Concept : Concept
</script>

<template>
  <component
    :is="contentSFC"
    :content-key="contentKey"
  />
</template>
