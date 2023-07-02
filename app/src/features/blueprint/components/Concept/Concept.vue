<script setup lang="ts">
  import CloseConcept from './CloseConcept'
  import OpenConcept from './OpenConcept'
  import { useConceptStore } from '@FEATURES/blueprint/stores'
  import { setManipulationHandling, setStyleHandling } from './composables'
  import type { Concept } from '@API/gql-generated/graphql'

  const { conceptName } = defineProps<{ conceptName: Concept['name'] }>()

  const { fetchConcept } = useConceptStore()

  const closeConceptEl = ref(null) as Ref<HTMLElement | null>
  const { concept, isDone: isConceptFetched } = fetchConcept(conceptName)
  const isEmpty = eagerComputed(() => !concept.value.composition?.subConcepts.length)

  const { isHovered, isOpen, handleClick } = setManipulationHandling({ isEmpty, closeConceptEl })
  const styleKit = setStyleHandling({ isEmpty, isHovered, concept, isConceptFetched })

  /**
   * DELETEME
   *
   * icons: screen-normal vs fit-screen
   *
   */
</script>

<template>
  <div class="concept" @click.stop="handleClick">
    <keep-alive>
      <CloseConcept
        v-if="!isOpen"
        ref="closeConceptEl"
        :concept="concept"
        :is-hovered="isHovered"
        :is-empty="isEmpty"
      />
      <OpenConcept v-else :concept="concept" :is-empty="isEmpty" />
    </keep-alive>
  </div>
</template>

<style scoped lang="postcss">
  .concept {
    @apply select-none;
    cursor: v-bind('styleKit.cursor');
    width: v-bind('styleKit.dimensions.width');
    height: v-bind('styleKit.dimensions.height');

    & > * {
      @apply border-1 rounded-10px;
      box-shadow: v-bind('styleKit.boxShadow');
    }
  }
</style>
