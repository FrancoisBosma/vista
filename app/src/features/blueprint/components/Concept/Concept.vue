<script setup lang="ts">
  import CloseConcept from './CloseConcept'
  import OpenConcept from './OpenConcept'
  import { useConceptStore, useUiStore } from '@FEATURES/blueprint/stores'
  import type { Dictionary } from '@SRC/types'

  const concepts = useConceptStore()
  const ui = useUiStore()

  const concept = concepts.helloWorld

  const isEmpty = computed(() => !concept.subTiles.length)
  const isOpen = ref(false)
  const isHovered = ref(false)
  const click = ref({ pressDownCoords: { x: undefined, y: undefined }, shouldBlock: false } as Dictionary<any>)

  const isClickable = computed(() => !isEmpty.value && !click.value.shouldBlock)

  const toggleTile = () => {
    if (!isClickable.value) return
    isOpen.value = !isOpen.value
    isHovered.value = false
  }
  const handlePressDown = () => {
    Object.keys(click.value.pressDownCoords).forEach(
      (axis) => (click.value.pressDownCoords[axis] = ui.mouseCoords[axis].value)
    )
    click.value.shouldBlock = false
  }
  const handlePressUp = () => {
    Object.keys(click.value.pressDownCoords).forEach((axis) => {
      if (ui.mouseCoords[axis].value !== click.value.pressDownCoords[axis]) {
        click.value.shouldBlock = true
      }
      click.value.pressDownCoords[axis] = undefined
    })
  }
</script>

<template>
  <div
    class="concept"
    @click.stop="toggleTile"
    @mouseover.stop="isHovered = !isHovered"
    @mouseout.stop="isHovered = !isHovered"
    @mousedown="handlePressDown"
    @touchstart="handlePressDown"
    @mouseup="handlePressUp"
    @touchend="handlePressUp"
    @mouseleave="handlePressUp"
  >
    <keep-alive>
      <CloseConcept v-if="!isOpen" v-bind="concept" :is-hovered="isHovered" :is-empty="isEmpty" />
      <OpenConcept v-else v-bind="concept" :is-hovered="isHovered" />
    </keep-alive>
  </div>
</template>

<style scoped lang="postcss">
  .concept {
    @apply flex;
  }
</style>
