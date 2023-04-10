<script setup lang="ts">
  import { Blueprint } from '@FEATURES/blueprint/components'
  import ConceptComposition from './ConceptComposition'
  import { bpDepthKey } from '@FEATURES/blueprint/components/Blueprint/constants/symbols'
  import type { Concept } from '@API/gql-generated/graphql'

  defineProps<{ concept: Concept }>()

  const depth = inject(bpDepthKey, 0)
</script>

<template>
  <div class="open-concept">
    <Blueprint v-if="concept.composition" :depth="depth + 1">
      <ConceptComposition :concept="concept" />
    </Blueprint>
  </div>
</template>

<style scoped lang="postcss">
  .open-concept {
    @apply w-full h-full overflow-hidden border-[var(--foreground)];
  }
</style>
