<script setup lang="ts">
  import { Blueprint } from '@FEATURES/blueprint/components'
  import ConceptComposition from './ConceptComposition'
  import type { Concept } from '@API/gql-generated/graphql'
  import type { BlueprintDepth } from '@FEATURES/blueprint/types'

  defineProps<{ concept: Concept }>()

  const depth = inject<BlueprintDepth>('blueprint-depth', 0)
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
    /* DELETEME */
    width: 500px;
    height: 500px;
    /*  */
  }
</style>
