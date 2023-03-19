<script setup lang="ts">
  import Grid from './Grid'
  import { useUiStore } from '@FEATURES/blueprint/stores'
  import { setCommonHandling, setDragHandling, setStyle, setZoomHandling } from './composables'
  import type { BlueprintInfo, GridRefs } from '@FEATURES/blueprint/types'

  const props = defineProps<{ bgColor?: string }>()
  const { bgColor } = toRefs(props)

  const bp = ref(null)
  const gridRefs: GridRefs = ref([])
  const bpInfo = useElementBounding(bp) as BlueprintInfo

  const ui = useUiStore()
  const commonKit = setCommonHandling({ ui })
  const { contentScale, handleWheel, handlePinch } = setZoomHandling({ ui, bpInfo, gridRefs, ...commonKit })
  const { handleDrag } = setDragHandling({ ui, gridRefs, ...commonKit })
  const styleKit = setStyle({ bp, contentScale, ui, ...commonKit })

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
  <div ref="bp" v-drag="handleDrag" v-pinch="handlePinch" class="blueprint" @wheel.stop.prevent="handleWheel">
    <div class="bp-background">
      <Grid v-for="n in ui.gridConfig.gridAmount" :key="n" :ref="(el: any) => gridRefs.push(el)" :grid-id="n - 1" />
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
    background-color: v-bind('bgColor');

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
