<script setup lang="ts">
  import { useConceptStore, useUiStore } from '@FEATURES/blueprint/stores'
  import type { Concept } from '@API/gql-generated/graphql'
  import type { Pair } from '@ROOT/src/types'

  const { concept } = defineProps<{
    concept: Concept
  }>()

  const ui = useUiStore()
  const conceptStore = useConceptStore()

  // Lazy loading necessary because of mutual nesting
  const ConceptSFC = defineAsyncComponent(() => import('@FEATURES/blueprint/components/Concept'))

  const contentEdgePositions = ui.getContentEdgePositions(concept)

  // WIP
  const connection = concept.composition?.connections[0]
  const sourceXY = connection?.sourceCustomID
  const targetXY = connection?.targetConceptCustomID
  const sourceConceptName = connection?.sourceArgumentType.name.substring(
    0,
    connection?.sourceArgumentType.name.lastIndexOf('.')
  )
  const targetConceptName = concept.composition?.subConcepts.find((subConcept) => subConcept.xy === targetXY)?.concept
    .name
  const sourceWH = conceptStore.getStoreConcept(sourceConceptName ?? '')?.wh
  const targetWH = conceptStore.getStoreConcept(targetConceptName ?? '')?.wh
  const [sourceX, sourceY] = getNumbersFromPair(sourceXY as Pair<number>)
  const [sourceW, sourceH] = getNumbersFromPair(sourceWH as Pair<number>)
  const [targetX, targetY] = getNumbersFromPair(targetXY as Pair<number>)
  const [targetW, targetH] = getNumbersFromPair(targetWH as Pair<number>)
</script>

<template>
  <ConceptSFC
    v-for="(subConcept, index) in concept.composition?.subConcepts"
    :key="index"
    :concept-name="subConcept.concept.name"
    :sub-concept-style="ui.getSubConceptStyle(contentEdgePositions, subConcept)"
  />
  <BoxToBoxArrow
    :from="{ x: sourceX, y: sourceY, width: sourceW, height: sourceH }"
    :to="{ x: targetX, y: targetY, width: targetW, height: targetH }"
  />
</template>
