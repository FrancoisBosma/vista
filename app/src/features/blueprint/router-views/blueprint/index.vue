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
  <!-- <div class="w-full h-30 bg-blue-400">HELLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO</div>
  <div class="w-full h-full children:(!w-[50%] !h-[50%] relative left-[25%] top-[25%] !overflow-visible !border !border-red-500)">
    <Blueprint :bg-color="BlueprintBackgroundColor.normal">
      <Concept :concept-name="conceptName" :blueprint-bg-color="BlueprintBackgroundColor.normal" />
    </Blueprint>
  </div> -->
  <Blueprint :bg-color="BlueprintBackgroundColor.normal">
    <Concept :concept-name="conceptName" :blueprint-bg-color="BlueprintBackgroundColor.normal" />
  </Blueprint>
</template>
