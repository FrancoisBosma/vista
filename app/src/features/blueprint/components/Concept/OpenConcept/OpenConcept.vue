<script setup lang="ts">
  import { BlueprintNode } from '@FEATURES/blueprint/components'
  import ConceptComposition from './ConceptComposition'
  import type { Concept } from '@API/gql-generated/graphql'

  const props = defineProps<{ concept: Concept }>()

  const { concept } = toRefs(props)
</script>

<template>
  <div class="open-concept">
    <BlueprintNode v-if="concept.composition" :content-identification="`concept:${concept.name}`">
      <ConceptComposition :concept="concept" />
    </BlueprintNode>
  </div>
</template>

<style scoped lang="postcss">
  .open-concept {
    @apply w-full h-full overflow-hidden border-[var(--foreground)];
  }
</style>
