<template>
  <div class="concept-set">
    <!-- <template v-for="(subtile, index) in concept.subTiles" :key="index">
      <Tile v-bind="subtile" />
      <div v-if="index !== concept.subTiles.length - 1" class="concept-link" />
    </template> -->
  </div>
</template>

<style scoped lang="postcss">
  .concept-set {
    @apply flex items-center;
  }
  .concept-link {
    @apply w-50px border-dashed border-b-2;
  }
</style>
