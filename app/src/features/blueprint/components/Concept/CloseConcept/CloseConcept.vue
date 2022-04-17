<script setup lang="ts">
  defineProps<{ title: String; subTiles: Object[]; isHovered: Boolean; isEmpty: Boolean }>()
</script>

<template>
  <div class="close-tile">
    <span>{{ title }}</span>
  </div>
</template>

<style scoped lang="postcss">
  .close-tile {
    @apply w-max border rounded-10px px-3rem py-1rem;
    background-color: v-bind('`var(${isEmpty ? "--background-stronger": "--foreground-contrast"})`');
    box-shadow: v-bind('`${isHovered && !isEmpty ? "0 0 3px var(--emphasis)" : "0 1px 3px rgba(0, 0, 0, 0.5)"}`');
    border-color: v-bind('`var(${isHovered && !isEmpty ? "--emphasis" : "--background"})`');
  }
</style>
