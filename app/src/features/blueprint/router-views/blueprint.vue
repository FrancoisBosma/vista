<route lang="yaml">
meta:
  public: true # cf. auth/navigationGuards.ts
  layout: FullScreenLayout
</route>

<script setup lang="ts">
  import { Grid, TileList } from '../components'
</script>

<template>
  <div class="bp-container">
    <Grid />
    <div class="bp-content">
      <TileList />
    </div>
  </div>
</template>

<style scoped lang="postcss">
  .bp-container {
    @apply relative w-full h-full children:(absolute);
  }
  .bp-content {
    @apply top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
  }
</style>
