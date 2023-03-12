<route lang="yaml">
meta:
  public: true # cf. auth/navigationGuards.ts
  layout: FullScreenLayout
</route>

<script setup lang="ts">
  import { Blueprint, Concept } from '@FEATURES/blueprint/components'
  import { BlueprintBackgroundColor } from '@FEATURES/blueprint/types'
  const conceptName = 'Communication'
</script>

<template>
  <Blueprint>
    <Concept :concept-name="conceptName" :blueprint-bg-color="BlueprintBackgroundColor.normal" />
  </Blueprint>
</template>
