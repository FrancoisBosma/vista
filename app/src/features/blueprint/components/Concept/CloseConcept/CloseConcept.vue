<script setup lang="ts">
  import type { Concept } from '@API/gql-generated/graphql'

  const props = defineProps<{ concept: Concept; isHovered: Boolean; isEmpty: Boolean }>()
  const { isHovered, isEmpty } = toRefs(props)

  const bgColor = computed(() => `var(${isEmpty.value ? '--background-stronger' : '--foreground-contrast'})`)
  const borderColor = computed(() => `var(${isHovered.value && !isEmpty.value ? '--emphasis' : '--background'})`)
</script>

<template>
  <p class="close-concept">{{ concept.name }}</p>
</template>

<style scoped lang="postcss">
  .close-concept {
    @apply p-1rem whitespace-pre-line;
    background-color: v-bind('bgColor');
    border-color: v-bind('borderColor');
  }
</style>
