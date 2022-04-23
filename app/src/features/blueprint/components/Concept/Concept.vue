<script setup lang="ts">
  import CloseConcept from './CloseConcept'
  import OpenConcept from './OpenConcept'
  import type { Concept } from '@FEATURES/blueprint/stores'
  import type { DragState, TapState } from '@SRC/types'

  const props = defineProps<{ concept: Concept }>()
  const { concept } = toRefs(props)

  const isEmpty = computed(() => !concept.value.subTiles.length)
  const isOpen = ref(false)
  const isHovered = ref(false)

  const toggleTile = () => {
    isOpen.value = !isOpen.value
    isHovered.value = false
  }

  const tapState = ref('idle' as TapState)
  const cursor = computed(() => (tapState.value === 'dragged' ? 'inherit' : isEmpty.value ? 'auto' : 'pointer'))
  const handleDrag = ({ first, last, tap, direction }: DragState) => {
    if (last) {
      tapState.value = 'idle'
      const tapped = tap && direction.every((nb) => nb === 0)
      if (tapped && isHovered.value) toggleTile()
    } else if (first) tapState.value = 'dragStart'
    else tapState.value = 'dragged'
  }
</script>

<template>
  <div
    v-drag="handleDrag"
    class="concept"
    @mouseover.stop="isHovered = !isHovered"
    @mouseout.stop="isHovered = !isHovered"
  >
    <keep-alive>
      <CloseConcept v-if="!isOpen" :concept="concept" :is-hovered="isHovered" :is-empty="isEmpty" />
      <OpenConcept v-else :concept="concept" :is-hovered="isHovered" />
    </keep-alive>
  </div>
</template>

<style scoped lang="postcss">
  .concept {
    @apply w-max;
    cursor: v-bind('cursor');
  }
</style>
