<script setup lang="ts">
  import type { Pair } from '@ROOT/src/types'

  interface Props {
    positionAngle: number
    conceptWH: Pair<number>
    tileRoundness: string
  }

  const props = defineProps<Props>()

  /**
                                        o
                      zone5           <--->          zone1
        _____________________________________________________________
        |\________________________    |   /                          |
        |                         \   |a /                           |
zone4 h |                          \  |/                             | zone2
        |          mirror zone      \_____________________________   |
        |                                                          \ |
        |____________________________________________________________|
                                      w
                                    zone3
    */

  const [svgW, svgH] = [16, 16]
  const argumentLeft = ref('')
  const argumentTop = ref('')
  const argumentAngle = ref(0)
  const argumentAllowedAngles = computed(() => {
    const [w, h] = getNumbersFromPair(props.conceptWH)
    const tileRadius = Number(props.tileRoundness.split('px')[0])
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

  watch(
    [() => props.conceptWH, () => props.positionAngle],
    ([wh, positionAngle]) => {
      const [w, h] = getNumbersFromPair(wh)
      let isOffsetOnLeftAttr = true
      let isInMirrorZone = false
      // angle + positioning calibration
      if (
        (positionAngle >= argumentAllowedAngles.value[0][0] && positionAngle <= argumentAllowedAngles.value[0][1]) ||
        (positionAngle >= argumentAllowedAngles.value[4][0] && positionAngle <= argumentAllowedAngles.value[4][1])
      ) {
        // zone 1 or 5
        argumentAngle.value = 0
      } else if (
        positionAngle >= argumentAllowedAngles.value[1][0] &&
        positionAngle <= argumentAllowedAngles.value[1][1]
      ) {
        // zone 2
        argumentAngle.value = 90
        isOffsetOnLeftAttr = false
      } else if (
        positionAngle >= argumentAllowedAngles.value[2][0] &&
        positionAngle <= argumentAllowedAngles.value[2][1]
      ) {
        // zone 3
        argumentAngle.value = 180
        isInMirrorZone = true
      } else if (
        positionAngle >= argumentAllowedAngles.value[3][0] &&
        positionAngle <= argumentAllowedAngles.value[3][1]
      ) {
        // zone 4
        argumentAngle.value = 270
        isOffsetOnLeftAttr = false
        isInMirrorZone = true
      } else throw new Error("[Concept.vue] concept argument's angle is not allowed")

      const tileCenterOffsetSideCoord = (isOffsetOnLeftAttr ? w : h) / 2
      const tileCenterCounterSideCoord = (isOffsetOnLeftAttr ? h : w) / 2
      const svgCenterOffsetSideCoord = (isOffsetOnLeftAttr ? svgW : svgH) / 2

      const offset /* 'o' */ =
        tileCenterOffsetSideCoord -
        svgCenterOffsetSideCoord +
        Math.tan(toRadians(positionAngle - argumentAngle.value)) *
          tileCenterCounterSideCoord *
          (isInMirrorZone ? -1 : 1)
      const counterSideOffset = isOffsetOnLeftAttr ? (isInMirrorZone ? h : -svgH) : isInMirrorZone ? -svgW : w

      argumentLeft.value = `${isOffsetOnLeftAttr ? offset : counterSideOffset}px`
      argumentTop.value = `${isOffsetOnLeftAttr ? counterSideOffset : offset}px`
    },
    { immediate: true }
  )
</script>

<template>
  <svg
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
    <path d="M0,0 7,0 7,2 1,2 8,15 15,2 9,2 9,0 16,0 16,16 0,16" />
  </svg>
</template>
