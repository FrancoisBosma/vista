<script setup lang="ts">
  import type { ConceptComposition, SubConcept } from '@API/gql-generated/graphql'

  // Lazy loading necessary because of the mutual nesting of OpenTile and ConceptComposition
  const Concept = defineAsyncComponent(() => import('../..'))

  defineProps<{ subConceptSet: SubConcept[]; connections: ConceptComposition['connections'] }>()
</script>

<template>
  <Concept v-for="(subConcept, index) in subConceptSet" :key="index" :concept-name="subConcept.concept.name" />
</template>
