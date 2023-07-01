<script setup lang="ts">
  import { useUiStore } from '@FEATURES/blueprint/stores'
  import type { Concept } from '@API/gql-generated/graphql'

  const props = defineProps<{
    concept: Concept
    contentEdgePositions: ReturnType<ReturnType<typeof useUiStore>['getContentEdgePositions']>
  }>()
  const { contentEdgePositions } = toRefs(props)
  const ui = useUiStore()

  // Lazy loading necessary because of mutual nesting
  const ConceptSFC = defineAsyncComponent(() => import('@FEATURES/blueprint/components/Concept'))
</script>

<template>
  <ConceptSFC
    v-for="(subConcept, index) in concept.composition?.subConcepts"
    :key="index"
    :concept-name="subConcept.concept.name"
    :wh="subConcept.wh"
    class="absolute"
    :style="ui.getSubConceptStyle(contentEdgePositions, subConcept)"
  />
</template>
