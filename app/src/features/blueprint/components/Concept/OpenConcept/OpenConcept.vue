<script setup lang="ts">
  import ConceptComposition from './ConceptComposition'
  import type { Concept } from '@API/gql-generated/graphql'

  const props = defineProps<{ concept: Concept; isHovered: Boolean }>()
  const { isHovered } = toRefs(props)

  const borderColor = computed(() => `var(${isHovered.value ? '--emphasis' : '--foreground'})`)
  const boxShadow = computed(() => `${isHovered.value ? '0 0 3px var(--emphasis)' : '0 1px 3px rgba(0, 0, 0, 0.5)'}`)
</script>

<template>
  <div class="open-concept">
    <ConceptComposition
      v-if="concept.composition"
      :sub-concept-set="concept.composition?.subConcepts"
      :connections="concept.composition?.connections"
    />
  </div>
</template>

<style scoped lang="postcss">
  .open-concept {
    @apply border rounded-10px;
    border-color: v-bind('borderColor');
    box-shadow: v-bind('boxShadow');
  }
</style>
