<script setup lang="ts">
  import type { BlueprintSFC, OffsetSide } from '@FEATURES/BlueprintV2/types'

  const { bpUuid } = defineProps<{ bpUuid: BlueprintSFC['id'] }>()

  const bgExtraPosition = computed(
    () =>
      ({
        left: `calc(50% + ${0}px)`,
        top: `calc(50% + ${0}px)`,
      } as Record<OffsetSide, string>)
  )
</script>

<template>
  <div class="bp-background">
    <div :id="`bp-${bpUuid}`" class="left-1/2 top-1/2 children:(absolute)" />
    
  </div>
</template>

<style scoped lang="postcss">
  .bp-background {
    @apply children:(w-full h-full absolute);
    left: v-bind('bgExtraPosition.left');
    top: v-bind('bgExtraPosition.top');
  }
</style>
