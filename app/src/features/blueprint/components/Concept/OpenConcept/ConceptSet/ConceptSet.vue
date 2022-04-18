<script setup lang="ts">
  import type { Concept as ConceptType } from '@FEATURES/blueprint/stores'

  // Lazy loading necessary because of the mutual nesting of OpenTile and TileList
  const Concept = defineAsyncComponent(() => import('../..'))

  defineProps<{ conceptSet: ConceptType[] }>()
</script>

<template>
  <div class="concept-set">
    <template v-for="(concept, index) in conceptSet" :key="index">
      <Concept :concept="concept" />
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
