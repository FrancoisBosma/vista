<script setup lang="ts">
  import { Blueprint } from '@FEATURES/blueprint/components'
  import ConceptComposition from './ConceptComposition'
  import { BlueprintBackgroundColor } from '@FEATURES/blueprint/types'
  import type { Concept } from '@API/gql-generated/graphql'

  const props = defineProps<{
    concept: Concept
    isHovered: Boolean
    blueprintBgColor: BlueprintBackgroundColor
  }>()
  const { isHovered, blueprintBgColor } = toRefs(props)

  const borderColor = computed(() => `var(${isHovered.value ? '--emphasis' : '--foreground'})`)
  const boxShadow = computed(() => `${isHovered.value ? '0 0 3px var(--emphasis)' : '0 1px 3px rgba(0, 0, 0, 0.5)'}`)
  const nextBgColor =
    blueprintBgColor.value === BlueprintBackgroundColor.normal
      ? BlueprintBackgroundColor.stronger
      : BlueprintBackgroundColor.normal
</script>

<template>
  <div class="open-concept">
    <Blueprint v-if="concept.composition" :bg-color="nextBgColor">
      <ConceptComposition :concept="concept" :blueprint-bg-color="nextBgColor" />
    </Blueprint>
  </div>
</template>

<style scoped lang="postcss">
  .open-concept {
    @apply border rounded-10px;
    border-color: v-bind('borderColor');
    box-shadow: v-bind('boxShadow');
  }
</style>
