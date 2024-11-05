<script setup lang="ts">
  import { getArrow } from 'perfect-arrows'

  // TODO: '@FEATURES/blueprint/types' is probably not where I should be getting that type from
  import type { Coordinates } from '@FEATURES/blueprint/types'
  interface Props {
    from: Coordinates
    to: Coordinates
  }

  const props = defineProps<Props>()
  const { from, to } = toRefs(props)

  const [startX, startY, centerX, centerY, endX, endY, endArrowAngle, startArrowAngle, centerArrowAngle] = getArrow(
    from.value.x,
    from.value.y,
    to.value.x,
    to.value.y,
    {
      bow: 0,
      stretch: 0.2,
      stretchMin: 0,
      stretchMax: 1000,
      padStart: 0,
      padEnd: 0,
      flip: false,
      straights: false,
    }
  )
</script>

<template>
  <svg viewBox="0 0 720 480" :style="{ width: '720px', height: '480px' }" stroke="#000" fill="#000" strokeWidth="3">
    <circle :cx="startX" :cy="startY" r="4" />
    <path :d="`M${startX},${startY} Q${centerX},${centerY} ${endX},${endY}`" fill="none" />
    <polygon
      points="0,-6 12,0, 0,6"
      :transform="`translate(${endX},${endY}) rotate(${endArrowAngle * (180 / Math.PI)})`"
    />
  </svg>
</template>
