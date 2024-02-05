<script setup lang="ts">
  import type { ConceptKey } from '@FEATURES/BlueprintV2/types'

  const props = defineProps<{ conceptName: ConceptKey; isEmpty: Boolean }>()

  const bgColor = computed(() => `var(${props.isEmpty ? '--background-stronger' : '--foreground-contrast'})`)
</script>

<template>
  <p class="close-concept">{{ conceptName }}</p>
</template>

<style scoped lang="postcss">
  .close-concept {
    @apply h-full p-1rem flex justify-center items-center whitespace-pre-line;
    background-color: v-bind('bgColor');
  }
</style>
