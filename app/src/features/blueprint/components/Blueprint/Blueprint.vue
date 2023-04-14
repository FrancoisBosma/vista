<script setup lang="ts">
  import Grid from './Grid'
  import { useUiStore } from '@FEATURES/blueprint/stores'
  import {
    setCommonHandling,
    setDragHandling,
    setElemBoundingHandling,
    setStyleHandling,
    setZoomHandling,
  } from './composables'
  import { bpDepthKey } from '@FEATURES/blueprint/components/Blueprint/constants/symbols'
  import type { BlueprintDepth } from '@FEATURES/blueprint/types'

  const props = withDefaults(defineProps<{ depth: BlueprintDepth }>(), { depth: 0 })
  const { depth } = toRefs(props)

  const bp = ref<HTMLElement | null>(null)
  const gridRefs = ref<Array<HTMLElement | null>>([])

  const ui = useUiStore()

  const commonKit = setCommonHandling()
  const { bpBounding, updateBpBounding } = setElemBoundingHandling({ bp, depth })
  const { contentScale, handleWheel, handlePinch } = setZoomHandling({
    bpBounding,
    gridRefs,
    updateBpBounding,
    ...commonKit,
  })
  const { handleDrag } = setDragHandling({ gridRefs, updateBpBounding, ...commonKit })
  const styleKit = setStyleHandling({ depth, bp, contentScale, ...commonKit })
  // Disable default zooming, e.g. from pinching
  useHead({
    meta: [
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no',
      },
    ],
  })

  provide(bpDepthKey, depth.value)
</script>

<template>
  <div ref="bp" v-drag="handleDrag" v-pinch="handlePinch" class="blueprint" @wheel.stop.prevent="handleWheel">
    <div class="bp-background">
      <Grid v-for="n in ui.gridConfig.gridAmount" :key="n" ref="gridRefs" :grid-index="n - 1" />
    </div>
    <div class="bp-content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="postcss">
  .blueprint {
    @apply relative w-full h-full overflow-hidden;
    cursor: v-bind('styleKit.bpCursor');
    background-color: v-bind('styleKit.bgColor');

    .bp-background {
      @apply absolute w-full h-full children:(absolute);
      left: v-bind('styleKit.bgDimensions.left');
      width: v-bind('styleKit.bgDimensions.width');
      top: v-bind('styleKit.bgDimensions.top');
      height: v-bind('styleKit.bgDimensions.height');
    }

    .bp-content {
      @apply w-min relative top-1/2 left-1/2;
      transform: v-bind('styleKit.contentTransform');
      z-index: v-bind('styleKit.contentZIndex');
    }
  }
</style>
