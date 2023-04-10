<script setup lang="ts">
  import { useUiStore } from '@FEATURES/blueprint/stores'
  import { convertDec2Hex, hexMultiplication, hexSum, range, toTheNth } from '@GLOBAL/functions/numbers'
  import type { ZoomDirectionFactor } from '@FEATURES/blueprint/types'

  const props = defineProps<{ gridId: string; gridIndex: number }>()
  const { gridId, gridIndex } = toRefs(props)

  const ui = useUiStore()
  const config = ui.gridConfig

  const zoomThresholds = ref(
    range(config.gridAmount + 1).map((i) => config.zoom.levelReset * (2 * (i / config.gridAmount) - 1))
  )
  const zoomCount = ref(zoomThresholds.value[gridIndex.value] + 2)

  const zIndex = computed(() => zoomCount.value + config.zoom.levelReset) // 0 -> 2*levelReset
  const isGridVisible = eagerComputed(
    () => zoomCount.value > -config.zoom.levelReset && zoomCount.value < config.zoom.levelReset
  )
  const depthFactor = computed(() => toTheNth(ui.zoomRate, zoomCount.value))
  const squareLength = computed(() => config.middleSizeSquare.length * depthFactor.value)
  const gridPath = computed(() => `M ${squareLength.value} 0 L 0 0 0 ${squareLength.value}`)
  const strokeColor = computed(() => {
    const midColor = config.middleSizeSquare.strokeColor
    let output = '#'
    range(midColor.length, 1, 2).forEach((i) => {
      // red, green and blue elements, composed of two-digits hexa numbers
      const colorEl = midColor.substring(i, i + 2)
      const relativeDepth = hexMultiplication(convertDec2Hex(zoomCount.value), convertDec2Hex(config.zoom.strokeStep))
      const updatedColorElement = hexSum(colorEl, relativeDepth)
      output = output.concat(updatedColorElement)
    })
    return output
  })
  const strokeWidth = computed(() => config.middleSizeSquare.strokeWidth * depthFactor.value)

  const updateZoomCount = (zoomFactor: ZoomDirectionFactor) => {
    zoomCount.value += zoomFactor
    if (zoomCount.value < -config.zoom.levelReset) {
      zoomCount.value += 2 * config.zoom.levelReset
    } else if (zoomCount.value > config.zoom.levelReset) {
      zoomCount.value -= 2 * config.zoom.levelReset
    }
  }
  const updateAppearance = (zoomFactor: ZoomDirectionFactor) => updateZoomCount(zoomFactor)

  defineExpose({ updateAppearance, squareLength })
</script>

<template>
  <svg v-show="isGridVisible" class="bp-grid">
    <defs>
      <pattern :id="gridId" :height="squareLength" :width="squareLength" patternUnits="userSpaceOnUse">
        <path :d="gridPath" fill="none" :stroke="strokeColor" :stroke-width="strokeWidth" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" :fill="`url(#${gridId})`" />
  </svg>
</template>

<style scoped lang="postcss">
  .bp-grid {
    @apply w-full h-full;
    z-index: v-bind('zIndex');
  }
</style>
