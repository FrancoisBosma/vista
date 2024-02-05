<script setup lang="ts">
  import Grid from './Grid'
  import { useBlueprintStore } from '@FEATURES/BlueprintV2/stores'
  import { setDynamicAppearance } from './composables'
  import type { BlueprintSFC, Offsets } from '@FEATURES/BlueprintV2/types'
  import type { BlueprintBackgroundSFC } from '@FEATURES/BlueprintV2/Blueprint/BlueprintBackground/types'

  const { bpUuid, contentOffsets } = defineProps<{ bpUuid: BlueprintSFC['id'], contentOffsets: Offsets }>()

  const gridRefs = ref<Array<InstanceType<typeof Grid>>>([])
  const ui = useBlueprintStore()
  const dynamicKit = setDynamicAppearance({ contentOffsets: toRef(contentOffsets) })

  defineExpose({ grids: gridRefs.value, ...dynamicKit } satisfies BlueprintBackgroundSFC)
</script>

<template>
  <div :id="`bp-${bpUuid}`" class="bp-background-extra" />
  <Grid v-for="n in ui.gridConfig.gridAmount" :key="n" ref="gridRefs" :grid-index="n - 1"  class="bp-grid"/>
</template>

<style scoped lang="postcss">
  .bp-background-extra {
    @apply absolute w-full h-full children:(absolute);
    left: v-bind('dynamicKit.bgExtraPosition.value.left');
    top: v-bind('dynamicKit.bgExtraPosition.value.top');
  }
  .bp-grid {
    @apply absolute;
    left: v-bind('dynamicKit.bgDimensions.value.left');
    top: v-bind('dynamicKit.bgDimensions.value.top');
    width: v-bind('dynamicKit.bgDimensions.value.width');
    height: v-bind('dynamicKit.bgDimensions.value.height');
  }
</style>
