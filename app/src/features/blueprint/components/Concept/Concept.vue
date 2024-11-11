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
  import { Concept } from '@API/gql-generated/graphql'
  import type { Pair } from '@ROOT/src/types'

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

  /**
                                        o
                      zone5           <--->          zone1
        _____________________________________________________________
        |                             |   /                          |
        |                             |a /                           |
zone4 h |                             |/                             | zone2
        |                                                            |
        |                                                            |
        |____________________________________________________________|
                                      w
                                    zone3
    */
  const argumentPositionAngle /* 'a' */ = ((alpha) => ((alpha % 360) + 360) % 360)(90) // degrees, within [0, 360]
  const [svgW, svgH] = [16, 16]
  const argumentLeft = ref('')
  const argumentTop = ref('')
  const argumentAngle = ref(0)
  const argumentAllowedAngles = computed(() => {
    if (!isConceptFetched.value) return []
    const [w, h] = getNumbersFromPair(concept.value.wh as Pair<number>)
    const tileRadius = Number(styleKit.conceptRoundness.split('px')[0])
    const [[zone1And5, zone3], [zone2, zone4]] = [false, true].map((doingVerticalSides: boolean) => {
      const [offsetOffsetSideLength, counterSideLength] = doingVerticalSides ? [h, w] : [w, h]
      const edgeDistance = offsetOffsetSideLength / 2 - tileRadius - svgW / 2
      const halfCounterSide = counterSideLength / 2
      const edgeAngle = toDegrees(Math.atan(edgeDistance / halfCounterSide))
      return [
        [-edgeAngle, edgeAngle].map((angle) => (doingVerticalSides ? 90 : 0) + angle),
        [-edgeAngle, edgeAngle].map((angle) => (doingVerticalSides ? 90 : 0) + angle + 180),
      ] as [[number, number], [number, number]]
    })
    const [zone5, zone1] = [[zone1And5[0], 0].map((angle) => angle + 360), [0, zone1And5[1]]] as [
      [number, number],
      [number, number]
    ]
    return [zone1, zone2, zone3, zone4, zone5]
  })

  invoke(async () => {
    await until(isConceptFetched).toBe(true)
    watch(
      () => concept.value.wh,
      () => {
        const [w, h] = getNumbersFromPair(concept.value.wh as Pair<number>)
        let tileCenterOffsetSideCoord: number = undefined as never
        let tileCenterCounterSideCoord: number = undefined as never
        let svgCenterOffsetSideCoord: number = undefined as never
        let isOffsetOnLeftAttr = true
        // angle calibration
        if (
          (argumentPositionAngle >= argumentAllowedAngles.value[0][0] &&
            argumentPositionAngle <= argumentAllowedAngles.value[0][1]) ||
          (argumentPositionAngle >= argumentAllowedAngles.value[4][0] &&
            argumentPositionAngle <= argumentAllowedAngles.value[4][1])
        ) {
          // zone 1 or 5
          argumentAngle.value = 0
          tileCenterOffsetSideCoord = w / 2
          tileCenterCounterSideCoord = h / 2
          svgCenterOffsetSideCoord = svgW / 2
        } else if (
          argumentPositionAngle >= argumentAllowedAngles.value[1][0] &&
          argumentPositionAngle <= argumentAllowedAngles.value[1][1]
        ) {
          // zone 2
          argumentAngle.value = 90
          tileCenterOffsetSideCoord = h / 2
          tileCenterCounterSideCoord = w / 2
          svgCenterOffsetSideCoord = svgH / 2
          isOffsetOnLeftAttr = false
        } else if (
          argumentPositionAngle >= argumentAllowedAngles.value[2][0] &&
          argumentPositionAngle <= argumentAllowedAngles.value[2][1]
        )
          argumentAngle.value = 180 // zone 3
        else if (
          argumentPositionAngle >= argumentAllowedAngles.value[3][0] &&
          argumentPositionAngle <= argumentAllowedAngles.value[3][1]
        )
          argumentAngle.value = 270 // zone 4
        else throw new Error("[Concept.vue] concept argument's angle is not allowed")

        const offset /* 'o' */ =
          tileCenterOffsetSideCoord -
          svgCenterOffsetSideCoord +
          Math.tan(toRadians(argumentPositionAngle - argumentAngle.value)) * tileCenterCounterSideCoord
        const top = -svgH

        argumentLeft.value = `${isOffsetOnLeftAttr ? offset : tileCenterCounterSideCoord * 2}px`
        argumentTop.value = `${isOffsetOnLeftAttr ? top : offset}px`
      },
      { immediate: true }
    )
  })
</script>

<template>
  <div class="concept" :style="subConceptStyle" @click.stop="handleClick">
    <svg
      v-if="isConceptFetched"
      class="absolute w-4 h-4 -z-1 origin-center"
      :style="{
        top: argumentTop,
        left: argumentLeft,
        transform: `rotate(${argumentAngle}deg)`,
      }"
      viewBox="0 0 16 16"
      stroke="#000"
      fill="#000"
      strokeWidth="1"
    >
      <path d="M0,0 7,0 7,3 1,3 8,15 15,3 9,3 9,0 16,0 16,16 0,16" />
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
