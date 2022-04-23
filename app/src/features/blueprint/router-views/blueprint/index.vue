<route lang="yaml">
meta:
  public: true # cf. auth/navigationGuards.ts
  layout: FullScreenLayout
</route>

<script setup lang="ts">
  import { Concept, Grid } from '../../components'
  import { useConceptStore, useUiStore } from '@FEATURES/blueprint/stores'
  import { setCommonHandling, setDragHandling, setZoomHandling } from './composables'
  import type { BlueprintInfo, GridRefs } from './types'

  const ui = useUiStore()
  const concepts = useConceptStore()
  const concept = concepts.helloWorld

  const bp = ref(null)
  const gridRefs: GridRefs = ref([])
  const { pressed: isUserPressingDown } = useMousePressed({ target: bp })
  const bpInfo = useElementBounding(bp) as BlueprintInfo

  const {
    bgOffsets,
    contentOffsets,
    updateContentOffsets,
    updateBackgroundOffsets,
    applyForEveryGrid,
    getCurrentBiggestSquareLength,
    computeExtraOffset,
  } = setCommonHandling({ ui })
  const { contentScale, handleZoom } = setZoomHandling({
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
  const { handleDrag } = setDragHandling({
    gridRefs,
    bgOffsets,
    updateContentOffsets,
    updateBackgroundOffsets,
    getCurrentBiggestSquareLength,
    computeExtraOffset,
  })

  watch(isUserPressingDown, () => (ui.isUserPressingDown = isUserPressingDown.value))
</script>

<template>
  <div ref="bp" v-drag="handleDrag" class="blueprint" @wheel.stop.prevent="handleZoom">
    <div class="bp-background">
      <Grid v-for="n in ui.gridConfig.gridAmount" :key="n" :ref="(el: any) => gridRefs.push(el)" :grid-id="n - 1" />
    </div>
    <Concept class="bp-content" :concept="concept" />
  </div>
</template>

<style scoped lang="postcss">
  .blueprint {
    @apply relative w-full h-full overflow-hidden;
    cursor: v-bind('`${isUserPressingDown ? "grabbing ": "grab"}`');
    .bp-background {
      @apply absolute w-full h-full children:(absolute);
      left: v-bind('`-${bgOffsets.width}px`');
      width: v-bind('`calc(100% + ${bgOffsets.width}px)`');
      top: v-bind('`-${bgOffsets.height}px`');
      height: v-bind('`calc(100% + ${bgOffsets.height}px)`');
    }
    .bp-content {
      @apply relative top-1/2 left-1/2;
      transform: v-bind(
        '`translate(calc(-50% + ${contentOffsets.width}px), calc(-50% + ${contentOffsets.height}px)) \
      scale(${contentScale})`'
      );
      z-index: v-bind('2 * ui.gridConfig.zoom.levelReset + 1');
    }
  }
</style>
