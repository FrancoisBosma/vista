<route lang="yaml">
meta:
  public: true # cf. auth/navigationGuards.ts
  layout: FullScreenLayout
</route>

<script setup lang="ts">
  import { Concept, Grid } from '@FEATURES/blueprint/components'
  import { useUiStore } from '@FEATURES/blueprint/stores'
  import { setCommonHandling, setDragHandling, setZoomHandling } from './composables'
  import type { BlueprintInfo, GridRefs } from '@FEATURES/blueprint/types'

  const conceptName = 'Communication'

  const bp = ref(null)
  const gridRefs: GridRefs = ref([])
  const { pressed: isUserPressingDown } = useMousePressed({ target: bp })
  const bpInfo = useElementBounding(bp) as BlueprintInfo

  const ui = useUiStore()
  const {
    bgOffsets,
    contentOffsets,
    updateContentOffsets,
    updateBackgroundOffsets,
    applyForEveryGrid,
    getCurrentBiggestSquareLength,
    computeExtraOffset,
  } = setCommonHandling({ ui })
  const { contentScale, handleWheel, handlePinch } = setZoomHandling({
    ui,
    contentOffsets,
    bgOffsets,
    bpInfo,
    gridRefs,
    updateContentOffsets,
    updateBackgroundOffsets,
    applyForEveryGrid,
    getCurrentBiggestSquareLength,
    computeExtraOffset,
  })
  const bpCursor = computed(() => `${isUserPressingDown.value ? 'grabbing ' : 'grab'}`)
  const bgDimensions = computed(() => ({
    left: `-${bgOffsets.width}px`,
    width: `calc(100% + ${bgOffsets.width}px)`,
    top: `-${bgOffsets.height}px`,
    height: `calc(100% + ${bgOffsets.height}px)`,
  }))
  const contentTransform = computed(
    () => `translate(calc(-50% + ${contentOffsets.width}px), \
    calc(-50% + ${contentOffsets.height}px)) scale(${contentScale.value})`
  )
  const contentZIndex = computed(() => 2 * ui.gridConfig.zoom.levelReset + 1)
  const { handleDrag } = setDragHandling({
    ui,
    gridRefs,
    bgOffsets,
    updateContentOffsets,
    updateBackgroundOffsets,
    getCurrentBiggestSquareLength,
    computeExtraOffset,
  })

  // Disable default zooming, e.g. from pinching
  useHead({
    meta: [
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no',
      },
    ],
  })
</script>

<template>
  <div
    ref="bp"
    v-drag="handleDrag"
    v-pinch.stop.prevent="handlePinch"
    class="blueprint"
    @wheel.stop.prevent="handleWheel"
  >
    <div class="bp-background">
      <Grid v-for="n in ui.gridConfig.gridAmount" :key="n" :ref="(el: any) => gridRefs.push(el)" :grid-id="n - 1" />
    </div>
    <Concept class="bp-content" :concept-name="conceptName" />
  </div>
</template>

<style scoped lang="postcss">
  .blueprint {
    @apply relative w-full h-full overflow-hidden;
    cursor: v-bind('bpCursor');
    .bp-background {
      @apply absolute w-full h-full children:(absolute);
      left: v-bind('bgDimensions.left');
      width: v-bind('bgDimensions.width');
      top: v-bind('bgDimensions.top');
      height: v-bind('bgDimensions.height');
    }
    .bp-content {
      @apply relative top-1/2 left-1/2;
      transform: v-bind('contentTransform');
      z-index: v-bind('contentZIndex');
    }
  }
</style>
