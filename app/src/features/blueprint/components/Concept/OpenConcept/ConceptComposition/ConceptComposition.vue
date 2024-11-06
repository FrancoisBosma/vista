<script setup lang="ts">
  import { useConceptStore, useUiStore } from '@FEATURES/blueprint/stores'
  import { ArgumentFeederType } from '@API/gql-generated/graphql'
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
  const connection = concept.composition?.connections.find((connection) => connection.argumentFeederType === ArgumentFeederType.OtherSubConcept)
  const fedSubConceptKey = connection?.fedSubConceptKey
  const argumentFeederKey = connection?.argumentFeederKey
  const fedSubConceptConceptName = connection?.fedSubConceptArgumentType.name.substring(
    0,
    connection?.fedSubConceptArgumentType.name.lastIndexOf('.')
  )
  const argumentFeederConceptName = concept.composition?.subConcepts.find(
    (subConcept) => subConcept.xy === argumentFeederKey
  )?.concept.name
  const fedSubConceptWH = conceptStore.getStoreConcept(fedSubConceptConceptName ?? '')?.wh
  const argumentFeederWH = conceptStore.getStoreConcept(argumentFeederConceptName ?? '')?.wh
  const [fedSubConceptW, fedSubConceptH] = getNumbersFromPair(fedSubConceptWH as Pair<number>)
  const [fedSubConceptX, fedSubConceptY] = getNumbersFromPair(fedSubConceptKey as Pair<number>).map(
    (coord, idx) => coord - (idx === 0 ? fedSubConceptW : fedSubConceptH) / 2
  )
  const [argumentFeederW, argumentFeederH] = getNumbersFromPair(argumentFeederWH as Pair<number>)
  const [argumentFeederX, argumentFeederY] = getNumbersFromPair(argumentFeederKey as Pair<number>).map(
    (coord, idx) => coord - (idx === 0 ? argumentFeederW : argumentFeederH) / 2
  )
</script>

<template>
  <ConceptSFC
    v-for="(subConcept, index) in concept.composition?.subConcepts"
    :key="index"
    :concept-name="subConcept.concept.name"
    :sub-concept-style="ui.getSubConceptStyle(contentEdgePositions, subConcept)"
  />
  <BoxToBoxArrow
    :from="{ x: argumentFeederX, y: argumentFeederY, width: argumentFeederW, height: argumentFeederH }"
    :to="{ x: fedSubConceptX, y: fedSubConceptY, width: fedSubConceptW, height: fedSubConceptH }"
  />
</template>
