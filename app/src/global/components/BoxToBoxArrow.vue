<script setup lang="ts">
  import { getBoxToBoxArrow } from 'perfect-arrows'

  // TODO: '@FEATURES/blueprint/types' is probably not where I should be getting that type from
  import type { Coordinates, Offsets } from '@FEATURES/blueprint/types'
  type Props = {
    from: Coordinates & Offsets
    to: Coordinates & Offsets
  }

  const props = defineProps<Props>()
  const { from, to } = toRefs(props)

  const [startX, startY, centerX, centerY, endX, endY, endArrowAngle, startArrowAngle, centerArrowAngle] =
  getBoxToBoxArrow(
    from.value.x,
    from.value.y,
    from.value.width,
    from.value.height,
    to.value.x,
    to.value.y,
    to.value.width,
    to.value.height,
    {
    bow: 0,
    stretch: 0.2,
    stretchMin: 0,
    stretchMax: 1000,
    padStart: 0,
    padEnd: 12,
    flip: false,
    straights: false,
  })
</script>

<template>
  <svg viewBox="0 0 1000 1000" :style="{ width: '1000px', height: '1000px' }" stroke="#000" fill="#000" strokeWidth="3">
    <circle :cx="startX" :cy="startY" r="4" />
    <path :d="`M${startX},${startY} Q${centerX},${centerY} ${endX},${endY}`" fill="none" />
    <polygon
      points="0,-6 12,0, 0,6"
      :transform="`translate(${endX},${endY}) rotate(${endArrowAngle * (180 / Math.PI)})`"
    />
  </svg>
</template>
