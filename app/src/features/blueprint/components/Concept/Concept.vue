<script setup lang="ts">
  import CloseConcept from './CloseConcept'
  import OpenConcept from './OpenConcept'
  import { useConceptStore } from '@FEATURES/blueprint/stores/concepts'
  const concepts = useConceptStore()
  const concept = concepts.helloWorld
</script>

<template>
  <div>
    <keep-alive>
      <CloseConcept v-if="true" v-bind="concept" />
      <OpenConcept v-else />
    </keep-alive>
  </div>
</template>
