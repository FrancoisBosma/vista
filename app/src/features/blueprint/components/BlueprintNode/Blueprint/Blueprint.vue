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
  import { bpNodeProvideKey } from '@FEATURES/blueprint/components/BlueprintNode/Blueprint/constants/symbols'
  import { BlueprintBackgroundColor } from '@FEATURES/blueprint/types'
  import type { BlueprintElement } from '@FEATURES/blueprint/types'

  const props = withDefaults(defineProps<{ bgColor: BlueprintBackgroundColor }>(), {
    bgColor: BlueprintBackgroundColor.normal,
  })
  const { bgColor } = toRefs(props)
  const parentBpNodeData = inject(bpNodeProvideKey, { depth: -1, id: undefined })

  const bp = ref<HTMLElement | null>(null)
  const gridRefs = ref<Array<InstanceType<typeof Grid>>>([])

  const ui = useUiStore()

  const commonKit = setCommonHandling()
  const { bpBounding, updateBpSubtreeBoundings } = setElemBoundingHandling({ bp, parentBpNodeData })
  const shouldDelegateTaskToRoot = parentBpNodeData.depth !== 0
  const { contentScale, handleWheel, handlePinch } = setZoomHandling({
    bpBounding,
    gridRefs,
    shouldDelegateTaskToRoot,
    updateBpSubtreeBoundings,
    ...commonKit,
  })
  const { handleDrag } = setDragHandling({ gridRefs, shouldDelegateTaskToRoot, updateBpSubtreeBoundings, ...commonKit })
  const styleKit = setStyleHandling({ bp, contentScale, ...commonKit })

  defineExpose({ handleWheel, handlePinch, handleDrag, bpBounding } satisfies BlueprintElement)
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
