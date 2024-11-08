<script setup lang="ts">
  import { invoke, until } from '@vueuse/core'
  import CloseConcept from './CloseConcept'
  import OpenConcept from './OpenConcept'
  import { useConceptStore, useUiStore } from '@FEATURES/blueprint/stores'
  import { setManipulationHandling, setStyleHandling } from './composables'
  import {
    bpNodeProvideKey,
    conceptProvideKey,
  } from '@FEATURES/blueprint/components/BlueprintNode/Blueprint/constants/symbols'
  import type { Concept } from '@API/gql-generated/graphql'
  import type { Pair } from '@ROOT/src/types'
  // import type { Position } from '@FEATURES/blueprint/components/Concept/types/Concept'

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
   * DELETEME
   *
   * icons: screen-normal vs fit-screen
   *
   */

  /**
                                        o
                                      <--->
        _____________________________________________________________
        |                             |   /                          |
        |                             |a /                           |
      h |                             |/                             |
        |                                                            |
        |                                                            |
        |____________________________________________________________|
                                      w
    */
  const argumentPositionAngle /* 'a' */ = 0 // degrees
  const [polygonW, polygonH, polygonTranslateX, polygonTranslateY] = [12, 12, 2, 2]
  const argumentLeft = ref('-6px')
  const argumentTop = ref('-14px')
  invoke(async () => {
    await until(isConceptFetched).toBe(true)
    const [w, h] = getNumbersFromPair(concept.value.wh as Pair<number>)
    const tileCenterX = w / 2
    const tileCenterY = h / 2
    const svgCenterOffsetX = -polygonW / 2 - polygonTranslateX
    const xOffset /* 'o' */ = Math.tan(argumentPositionAngle) * tileCenterY
    const left = tileCenterX + svgCenterOffsetX + xOffset
    const top = -(polygonH + polygonTranslateY)
    argumentLeft.value = `${left}px`
    argumentTop.value = `${top}px`
  })
</script>

<template>
  <div class="concept" :style="subConceptStyle" @click.stop="handleClick">
    <svg
      v-if="isConceptFetched"
      class="absolute w-4 h-4 -z-1"
      :style="{
        top: argumentTop,
        left: argumentLeft,
      }"
      viewBox="0 0 16 16"
      stroke="#000"
      fill="#000"
      strokeWidth="1"
    >
      <polygon points="0,0 6,10 12,0 12,12 0,12" :transform="`translate(2,2) rotate(${0 * (180 / Math.PI)})`" />
    </svg>
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
        <OpenConcept :concept="concept" :is-empty="isEmpty" />
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
