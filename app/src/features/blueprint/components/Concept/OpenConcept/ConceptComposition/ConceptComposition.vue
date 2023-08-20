<script setup lang="ts">
  import { useUiStore } from '@FEATURES/blueprint/stores'
  import type { Concept } from '@API/gql-generated/graphql'

  const { concept } = defineProps<{
    concept: Concept
  }>()

  const ui = useUiStore()

  // Lazy loading necessary because of mutual nesting
  const ConceptSFC = defineAsyncComponent(() => import('@FEATURES/blueprint/components/Concept'))

  const contentEdgePositions = ui.getContentEdgePositions(concept)
</script>

<template>
  <ConceptSFC
    v-for="(subConcept, index) in concept.composition?.subConcepts"
    :key="index"
    :concept-name="subConcept.concept.name"
    :sub-concept-style="ui.getSubConceptStyle(contentEdgePositions, subConcept)"
  />
</template>
