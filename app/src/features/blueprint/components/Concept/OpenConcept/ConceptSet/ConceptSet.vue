<script setup lang="ts">
  import type { MinimalSubConcept, SubConcept } from '@FEATURES/blueprint/types'

  // Lazy loading necessary because of the mutual nesting of OpenTile and TileList
  const ConceptSFC = defineAsyncComponent(() => import('../..'))

  defineProps<{ conceptSet: MinimalSubConcept[] | SubConcept[] | undefined }>()
</script>

<template>
  <div v-if="conceptSet" class="concept-set">
    <template v-for="(subConcept, index) in conceptSet" :key="index">
      <ConceptSFC :concept-name="subConcept.concept.name" />
      <div v-if="index !== conceptSet.length - 1" class="concept_link" />
    </template>
  </div>
</template>

<style scoped lang="postcss">
  .concept-set {
    @apply flex items-center;
  }
  .concept_link {
    @apply w-50px border-dashed border-b-2;
  }
</style>
