<script setup lang="ts">
  import type { Concept, SubConcept } from '@API/gql-generated/graphql'

  defineProps<{ concept: Concept }>()

  // Lazy loading necessary because of mutual nesting
  const ConceptSFC = defineAsyncComponent(() => import('@FEATURES/blueprint/components/Concept'))

  const getSubConceptStyle = (sc: SubConcept): Record<string, string> => {
    const positionValues = sc.xy?.split(':')
    if (positionValues?.length !== 2) return {}
    return { transform: `translate(calc(-50% + ${positionValues[0]}px), calc(-50% + ${positionValues[1]}px))` }
  }
</script>

<template>
  <ConceptSFC
    v-for="(subConcept, index) in concept.composition?.subConcepts"
    :key="index"
    :concept-name="subConcept.concept.name"
    :wh="subConcept.wh"
    class="absolute"
    :style="getSubConceptStyle(subConcept)"
  />
</template>
