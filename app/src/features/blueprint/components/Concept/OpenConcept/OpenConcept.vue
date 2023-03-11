<script setup lang="ts">
  import ConceptSet from './ConceptSet'
  import type { Concept } from '@API/gql-generated/graphql'

  defineProps<{ concept: Concept; isHovered: Boolean }>()
</script>

<template>
  <div class="open-concept">
    <ConceptSet :concept-set="concept.composition?.subConcepts" />
  </div>
</template>

<style scoped lang="postcss">
  .open-concept {
    @apply p-4em rounded-10px border;
    border-color: v-bind('`var(${isHovered ? "--emphasis" : "--foreground"})`');
    box-shadow: v-bind('`${isHovered ? "0 0 3px var(--emphasis)" : "0 1px 3px rgba(0, 0, 0, 0.5)"}`');
  }
</style>
