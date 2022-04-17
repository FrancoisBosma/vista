<script setup lang="ts">
  defineProps<{ title: String; subTiles: Object[]; isHovered: Boolean }>()
</script>

<template>
  <div class="open-concept">
    <TileList :sub-tiles="subTiles" />
  </div>
</template>

<style scoped lang="postcss">
  .open-concept {
    @apply p-1em rounded-10px border;
    border-color: v-bind('`var(${isHovered ? "--emphasis" : "--foreground"})`');
    box-shadow: v-bind('`${isHovered ? "0 0 3px var(--emphasis)" : "0 1px 3px rgba(0, 0, 0, 0.5)"}`');
  }
</style>
