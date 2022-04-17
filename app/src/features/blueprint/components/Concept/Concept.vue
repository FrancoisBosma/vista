<script setup lang="ts">
  import CloseConcept from './CloseConcept'
  import OpenConcept from './OpenConcept'
  import { useConceptStore /* , useUiStore */ } from '@FEATURES/blueprint/stores'
  // import { generalPressEventFormatting } from '@GLOBAL/functions/coordinates'
  import type { Ref } from 'vue'
  import type { Dictionary } from '@SRC/types'

  const concepts = useConceptStore()
  // const ui = useUiStore()

  const concept = concepts.helloWorld

  const isOpen = ref(false)
  const mouseCoords: Dictionary<Ref> = useMouse()
  const click = ref({
    pressDownCoords: { x: undefined, y: undefined },
    shouldBlock: false,
  } as Dictionary<any>)

  const handlePressDown = () => {
    Object.keys(click.value.pressDownCoords).forEach(
      (axis) => (click.value.pressDownCoords[axis] = mouseCoords[axis].value)
    )
    click.value.shouldBlock = false
  }
  const handlePressUp = () => {
    Object.keys(click.value.pressDownCoords).forEach((axis) => {
      if (mouseCoords[axis].value !== click.value.pressDownCoords[axis]) {
        click.value.shouldBlock = true
      }
      click.value.pressDownCoords[axis] = undefined
    })
  }
  const isEmpty = ref(false)
  const isClickable = computed(() => !isEmpty.value && !click.value.shouldBlock)
  const toggleTile = () => {
    if (!isClickable.value) return
    isOpen.value = !isOpen.value
    // resetIsHovered()
  }
</script>

<template>
  <div
    class="concept"
    @click.stop="toggleTile"
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
