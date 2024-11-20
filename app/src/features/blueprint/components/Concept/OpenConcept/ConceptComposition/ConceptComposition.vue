<script setup lang="ts">
  import { useConceptStore, useUiStore } from '@FEATURES/blueprint/stores'
  import { ArgumentFeederType } from '@API/gql-generated/graphql'
  import type { Concept, SubConceptConnection } from '@API/gql-generated/graphql'
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  import type { Pair } from '@ROOT/src/types'
  import type { Coordinates } from '@FEATURES/blueprint/types'

  const { concept } = defineProps<{
    concept: Concept
  }>()

  const ui = useUiStore()
  const conceptStore = useConceptStore()

  // Lazy loading necessary because of mutual nesting
  const ConceptSFC = defineAsyncComponent(() => import('@FEATURES/blueprint/components/Concept'))

  const contentEdgePositions = ui.getContentEdgePositions(concept)
  const feedingConnections = reactive(
    (
      concept.composition?.connections.filter(
        (connection) => connection.argumentFeederType === ArgumentFeederType.OtherSubConcept
      ) ?? []
    ).map((connection) => {
      const fedSubConceptKey = connection?.fedSubConceptKey
      const argumentFeederKey = connection?.argumentFeederKey
      const fedSubConcept = concept.composition?.subConcepts.find((subConcept) => subConcept.xy === fedSubConceptKey)
      const argumentFeederConceptName = concept.composition?.subConcepts.find(
        (subConcept) => subConcept.xy === argumentFeederKey
      )?.concept.name
      if (!fedSubConcept?.concept.name || !argumentFeederConceptName) return undefined as never
      const argumentFeederConcept = conceptStore.getStoreConcept(argumentFeederConceptName)
      if (!argumentFeederConcept) return undefined as never
      const fedSubConceptWH = getNumbersFromPair(fedSubConcept.concept.wh as Pair<number>)
      const fedSubConceptXY = getNumbersFromPair(fedSubConceptKey as Pair<number>).map(
        (coord, idx) => coord - (idx === 0 ? fedSubConceptWH[0] : fedSubConceptWH[1]) / 2
      )
      const argumentFeederWH = getNumbersFromPair(argumentFeederConcept.wh as Pair<number>)
      const argumentFeederXY = getNumbersFromPair(argumentFeederKey as Pair<number>).map(
        (coord, idx) => coord - (idx === 0 ? argumentFeederWH[0] : argumentFeederWH[1]) / 2
      )

      return {
        id: connection.id,
        fedSubConceptX: fedSubConceptXY[0],
        fedSubConceptY: fedSubConceptXY[1],
        fedSubConceptW: fedSubConceptWH[0],
        fedSubConceptH: fedSubConceptWH[1],
        argumentFeederX: argumentFeederXY[0],
        argumentFeederY: argumentFeederXY[1],
        argumentFeederW: argumentFeederWH[0],
        argumentFeederH: argumentFeederWH[1],
      }
    })
  )

  function getSubConceptFeedingConnections(xy: Pair<number>) {
    return concept.composition?.connections.filter((connection) => connection.fedSubConceptKey === xy)
  }

  function handleUpdateArgumentsPositions(positions: Record<SubConceptConnection['id'], Coordinates>) {
    Object.entries(positions).forEach(([connectionId, { x: fedSubConceptX, y: fedSubConceptY }]) => {
      const feedingConnection = feedingConnections.find((feedingConnection) => feedingConnection.id === connectionId)
      if (!feedingConnection) return
      feedingConnection.fedSubConceptX = fedSubConceptX
      feedingConnection.fedSubConceptY = fedSubConceptY
      feedingConnection.fedSubConceptW = 1
      feedingConnection.fedSubConceptH = 1
    })
  }
</script>

<template>
  <ConceptSFC
    v-for="(subConcept, index) in concept.composition?.subConcepts"
    :key="index"
    :concept-name="subConcept.concept.name"
    :sub-concept-style="ui.getSubConceptStyle(contentEdgePositions, subConcept)"
    :feeding-connections="getSubConceptFeedingConnections(subConcept.xy as Pair<number>)"
    @update:arguments-positions="handleUpdateArgumentsPositions"
  />
  <BoxToBoxArrow
    v-for="(connection, idx) in feedingConnections"
    :key="idx"
    class="-z-1"
    :from="{
      x: connection.argumentFeederX,
      y: connection.argumentFeederY,
      width: connection.argumentFeederW,
      height: connection.argumentFeederH,
    }"
    :to="{
      x: connection.fedSubConceptX,
      y: connection.fedSubConceptY,
      width: connection.fedSubConceptW,
      height: connection.fedSubConceptH,
    }"
  />
</template>
