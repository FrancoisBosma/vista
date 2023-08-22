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
  import type { BlueprintExpose, ContentIdentification } from '@FEATURES/blueprint/types'

  const props = defineProps<{ contentIdentification?: ContentIdentification }>()
  const contentIdentification = toRef(props.contentIdentification)

  const bpNode = inject(bpNodeProvideKey, { depth: -1 })
  const isRootBp = bpNode.depth === 0

  const bp = ref(null) as Ref<HTMLElement | null>
  const gridRefs = ref<Array<InstanceType<typeof Grid>>>([])

  const ui = useUiStore()

  const commonKit = setCommonHandling()
  const { boundingRect } = setElemBoundingHandling({ bp, isRootBp })
  const { contentScale, handleWheel, handlePinch } = setZoomHandling({
    boundingRect,
    gridRefs,
    contentIdentification,
    isRootBp,
    ...commonKit,
  })
  const { handleDrag } = setDragHandling({ gridRefs, isRootBp, ...commonKit })
  const styleKit = setStyleHandling({ bp, contentScale, ...commonKit })

  defineExpose({
    handleWheel,
    handlePinch,
    handleDrag,
    contentOffsets: commonKit.contentOffsets,
    getContentScale: () => contentScale.value,
  } satisfies BlueprintExpose)
</script>

<template>
  <div ref="bp" v-drag="handleDrag" v-pinch="handlePinch" class="blueprint" @wheel.stop.prevent="handleWheel">
    <template v-if="isRootBp">
      <slot name="background-extra" />
      <div class="bp-background">
        <Grid v-for="n in ui.gridConfig.gridAmount" :key="n" ref="gridRefs" :grid-index="n - 1" />
      </div>
    </template>
    <div class="bp-content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="postcss">
  .blueprint {
    @apply relative w-full h-full overflow-hidden;
    cursor: v-bind('styleKit.bpCursor');

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
