<script setup lang="ts">
  defineProps<{ title: String; subTiles: Object[]; isHovered: Boolean }>()
</script>

<template>
  <h1>{{ title }}</h1>
  <h1>{{ isHovered }}</h1>
</template>
