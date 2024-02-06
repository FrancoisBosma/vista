<script setup lang="ts">
  import CloseConcept from './CloseConcept'
  import OpenConcept from './OpenConcept'
  import { useConceptStore } from './stores'
  import { setManipulationHandling, setStyleHandling } from './composables'
  import type { ConceptKey } from '@FEATURES/BlueprintV2/types'
  
  const props = defineProps<{ conceptName: ConceptKey }>()
  // const emit = defineEmits<{ contentFetched: [] }>()

  const conceptEl = shallowRef<HTMLElement | null>(null)
  const { fetchConcept } = useConceptStore()
  const { concept, isDone: isConceptFetched } = fetchConcept(props.conceptName)
  // watchOnce(isConceptFetched, () => emit('contentFetched'))
  
  const { isEmpty, isHovered, isOpen, handleClick } = setManipulationHandling({ concept, conceptEl })
  const styleKit = setStyleHandling({
    isEmpty,
    isHovered,
    concept,
    isConceptFetched,
  })
  const borderColor = computed(() => `var(${isOpen.value || (isHovered.value && !isEmpty.value) ? '--foreground' : '--background'})`)
</script>

<template>
  <!-- <div ref="conceptEl" class="concept" :style="subConceptStyle" @click.stop="handleClick"> -->
  <div ref="conceptEl" class="concept" @click.stop="handleClick">
    <keep-alive>
      <CloseConcept
        v-if="!isOpen"
        :concept-name="conceptName"
        :is-hovered="isHovered"
        :is-empty="isEmpty"
      />
      <OpenConcept v-else :concept="concept" />
    </keep-alive>
  </div>
</template>

<style scoped lang="postcss">
  .concept {
    @apply overflow-hidden border-1 select-none;
    cursor: v-bind('styleKit.cursor');
    width: v-bind('styleKit.dimensions.width');
    height: v-bind('styleKit.dimensions.height');
    box-shadow: v-bind('styleKit.boxShadow');
    border-radius: v-bind('styleKit.conceptRoundness');
    border-color: v-bind('borderColor');
  }
</style>
