<script setup lang="ts">
  import type { Concept } from '@API/gql-generated/graphql'

  const props = defineProps<{ concept: Concept; isHovered: Boolean; isEmpty: Boolean }>()
  const { isHovered, isEmpty } = toRefs(props)

  const bgColor = computed(() => `var(${isEmpty.value ? '--background-stronger' : '--foreground-contrast'})`)
  const boxShadow = computed(
    () => `${isHovered.value && !isEmpty.value ? '0 0 3px var(--emphasis)' : '0 1px 3px rgba(0, 0, 0, 0.5)'}`
  )
  const borderColor = computed(() => `var(${isHovered.value && !isEmpty.value ? '--emphasis' : '--background'})`)
</script>

<template>
  <!-- <div class="close-concept">
    <span>{{ concept.name }}</span>
  </div> -->
  <p class="close-concept">{{ concept.name }}</p>
</template>

<style scoped lang="postcss">
  .close-concept {
    @apply border rounded-10px p-1rem whitespace-pre-line;
    background-color: v-bind('bgColor');
    box-shadow: v-bind('boxShadow');
    border-color: v-bind('borderColor');
  }
</style>
