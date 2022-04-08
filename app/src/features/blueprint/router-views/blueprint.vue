<route lang="yaml">
meta:
  public: true # cf. auth/navigationGuards.ts
  layout: FullScreenLayout
</route>

<template>
  <div class="blueprint-container"> </div>
</template>

<style scoped lang="postcss">
  .blueprint-container {
    @apply w-full h-full bg-red-500;
  }
</style>
