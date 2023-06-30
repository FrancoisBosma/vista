<script setup lang="ts">
  import { BlueprintNode } from '@FEATURES/blueprint/components'
  import ConceptComposition from './ConceptComposition'
  import type { Concept } from '@API/gql-generated/graphql'
  import type { Pair } from '@SRC/types'

  const props = defineProps<{ concept: Concept }>()
  const { concept } = toRefs(props)
  let leftMost = 0
  let rightMost = 0
  let topMost = 0
  let bottomMost = 0
  concept.value.composition?.subConcepts.forEach((subConcept) => {
    const scXy = subConcept.xy?.split(':').map((s) => Number(s))
    const scWh = subConcept.wh?.split(':').map((s) => Number(s))
    if (scXy?.length !== 2 || scWh?.length !== 2) return
    leftMost = Math.min(leftMost, scXy[0] - scWh[0] / 2)
    rightMost = Math.max(rightMost, scXy[0] + scWh[0] / 2)
    topMost = Math.max(topMost, scXy[1] + scWh[1] / 2)
    bottomMost = Math.min(bottomMost, scXy[1] - scWh[1] / 2)
  })
  const contentDimensions: Pair<number> = `${rightMost - leftMost}:${topMost - bottomMost}`
</script>

<template>
  <div class="open-concept">
    <BlueprintNode v-if="concept.composition" :content-dimensions="contentDimensions">
      <ConceptComposition :concept="concept" />
    </BlueprintNode>
  </div>
</template>

<style scoped lang="postcss">
  .open-concept {
    @apply w-full h-full overflow-hidden border-[var(--foreground)];
  }
</style>
