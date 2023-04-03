<script setup lang="ts">
  import { Blueprint } from '@FEATURES/blueprint/components'
  import ConceptComposition from './ConceptComposition'
  import type { Concept } from '@API/gql-generated/graphql'
  import type { BlueprintDepth } from '@FEATURES/blueprint/types'

  const props = defineProps<{
    concept: Concept
    isHovered: Boolean
  }>()
  const { isHovered } = toRefs(props)

  const depth = inject<BlueprintDepth>('blueprint-depth', 0)

  const borderColor = computed(() => `var(${isHovered.value ? '--emphasis' : '--foreground'})`)
  const boxShadow = computed(() => `${isHovered.value ? '0 0 3px var(--emphasis)' : '0 1px 3px rgba(0, 0, 0, 0.5)'}`)
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
    @apply w-full h-full border rounded-10px overflow-hidden;
    border-color: v-bind('borderColor');
    box-shadow: v-bind('boxShadow');
    /* DELETEME */
    width: 500px;
    height: 500px;
    /*  */
  }
</style>
