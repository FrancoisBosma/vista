<script setup lang="ts">
  import CloseConcept from './CloseConcept'
  import OpenConcept from './OpenConcept'
  import { useConceptStore, useUiStore } from '@FEATURES/blueprint/stores'
  import { genericTapCoords } from '@GLOBAL/functions/coordinates'
  import type { Coordinates } from '@FEATURES/blueprint/types'
  import type { Concept } from '@API/gql-generated/graphql'

  const ui = useUiStore()
  const { fetchConcept } = useConceptStore()

  const props = defineProps<{ conceptName: Concept['name'] }>()
  const { conceptName } = toRefs(props)

  const { concept } = fetchConcept(conceptName.value)
  const isEmpty = computed(() => !concept.value.composition?.subConcepts.length)

  /** Manipulation */
  const click = reactive({
    tapCoords: { x: 0, y: 0 } as Coordinates,
    isBlocked: false,
  })
  const isOpen = ref(false)
  const isHovered = ref(false)
  const toggleTile = () => {
    isOpen.value = !isOpen.value
    isHovered.value = false
  }
  const isClickable = computed(() => !(isEmpty.value || click.isBlocked))
  const handleClick = async () => {
    if (!isClickable.value) return
    toggleTile()
  }
  const handleTapDown = (e: MouseEvent | TouchEvent) => {
    const { x, y } = genericTapCoords(e)
    click.tapCoords.x = x
    click.tapCoords.y = y
    click.isBlocked = false
  }
  const handleTapUp = (e: MouseEvent | TouchEvent) => {
    const { x, y } = genericTapCoords(e)
    if (click.tapCoords.x !== x || click.tapCoords.y !== y) click.isBlocked = true
    click.tapCoords.x = 0
    click.tapCoords.y = 0
  }

  /** Style */
  const conceptCursor = computed(() => (ui.dragState === 'dragged' ? 'inherit' : isEmpty.value ? 'auto' : 'pointer'))
  const savedConceptDimensions = reactive({
    width: 'fit-content',
    height: 'fit-content',
  })
  const closeConceptEl = ref()
  const updateSavedConceptDimensions = () => {
    const htmlElement = unrefElement(closeConceptEl)?.nextElementSibling
    if (!htmlElement) return
    const { width, height } = htmlElement.getBoundingClientRect()
    savedConceptDimensions.width = `${width}px`
    savedConceptDimensions.height = `${height}px`
  }
  onMounted(() => {
    updateSavedConceptDimensions()
  })
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
      <OpenConcept v-else :concept="concept" :is-hovered="isHovered" :is-empty="isEmpty" />
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
