<script setup lang="ts">
  import CloseConcept from './CloseConcept'
  import OpenConcept from './OpenConcept'
  import { useConceptStore, useUiStore } from '@FEATURES/blueprint/stores'
  import { generalPressEventFormatting } from '@GLOBAL/functions/coordinates'

  const concepts = useConceptStore()
  const ui = useUiStore()

  const concept = concepts.helloWorld

  const isOpen = ref(false)
  const click = ref({
    pressDownCoords: { [ui.axes.width]: undefined, [ui.axes.height]: undefined },
    shouldBlock: false,
  })

  const handlePressDown = (e: MouseEvent | TouchEvent) => {
    const event = generalPressEventFormatting(e)
    Object.keys(click.value.pressDownCoords).forEach((axis) => (click.value.pressDownCoords[axis] = event[axis]))
    click.value.shouldBlock = false
  }
</script>

<template>
  <div
    class="concept"
    @mousedown="handlePressDown"
    @touchstart="handlePressDown"
    @mouseup="handlePressUp"
    @touchend="handlePressUp"
    @mouseleave="handlePressUp"
  >
    <keep-alive>
      <CloseConcept v-if="!isOpen" v-bind="concept" />
      <OpenConcept v-else />
    </keep-alive>
  </div>
</template>

<style scoped lang="postcss">
  .concept {
    @apply flex;
  }
</style>
