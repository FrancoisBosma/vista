<route lang="yaml">
meta:
  public: true # cf. auth/navigationGuards.ts
  layout: FullScreenLayout
</route>

<script setup lang="ts">
  import { Concept, Grid } from '../../components'
  import { useConceptStore, useUiStore } from '@FEATURES/blueprint/stores'
  import setZoomHandling from './composables/zoom'
  import type { Ref } from 'vue'
  import type { Dictionary } from '@ROOT/src/types'
  import type { Dimension } from '@FEATURES/blueprint/stores'
  import type { Offsets } from './types'

  const concepts = useConceptStore()
  const ui = useUiStore()

  const concept = concepts.helloWorld

  const bp = ref(null)
  const gridRefs: Ref<Object[]> = ref([])
  const { pressed: isUserPressingDown } = useMousePressed({ target: bp })
  const bpInfo = useElementBounding(bp) as Dictionary<Ref<number>>
  const bgOffsets = ref({
    width: ui.gridConfig.middleSizeSquare.length / 2,
    height: ui.gridConfig.middleSizeSquare.length / 2,
  } as Offsets)
  const contentOffsets = ref({ width: 0, height: 0 } as Offsets)
  const contentScale = ref(1)

  watch(isUserPressingDown, () => (ui.isUserPressingDown = isUserPressingDown.value))

  const updateContentOffsets = (extraOffsets: Offsets) =>
    (Object.keys(extraOffsets) as Dimension[]).forEach((dim) => {
      contentOffsets.value[dim] += extraOffsets[dim]
    })
  const updateBackgroundOffsets = (extraOffsets: Offsets) =>
    (Object.keys(extraOffsets) as Dimension[]).forEach((dim) => {
      bgOffsets.value[dim] += extraOffsets[dim]
    })

  const { handleZoom } = setZoomHandling({
    ui,
    updateContentOffsets,
    updateBackgroundOffsets,
    bpInfo,
    contentOffsets,
    bgOffsets,
    gridRefs,
    contentScale,
  })
</script>

<template>
  <div ref="bp" class="blueprint" @wheel.stop.prevent="handleZoom">
    <div class="bp-background">
      <Grid v-for="n in ui.gridConfig.gridAmount" :key="n" :ref="(el: any) => gridRefs.push(el)" :grid-id="n - 1" />
    </div>
    <Concept class="bp-content" :concept="concept" />
  </div>
</template>

<style scoped lang="postcss">
  .blueprint {
    @apply relative w-full h-full overflow-hidden;
    .bp-background {
      @apply absolute w-full h-full children:(absolute);
      cursor: v-bind('`${isUserPressingDown ? "grabbing ": "grab"}`');
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
