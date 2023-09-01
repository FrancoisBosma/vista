<script setup lang="ts">
  import type { ConceptKey } from '@FEATURES/BlueprintV2/types'
  
  const { contentKey } = defineProps<{ contentKey: ConceptKey }>()
</script>

<template>
  <div>{{ contentKey }}</div>
</template>
