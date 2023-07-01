<script setup lang="ts">
  import { BlueprintNode } from '@FEATURES/blueprint/components'
  import ConceptComposition from './ConceptComposition'
  import { useUiStore } from '@FEATURES/blueprint/stores'
  import type { Concept } from '@API/gql-generated/graphql'

  const props = defineProps<{ concept: Concept }>()
  const { concept } = toRefs(props)
  const ui = useUiStore()

  const contentEdgePositions = ui.getContentEdgePositions(concept)
  const contentDimensions = ui.getContentDisplayDimensions(contentEdgePositions)
</script>

<template>
  <div class="open-concept">
    <BlueprintNode v-if="concept.composition" :content-dimensions="contentDimensions">
      <ConceptComposition :concept="concept" :content-edge-positions="contentEdgePositions" />
    </BlueprintNode>
  </div>
</template>

<style scoped lang="postcss">
  .open-concept {
    @apply w-full h-full overflow-hidden border-[var(--foreground)];
  }
</style>
