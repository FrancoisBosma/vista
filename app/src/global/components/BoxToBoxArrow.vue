<script setup lang="ts">
  import { getBoxToBoxArrow } from 'perfect-arrows'

  // TODO: '@FEATURES/blueprint/types' is probably not where I should be getting that type from
  import type { Coordinates, Offsets } from '@FEATURES/blueprint/types'
  interface Props {
    from: Coordinates & Offsets
    to: Coordinates & Offsets
    hasEndArrow?: boolean
  }

  const props = defineProps<Props>()
  const { from, to } = toRefs(props)

  const ARROW_HEAD_LENGTH = 10
  const leftMostCoord = Math.min(from.value.x, to.value.x)
  const rightMostCoord = Math.max(from.value.x + from.value.width, to.value.x + to.value.width)
  const topMostCoord = Math.min(from.value.y, to.value.y)
  const bottomMostCoord = Math.max(from.value.y + from.value.height, to.value.y + to.value.height)
  const boxWidth = Math.abs(rightMostCoord - leftMostCoord)
  const boxHeight = Math.abs(bottomMostCoord - topMostCoord)

  const [startX, startY, centerX, centerY, endX, endY, endArrowAngle, startArrowAngle, centerArrowAngle] =
    getBoxToBoxArrow(
      from.value.x - leftMostCoord,
      from.value.y - topMostCoord,
      from.value.width,
      from.value.height,
      to.value.x - leftMostCoord,
      to.value.y - topMostCoord,
      to.value.width,
      to.value.height,
      {
        bow: 0,
        stretch: 0.1,
        stretchMin: 0,
        stretchMax: 1000,
        padStart: 0,
        padEnd: props.hasEndArrow ? ARROW_HEAD_LENGTH : 0,
        flip: true,
        straights: false,
      }
    )
</script>

<template>
  <!-- N.B: we use a "style" attr rather than "class" so that not to have issues with css class tree shaking -->
  <svg
    class="absolute"
    :style="{ top: `${topMostCoord}px`, left: `${leftMostCoord}px`, width: `${boxWidth}px`, height: `${boxHeight}px` }"
    :viewBox="`0 0 ${boxWidth} ${boxHeight}`"
    stroke="#000"
    fill="#000"
    strokeWidth="3"
  >
    <circle :cx="startX" :cy="startY" r="4" />
    <path :d="`M${startX},${startY} Q${centerX},${centerY} ${endX},${endY}`" fill="none" />
    <polygon
      v-if="hasEndArrow"
      :points="`0,-${ARROW_HEAD_LENGTH / 2} ${ARROW_HEAD_LENGTH},0, 0,${ARROW_HEAD_LENGTH / 2}`"
      :transform="`translate(${endX},${endY}) rotate(${endArrowAngle * (180 / Math.PI)})`"
    />
  </svg>
</template>
