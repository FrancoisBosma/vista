<script setup lang="ts">
  import { useUiStore } from '@FEATURES/blueprint/stores'
  import { range } from '@GLOBAL/functions/numbers'

  const props = defineProps<{ gridId: number }>()
  const { gridId } = toRefs(props)

  const ui = useUiStore()
  const config = ui.gridConfig

  const zoomThresholds = ref(
    range(config.gridAmount + 1).map((i: number) => config.zoom.levelReset * (2 * (i / config.gridAmount) - 1))
  )
  const zoomCount = ref(zoomThresholds.value[gridId.value])
  const zIndex = computed(() => zoomCount.value + config.zoom.levelReset) // 0 -> 2*levelReset
</script>

<template>
  <svg v-show="isGridVisible" class="bp-grid">
    <defs>
      <pattern :id="patternId" :height="squareLength" :width="squareLength" patternUnits="userSpaceOnUse">
        <path :d="gridPath" fill="none" :stroke="strokeColor" :stroke-width="strokeWidth" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" :fill="patternUrl" />
  </svg>
</template>

<style scoped lang="postcss">
  .bp-grid {
    @apply w-full h-full;
    z-index: v-bind('zIndex');
  }
</style>
