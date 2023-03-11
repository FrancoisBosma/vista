<script setup lang="ts">
  import type { Concept } from '@API/gql-generated/graphql'

  defineProps<{ concept: Concept; isHovered: Boolean; isEmpty: Boolean }>()
</script>

<template>
  <div class="close-concept">
    <span>{{ concept.name }}</span>
  </div>
</template>

<style scoped lang="postcss">
  .close-concept {
    @apply w-max border rounded-10px px-3rem py-1rem;
    background-color: v-bind('`var(${isEmpty ? "--background-stronger" : "--foreground-contrast"})`');
    box-shadow: v-bind('`${isHovered && !isEmpty ? "0 0 3px var(--emphasis)" : "0 1px 3px rgba(0, 0, 0, 0.5)"}`');
    border-color: v-bind('`var(${isHovered && !isEmpty ? "--emphasis" : "--background"})`');
  }
</style>
