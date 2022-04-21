<script setup lang="ts">
  import { useUiStore } from '@FEATURES/blueprint/stores'
  import { convertDec2Hex, hexMultiplication, hexSum, range, toTheNth } from '@GLOBAL/functions/numbers'

  const props = defineProps<{ gridId: number }>()
  const { gridId } = toRefs(props)

  const ui = useUiStore()
  const config = ui.gridConfig

  const zoomThresholds = ref(
    range(config.gridAmount + 1).map((i: number) => config.zoom.levelReset * (2 * (i / config.gridAmount) - 1))
  )
  const zoomCount = ref(zoomThresholds.value[gridId.value])

  const patternId = computed(() => `bp-grid-${gridId.value}`)
  const zIndex = computed(() => zoomCount.value + config.zoom.levelReset) // 0 -> 2*levelReset
  const isGridVisible = computed(
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

  const updateZoomCount = (zoomFactor = 0) => {
    zoomCount.value += zoomFactor
    if (zoomCount.value < -config.zoom.levelReset) {
      zoomCount.value += 2 * config.zoom.levelReset
    } else if (zoomCount.value > config.zoom.levelReset) {
      zoomCount.value -= 2 * config.zoom.levelReset
    }
  }
  const updateAppearance = (zoomFactor = 0) => updateZoomCount(zoomFactor)

  defineExpose({ updateAppearance, squareLength })
</script>

<template>
  <svg v-show="isGridVisible" class="bp-grid">
    <defs>
      <pattern :id="patternId" :height="squareLength" :width="squareLength" patternUnits="userSpaceOnUse">
        <path :d="gridPath" fill="none" :stroke="strokeColor" :stroke-width="strokeWidth" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" :fill="`url(#${patternId})`" />
  </svg>
</template>

<style scoped lang="postcss">
  .bp-grid {
    @apply w-full h-full;
    z-index: v-bind('zIndex');
  }
</style>
