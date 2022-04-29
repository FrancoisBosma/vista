<script setup lang="ts">
  import CloseConcept from './CloseConcept'
  import OpenConcept from './OpenConcept'
  import { useUiStore } from '@FEATURES/blueprint/stores'
  import { genericTapCoords } from '@GLOBAL/functions/coordinates'
  import type { Concept, Coordinates } from '@FEATURES/blueprint/stores'

  const ui = useUiStore()

  const props = defineProps<{ concept: Concept }>()
  const { concept } = toRefs(props)

  const isOpen = ref(false)
  const isHovered = ref(false)
  const click = ref({
    tapCoords: { x: 0, y: 0 } as Coordinates,
    isBlocked: false,
  })
  const isEmpty = computed(() => !concept.value.subTiles.length)
  const cursor = computed(() => (ui.dragState === 'dragged' ? 'inherit' : isEmpty.value ? 'auto' : 'pointer'))

  const toggleTile = () => {
    isOpen.value = !isOpen.value
    isHovered.value = false
  }
  const isClickable = computed(() => !(isEmpty.value || click.value.isBlocked))
  const handleClick = () => {
    if (!isClickable.value) return
    toggleTile()
  }
  const handleTapDown = (e: MouseEvent | TouchEvent) => {
    const { x, y } = genericTapCoords(e)
    click.value.tapCoords.x = x
    click.value.tapCoords.y = y
    click.value.isBlocked = false
  }
  const handleTapUp = (e: MouseEvent | TouchEvent) => {
    const { x, y } = genericTapCoords(e)
    if (click.value.tapCoords.x !== x || click.value.tapCoords.y !== y) click.value.isBlocked = true
    click.value.tapCoords.x = 0
    click.value.tapCoords.y = 0
  }
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
