<script setup lang="ts">
  import { getConceptEdgePositions, getSubConceptPosition } from '@FEATURES/BlueprintV2/Blueprint/ContentNode/utils'
  import { setConceptRecursivity } from './composables'

  import type { Concept } from '@FEATURES/BlueprintV2/types'
  // Lazy loading necessary because of mutual nesting
  const ContentNode = defineAsyncComponent(() => import('@FEATURES/BlueprintV2/Blueprint/ContentNode'))

  const { concept } = defineProps<{ concept: Concept }>()

  const { nodeAttributes } = setConceptRecursivity()

  const conceptEdgePositions = getConceptEdgePositions(concept)
  const subConceptsDisplays = concept.composition!.subConcepts.map((subConcept) => ({
    name: subConcept.concept.name, position: getSubConceptPosition(conceptEdgePositions, subConcept)
  }))
</script>

<template>
  <ul class="absolute">
    <li v-for="subConceptDisplay in subConceptsDisplays">
      <ContentNode
        :content="`concept:${subConceptDisplay.name}`"
        :relative-to-parent-position="subConceptDisplay.position"
        :style="{
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          left: `${subConceptDisplay.position.left}px`,
          top: `${subConceptDisplay.position.top}px`,
        }"
      />
    </li>
  </ul>
</template>

<style scoped lang="postcss">
</style>
