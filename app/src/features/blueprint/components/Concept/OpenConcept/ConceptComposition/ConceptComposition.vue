<script setup lang="ts">
  import type { Concept } from '@API/gql-generated/graphql'
  import type { BlueprintBackgroundColor } from '@FEATURES/blueprint/types'

  const props = defineProps<{ blueprintBgColor: BlueprintBackgroundColor; concept: Concept }>()
  const { blueprintBgColor } = toRefs(props)

  // Lazy loading necessary because of the mutual nesting of OpenTile and ConceptComposition
  const ConceptSFC = defineAsyncComponent(() => import('@FEATURES/blueprint/components/Concept'))
</script>

<template>
  <ConceptSFC
    v-for="(subConcept, index) in concept.composition?.subConcepts"
    :key="index"
    :concept-name="subConcept.concept.name"
    :blueprint-bg-color="blueprintBgColor"
  />
</template>
