<script setup lang="ts">
  import BlueprintBackground from './BlueprintBackground'
  import type { ContentIdentification } from '@FEATURES/BlueprintV2/types'

  const { content } = defineProps<{ content?: ContentIdentification }>()

  const uuid = generateUuid()
</script>

<template>
  <div ref="bp" class="blueprint">
    <BlueprintBackground class="absolute" :bp-uuid="uuid" />
    <div>DIV1</div>
  </div>
</template>


<style scoped lang="postcss">
  .blueprint {
    @apply relative w-full h-full overflow-hidden;
  }
</style>
