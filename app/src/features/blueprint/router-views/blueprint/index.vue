<route lang="yaml">
meta:
  public: true # cf. auth/navigationGuards.ts
  layout: FullScreenLayout
</route>

<script setup lang="ts">
  import { BlueprintNode, Concept } from '@FEATURES/blueprint/components'
  const conceptName = 'Communication'

  // Disable default zooming, e.g. from pinching
  useHead({
    meta: [
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no',
      },
    ],
  })
</script>

<template>
  <BlueprintNode>
    <Concept :concept-name="conceptName" />
  </BlueprintNode>
</template>
