<script setup lang="ts">
  import { useUiStore } from '@FEATURES/blueprint/stores'
  import { ArgumentFeederType } from '@API/gql-generated/graphql'
  import { getNumbersFromPair } from '@GLOBAL/functions/pairs'
  import type { Concept } from '@API/gql-generated/graphql'
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  import type { Pair } from '@ROOT/src/types'
  import type { Coordinates, SubConceptArgumentKey } from '@FEATURES/blueprint/types'

  const { concept } = defineProps<{
    concept: Concept
  }>()

  const DEFAULT_ARGUMENT_POSITION = { x: -1, y: -1 } as const

  const ui = useUiStore()

  // Lazy loading necessary because of mutual nesting
  const ConceptSFC = defineAsyncComponent(() => import('@FEATURES/blueprint/components/Concept'))

  const isReadyToShowConnections = ref(false)
  const contentEdgePositions = ui.getContentEdgePositions(concept)

  // const conceptsPositions = reactive<Record<ConceptArgumentKey, Coordinates>>()
  const conceptsArgumentsPositions = reactive<Record<SubConceptArgumentKey, Coordinates>>(
    concept.composition
      ? Object.fromEntries(
          concept.composition.connections.map((connection) => {
            const fedSubConceptArgumentKey = getArgumentKey(
              connection.fedSubConceptArgumentType.name,
              connection.fedSubConceptKey as Pair<number>
            )
            return [fedSubConceptArgumentKey, { ...DEFAULT_ARGUMENT_POSITION }]
          })
        )
      : {}
  )

  function getArgumentKey(argumentName: string, subArgumentKey: Pair<number>): SubConceptArgumentKey {
    return `${argumentName}@${subArgumentKey}`
  }

  function getSubConceptFeedingConnections(xy: Pair<number>) {
    return concept.composition?.connections.filter((connection) => connection.fedSubConceptKey === xy)
  }

  function getSubConceptWh(xy: Pair<number>) {
    return getNumbersFromPair(
      concept.composition!.subConcepts.find((subConcept) => subConcept.xy === xy)!.concept.wh as Pair<number>
    )
  }

  function formatSubConceptCoordsForArrow(xy: Pair<number>) {
    const [x, y] = getNumbersFromPair(xy)
    const [subConceptW, subConceptH] = getSubConceptWh(xy)
    return [x - subConceptW / 2, y - subConceptH / 2]
  }

  function handleUpdateArgumentsPositions(positions: Record<SubConceptArgumentKey, Coordinates>) {
    Object.entries(positions).forEach(([argumentKey, { x: fedSubConceptX, y: fedSubConceptY }]) => {
      conceptsArgumentsPositions[argumentKey as SubConceptArgumentKey].x = fedSubConceptX
      conceptsArgumentsPositions[argumentKey as SubConceptArgumentKey].y = fedSubConceptY
    })
  }

  const { stop } = watch(conceptsArgumentsPositions, (updatedPositions) => {
    if (
      Object.values(updatedPositions).some(
        (position) => position.x === DEFAULT_ARGUMENT_POSITION.x && position.y === DEFAULT_ARGUMENT_POSITION.y
      )
    )
      return
    isReadyToShowConnections.value = true
    stop()
  })
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
  <template v-if="isReadyToShowConnections">
    <BoxToBoxArrow
      v-for="(connection, idx) in concept.composition?.connections.filter(
        (connection) => connection.argumentFeederType === ArgumentFeederType.OtherSubConcept
      )"
      :key="idx"
      class="-z-1"
      :from="{
        x: formatSubConceptCoordsForArrow(connection.argumentFeederKey as Pair<number>)[0],
        y: formatSubConceptCoordsForArrow(connection.argumentFeederKey as Pair<number>)[1],
        width: getSubConceptWh(connection.argumentFeederKey as Pair<number>)[0],
        height: getSubConceptWh(connection.argumentFeederKey as Pair<number>)[1],
      }"
      :to="{
        x: conceptsArgumentsPositions[
          getArgumentKey(connection.fedSubConceptArgumentType.name, connection.fedSubConceptKey as Pair<number>)
        ].x,
        y: conceptsArgumentsPositions[
          getArgumentKey(connection.fedSubConceptArgumentType.name, connection.fedSubConceptKey as Pair<number>)
        ].y,
        width: 1,
        height: 1,
      }"
    />
    <BoxToBoxArrow
      v-for="(connection, idx) in concept.composition?.connections.filter(
        (connection) => connection.argumentFeederType === ArgumentFeederType.OtherSubConceptArgument
      )"
      :key="idx"
      class="-z-1"
      :from="{
        x: conceptsArgumentsPositions[
          getArgumentKey(connection.argumentFeederArgumentType!.name, connection.argumentFeederKey as Pair<number>)
        ].x,
        y: conceptsArgumentsPositions[
          getArgumentKey(connection.argumentFeederArgumentType!.name, connection.argumentFeederKey as Pair<number>)
        ].y,
        width: 1,
        height: 1,
      }"
      :to="{
        x: conceptsArgumentsPositions[
          getArgumentKey(connection.fedSubConceptArgumentType.name, connection.fedSubConceptKey as Pair<number>)
        ].x,
        y: conceptsArgumentsPositions[
          getArgumentKey(connection.fedSubConceptArgumentType.name, connection.fedSubConceptKey as Pair<number>)
        ].y,
        width: 1,
        height: 1,
      }"
    />
  </template>
</template>
