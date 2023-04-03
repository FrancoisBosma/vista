<route lang="yaml">
meta:
  public: true # cf. auth/navigationGuards.ts
  layout: FullScreenLayout
</route>

<script setup lang="ts">
  import { Blueprint, Concept } from '@FEATURES/blueprint/components'
  const conceptName = 'Communication'
</script>

<template>
  <Blueprint :depth="0">
    <Concept :concept-name="conceptName" />
  </Blueprint>
</template>
