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
  const svgData = reactive({
    leftMostCoord: 0,
    rightMostCoord: 0,
    topMostCoord: 0,
    bottomMostCoord: 0,
    boxWidth: 0,
    boxHeight: 0,
  })
  const drawingData = reactive({
    startX: 0,
    startY: 0,
    centerX: 0,
    centerY: 0,
    endX: 0,
    endY: 0,
    endArrowAngle: 0,
    startArrowAngle: 0,
    centerArrowAngle: 0,
  })

  watchEffect(() => {
    svgData.leftMostCoord = Math.min(from.value.x, to.value.x)
    svgData.rightMostCoord = Math.max(from.value.x + from.value.width, to.value.x + to.value.width)
    svgData.topMostCoord = Math.min(from.value.y, to.value.y)
    svgData.bottomMostCoord = Math.max(from.value.y + from.value.height, to.value.y + to.value.height)
    svgData.boxWidth = Math.abs(svgData.rightMostCoord - svgData.leftMostCoord)
    svgData.boxHeight = Math.abs(svgData.bottomMostCoord - svgData.topMostCoord)

    const arrowData = getBoxToBoxArrow(
      from.value.x - svgData.leftMostCoord,
      from.value.y - svgData.topMostCoord,
      from.value.width,
      from.value.height,
      to.value.x - svgData.leftMostCoord,
      to.value.y - svgData.topMostCoord,
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
    ;(
      [
        'startX',
        'startY',
        'centerX',
        'centerY',
        'endX',
        'endY',
        'endArrowAngle',
        'startArrowAngle',
        'centerArrowAngle',
      ] as (keyof typeof drawingData)[]
    ).forEach((key, idx) => {
      drawingData[key] = arrowData[idx]
    })
  })
</script>

<template>
  <!-- N.B: we use a "style" attr rather than "class" so that not to have issues with css class tree shaking -->
  <svg
    class="absolute"
    :style="{
      top: `${svgData.topMostCoord}px`,
      left: `${svgData.leftMostCoord}px`,
      width: `${svgData.boxWidth}px`,
      height: `${svgData.boxHeight}px`,
    }"
    :viewBox="`0 0 ${svgData.boxWidth} ${svgData.boxHeight}`"
    stroke="#000"
    fill="#000"
    strokeWidth="3"
  >
    <circle :cx="drawingData.startX" :cy="drawingData.startY" r="4" />
    <path
      :d="`M${drawingData.startX},${drawingData.startY} Q${drawingData.centerX},${drawingData.centerY} \
      ${drawingData.endX},${drawingData.endY}`"
      fill="none"
    />
    <polygon
      v-if="hasEndArrow"
      :points="`0,-${ARROW_HEAD_LENGTH / 2} ${ARROW_HEAD_LENGTH},0, 0,${ARROW_HEAD_LENGTH / 2}`"
      :transform="`translate(${drawingData.endX},${drawingData.endY}) rotate(${
        drawingData.endArrowAngle * (180 / Math.PI)
      })`"
    />
  </svg>
</template>
