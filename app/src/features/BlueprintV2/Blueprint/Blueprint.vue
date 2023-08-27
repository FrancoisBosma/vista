<script setup lang="ts">
  import BlueprintBackground from './BlueprintBackground'
  import {
  setDynamicContent,
  setDragHandling,
  setZoomHandling,
} from './composables'
  import type { ContentIdentification } from '@FEATURES/BlueprintV2/types'
  import type { BlueprintBackgroundSFC } from '@FEATURES/BlueprintV2/Blueprint/BlueprintBackground/types'

  const { content } = defineProps<{ content?: ContentIdentification }>()

  const bp = shallowRef<HTMLDivElement | null>(null)
  const bpBackground = shallowRef<InstanceType<typeof BlueprintBackground> & BlueprintBackgroundSFC | null>(null)
  const uuid = generateUuid()
  const dynamicKit = setDynamicContent()
  const boundingRect = useElementBounding(bp)
  const { handleWheel, handlePinch } = setZoomHandling({ boundingRect, bpBackground, ...dynamicKit })
  const { handleDrag } = setDragHandling({ bpBackground, ...dynamicKit })
</script>

<template>
  <div ref="bp" class="blueprint" v-drag="handleDrag" v-pinch="handlePinch" @wheel.stop.prevent="handleWheel">
    <BlueprintBackground ref="bpBackground" :bp-uuid="uuid" :content-offsets="dynamicKit.contentOffsets" />
    <div>DIV12</div>
  </div>
</template>


<style scoped lang="postcss">
  .blueprint {
    @apply relative w-full h-full overflow-hidden;
  }
</style>
