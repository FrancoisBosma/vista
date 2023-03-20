<script setup lang="ts">
  import CloseConcept from './CloseConcept'
  import OpenConcept from './OpenConcept'
  import { useConceptStore } from '@FEATURES/blueprint/stores'
  import { setManipulationHandling, setStyleHandling } from './composables'
  import type { BlueprintBackgroundColor } from '@FEATURES/blueprint/types'
  import type { Concept } from '@API/gql-generated/graphql'

  const props = defineProps<{ blueprintBgColor: BlueprintBackgroundColor; conceptName: Concept['name'] }>()
  const { conceptName } = toRefs(props)

  const { fetchConcept } = useConceptStore()

  const { concept } = fetchConcept(conceptName.value)
  const isEmpty = eagerComputed(() => !concept.value.composition?.subConcepts.length)
  const closeConceptEl = ref()

  const { isHovered, handleTapDown, handleTapUp, handleClick, isOpen } = setManipulationHandling({ isEmpty })
  const { conceptCursor, savedConceptDimensions } = setStyleHandling({ isEmpty, closeConceptEl })
</script>

<template>
  <div
    class="concept"
    @mouseover.stop="isHovered = !isHovered"
    @mouseout.stop="isHovered = !isHovered"
    @mousedown="handleTapDown"
    @touchstart="handleTapDown"
    @mouseup="handleTapUp"
    @touchend="handleTapUp"
    @mouseleave="handleTapUp"
    @click.stop="handleClick"
  >
    <keep-alive>
      <CloseConcept
        v-if="!isOpen"
        ref="closeConceptEl"
        :concept="concept"
        :is-hovered="isHovered"
        :is-empty="isEmpty"
      />
      <OpenConcept
        v-else
        :concept="concept"
        :is-hovered="isHovered"
        :is-empty="isEmpty"
        :blueprint-bg-color="blueprintBgColor"
      />
    </keep-alive>
  </div>
</template>

<style scoped lang="postcss">
  .concept {
    cursor: v-bind('conceptCursor');
    width: v-bind('savedConceptDimensions.width');
    height: v-bind('savedConceptDimensions.height');
  }
</style>
