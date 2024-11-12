<script setup lang="ts">
  import { invoke } from '@vueuse/core'
  import { useConceptStore, useUiStore } from '@FEATURES/blueprint/stores'
  import { ArgumentFeederType } from '@API/gql-generated/graphql'
  import type { Concept } from '@API/gql-generated/graphql'
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
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
  const fedSubConceptX = ref(0)
  const fedSubConceptY = ref(0)
  const fedSubConceptW = ref(0)
  const fedSubConceptH = ref(0)
  const argumentFeederX = ref(0)
  const argumentFeederY = ref(0)
  const argumentFeederW = ref(0)
  const argumentFeederH = ref(0)
  invoke(() => {
    const connection = concept.composition?.connections.find(
      (connection) => connection.argumentFeederType === ArgumentFeederType.OtherSubConcept
    )
    const fedSubConceptKey = connection?.fedSubConceptKey
    const argumentFeederKey = connection?.argumentFeederKey
    const fedSubConceptName = connection?.fedSubConceptArgumentType.name.substring(
      0,
      connection?.fedSubConceptArgumentType.name.lastIndexOf('.')
    )
    const argumentFeederConceptName = concept.composition?.subConcepts.find(
      (subConcept) => subConcept.xy === argumentFeederKey
    )?.concept.name
    if (!fedSubConceptName || !argumentFeederConceptName) return
    const fedSubConcept = conceptStore.getStoreConcept(fedSubConceptName)
    const argumentFeederConcept = conceptStore.getStoreConcept(argumentFeederConceptName)
    if (!fedSubConcept || !argumentFeederConcept) return
    const fedSubConceptWH = getNumbersFromPair(fedSubConcept.wh as Pair<number>)
    const fedSubConceptXY = getNumbersFromPair(fedSubConceptKey as Pair<number>).map(
      (coord, idx) => coord - (idx === 0 ? fedSubConceptWH[0] : fedSubConceptWH[1]) / 2
    )
    const argumentFeederWH = getNumbersFromPair(argumentFeederConcept.wh as Pair<number>)
    const argumentFeederXY = getNumbersFromPair(argumentFeederKey as Pair<number>).map(
      (coord, idx) => coord - (idx === 0 ? argumentFeederWH[0] : argumentFeederWH[1]) / 2
    )

    fedSubConceptX.value = fedSubConceptXY[0]
    fedSubConceptY.value = fedSubConceptXY[1]
    fedSubConceptW.value = fedSubConceptWH[0]
    fedSubConceptH.value = fedSubConceptWH[1]
    argumentFeederX.value = argumentFeederXY[0]
    argumentFeederY.value = argumentFeederXY[1]
    argumentFeederW.value = argumentFeederWH[0]
    argumentFeederH.value = argumentFeederWH[1]
  })

  function getSubConceptFeedingConnections(xy: Pair<number>) {
    return concept.composition?.connections.filter((connection) => connection.fedSubConceptKey === xy)
  }
</script>

<template>
  <ConceptSFC
    v-for="(subConcept, index) in concept.composition?.subConcepts"
    :key="index"
    :concept-name="subConcept.concept.name"
    :sub-concept-style="ui.getSubConceptStyle(contentEdgePositions, subConcept)"
    :feeding-connections="getSubConceptFeedingConnections(subConcept.xy as Pair<number>)"
  />
  <BoxToBoxArrow
    :from="{ x: argumentFeederX, y: argumentFeederY, width: argumentFeederW, height: argumentFeederH }"
    :to="{ x: fedSubConceptX, y: fedSubConceptY, width: fedSubConceptW, height: fedSubConceptH }"
  />
</template>
