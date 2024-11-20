<script setup lang="ts">
  import { useTemplateRef } from 'vue'
  import CloseConcept from './CloseConcept'
  import OpenConcept from './OpenConcept'
  import ConceptArgument from './ConceptArgument'
  import { useConceptStore, useUiStore } from '@FEATURES/blueprint/stores'
  import { setManipulationHandling, setStyleHandling } from './composables'
  import {
    bpNodeProvideKey,
    conceptProvideKey,
  } from '@FEATURES/blueprint/components/BlueprintNode/Blueprint/constants/symbols'
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  import type { Concept, SubConceptConnection } from '@API/gql-generated/graphql'
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  import type { Pair } from '@ROOT/src/types'
  import type { Coordinates } from '@FEATURES/blueprint/types'

  interface Props {
    conceptName: Concept['name']
    subConceptStyle?: ReturnType<ReturnType<typeof useUiStore>['getSubConceptStyle']>
    feedingConnections?: NonNullable<Concept['composition']>['connections']
  }
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  type Emits = {
    'update:argumentsPositions': [positions: Record<SubConceptConnection['id'], Coordinates>]
  }

  const { conceptName, subConceptStyle, feedingConnections } = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const { depth: parentDepth, id: bpNodeId } = inject(bpNodeProvideKey, { depth: 0 })
  const { parentCumulativeSubContentScale } = inject(conceptProvideKey, { parentCumulativeSubContentScale: 1 })

  const ui = useUiStore()
  const { fetchConcept } = useConceptStore()

  const closeConceptEl = useTemplateRef<HTMLElement>('closeConceptEl')
  const { concept, isDone: isConceptFetched } = fetchConcept(conceptName)
  const isEmpty = eagerComputed(() => !concept.value.composition?.subConcepts.length)

  const { isHovered, isOpen, handleClick } = setManipulationHandling({ isEmpty, closeConceptEl })
  const styleKit = setStyleHandling({
    isEmpty,
    isHovered,
    concept,
    isConceptFetched,
    parentDepth,
    subConceptStyle,
    bpNodeId,
    parentCumulativeSubContentScale,
  })

  const argumentsPositions = reactive<Record<SubConceptConnection['id'], Coordinates>>({})

  function updateArgumentPosition(
    connectionId: SubConceptConnection['id'],
    argumentPosition: Coordinates,
    conceptXY: Pair<number>
  ) {
    const [conceptX, conceptY] = getNumbersFromPair(conceptXY)
    const [conceptW, conceptH] = getNumbersFromPair(concept.value.wh! as Pair<number>)

    // from here we consider coords relative to the center of tiles => the "- wh / 2"
    const newPosition = {
      x: conceptX - conceptW / 2 + argumentPosition.x,
      y: conceptY - conceptH / 2 + argumentPosition.y,
    }
    argumentsPositions[connectionId] = newPosition
  }

  watch(argumentsPositions, (val) => emit('update:argumentsPositions', val))

  provide(conceptProvideKey, { parentCumulativeSubContentScale: styleKit.currentCumulativeSubContentScale })
  /**
   * TODO
   *
   * icons: screen-normal vs fit-screen
   *
   */
</script>

<template>
  <div class="concept" :style="subConceptStyle" @click.stop="handleClick">
    <template v-if="isConceptFetched">
      <ConceptArgument
        v-for="(connection, idx) in feedingConnections"
        :key="idx"
        class="concept-argument"
        :connection="connection"
        :concept-w-h="(concept.wh as Pair<number>)"
        :concept-name="conceptName"
        :tile-roundness="styleKit.conceptRoundness"
        @update:argument-position="
          (argPosition) => updateArgumentPosition(connection.id, argPosition, connection.fedSubConceptKey as Pair<number>)
        "
      />
    </template>
    <keep-alive>
      <CloseConcept
        v-if="!isOpen"
        ref="closeConceptEl"
        :concept="concept"
        :is-hovered="isHovered"
        :is-empty="isEmpty"
      />
      <template v-else>
        <Teleport :to="`#bp-${ui.getBlueprintTreeRoot()?.id}`">
          <div
            :style="{
              width: styleKit.dimensions.width,
              height: styleKit.dimensions.height,
              backgroundColor: styleKit.conceptBgColor,
              borderRadius: styleKit.conceptRoundness,
              transform: styleKit.bgDisplay.transform,
              left: styleKit.bgDisplay.left,
              top: styleKit.bgDisplay.top,
            }"
          />
        </Teleport>
        <OpenConcept v-if="isConceptFetched" :concept="(concept as Concept)" :is-empty="isEmpty" />
      </template>
    </keep-alive>
  </div>
</template>

<style scoped lang="postcss">
  .concept {
    @apply select-none;
    cursor: v-bind('styleKit.cursor');
    width: v-bind('styleKit.dimensions.width');
    height: v-bind('styleKit.dimensions.height');

    & > :not(.concept-argument) {
      @apply border-1;
      box-shadow: v-bind('styleKit.boxShadow');
      border-radius: v-bind('styleKit.conceptRoundness');
    }
  }
</style>
