<script setup lang="ts">
  import type { Concept } from '@API/gql-generated/graphql'

  defineProps<{ concept: Concept }>()

  // Lazy loading necessary because of mutual nesting
  const ConceptSFC = defineAsyncComponent(() => import('@FEATURES/blueprint/components/Concept'))
</script>

<template>
  <ConceptSFC
    v-for="(subConcept, index) in concept.composition?.subConcepts"
    :key="index"
    :concept-name="subConcept.concept.name"
    :wh="subConcept.wh"
  />
</template>
