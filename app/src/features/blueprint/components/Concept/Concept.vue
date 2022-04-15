<script setup lang="ts">
  import { useConceptStore } from '@FEATURES/blueprint/stores/concepts'
  const concepts = useConceptStore()
  const concept = concepts.helloWorld
</script>

<template>
  <div>
    <h1>{{ concept.title }}</h1>
  </div>
</template>
