<route lang="yaml">
meta:
  public: true # cf. auth/navigationGuards.ts
  layout: FullScreenLayout
</route>

<script setup lang="ts">
  import { Concept, Grid } from '../components'
  import { useUiStore } from '@FEATURES/blueprint/stores'

  const ui = useUiStore()

  const bp = ref(null)
  const { pressed: isUserPressingDown } = useMousePressed({ target: bp })
  watch(isUserPressingDown, () => (ui.isUserPressingDown = isUserPressingDown.value))
</script>

<template>
  <div ref="bp" class="bp-container">
    <Grid />
    <Concept class="bp-content" />
  </div>
</template>

<style scoped lang="postcss">
  .bp-container {
    @apply relative w-full h-full children:(absolute);
    cursor: v-bind('`${isUserPressingDown ? "grabbing ": "grab"}`');
  }
  .bp-content {
    @apply top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
  }
</style>
