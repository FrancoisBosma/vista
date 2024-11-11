<script setup lang="ts">
  import CloseConcept from './CloseConcept'
  import OpenConcept from './OpenConcept'
  import ConceptArgument from './ConceptArgument'
  import { useConceptStore, useUiStore } from '@FEATURES/blueprint/stores'
  import { setManipulationHandling, setStyleHandling } from './composables'
  import {
    bpNodeProvideKey,
    conceptProvideKey,
  } from '@FEATURES/blueprint/components/BlueprintNode/Blueprint/constants/symbols'
  import { Concept } from '@API/gql-generated/graphql'

  const { conceptName, subConceptStyle } = defineProps<{
    conceptName: Concept['name']
    subConceptStyle?: ReturnType<ReturnType<typeof useUiStore>['getSubConceptStyle']>
  }>()
  const ui = useUiStore()
  const { depth: parentDepth, id: bpNodeId } = inject(bpNodeProvideKey, { depth: 0 })
  const { parentCumulativeSubContentScale } = inject(conceptProvideKey, { parentCumulativeSubContentScale: 1 })

  const { fetchConcept } = useConceptStore()

  const closeConceptEl = ref(null) as Ref<HTMLElement | null>
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

  provide(conceptProvideKey, { parentCumulativeSubContentScale: styleKit.currentCumulativeSubContentScale })
  /**
   * TODO
   *
   * icons: screen-normal vs fit-screen
   *
   */

  const argumentPositionAngle /* 'a' */ = ((alpha) => ((alpha % 360) + 360) % 360)(200) // degrees, within [0, 360]
</script>

<template>
  <div class="concept" :style="subConceptStyle" @click.stop="handleClick">
    <ConceptArgument
      v-if="isConceptFetched"
      :position-angle="argumentPositionAngle"
      :concept-w-h="concept.wh"
      :tile-roundness="styleKit.conceptRoundness"
    />
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

    & > :not(svg) {
      @apply border-1;
      box-shadow: v-bind('styleKit.boxShadow');
      border-radius: v-bind('styleKit.conceptRoundness');
    }
  }
</style>
