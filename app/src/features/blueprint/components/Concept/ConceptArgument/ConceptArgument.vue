<script setup lang="ts">
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
  import type { Pair } from '@ROOT/src/types'
  import type { Concept, SubConceptConnection } from '@API/gql-generated/graphql'

  interface Props {
    connection: SubConceptConnection
    conceptName: Concept['name']
    conceptWH: Pair<number>
    tileRoundness: string
  }

  const props = defineProps<Props>()

  const positionAngle /* 'a' on the ascii diagram */ = formatPositionAngle(
    props.connection.fedSubConceptArgumentPositionAngle
  )
  const [svgW, svgH] = [16, 16]
  const argumentX = ref('')
  const argumentY = ref('')
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
  const flexDirection = ref('')
  const labelOffset = reactive({ x: undefined, y: undefined } as { x?: number; y?: number })
  const label = computed(() =>
    props.connection.fedSubConceptArgumentType.name.substring(`${props.conceptName}.`.length)
  )

  watch(
    [() => props.conceptWH, () => positionAngle],
    ([wh, positionAngle]) => {
      const [w, h] = getNumbersFromPair(wh)
      let isOffsetOnXDimension = true
      let isInMirrorZone = false
      // angle + positioning calibration
      if (
        (positionAngle >= argumentAllowedAngles.value[0][0] && positionAngle <= argumentAllowedAngles.value[0][1]) ||
        (positionAngle >= argumentAllowedAngles.value[4][0] && positionAngle <= argumentAllowedAngles.value[4][1])
      ) {
        // zone 1 or 5
        argumentAngle.value = 0
        flexDirection.value = 'flex-col-reverse'
        labelOffset.y = -svgH / 2
      } else if (
        positionAngle >= argumentAllowedAngles.value[1][0] &&
        positionAngle <= argumentAllowedAngles.value[1][1]
      ) {
        // zone 2
        argumentAngle.value = 90
        isOffsetOnXDimension = false
        flexDirection.value = 'flex-row'
        labelOffset.x = svgW
      } else if (
        positionAngle >= argumentAllowedAngles.value[2][0] &&
        positionAngle <= argumentAllowedAngles.value[2][1]
      ) {
        // zone 3
        argumentAngle.value = 180
        isInMirrorZone = true
        flexDirection.value = 'flex-col'
        labelOffset.y = svgH
      } else if (
        positionAngle >= argumentAllowedAngles.value[3][0] &&
        positionAngle <= argumentAllowedAngles.value[3][1]
      ) {
        // zone 4
        argumentAngle.value = 270
        isOffsetOnXDimension = false
        isInMirrorZone = true
        flexDirection.value = 'flex-row-reverse'
        labelOffset.x = -svgW
      } else throw new Error("[Concept.vue] concept argument's angle is not allowed")

      const tileCenterOffsetSideCoord = (isOffsetOnXDimension ? w : h) / 2
      const tileCenterCounterSideCoord = (isOffsetOnXDimension ? h : w) / 2
      const svgCenterOffsetSideCoord = (isOffsetOnXDimension ? svgW : svgH) / 2

      const offset /* 'o' on the ascii diagram */ =
        tileCenterOffsetSideCoord -
        svgCenterOffsetSideCoord +
        Math.tan(toRadians(positionAngle - argumentAngle.value)) *
          tileCenterCounterSideCoord *
          (isInMirrorZone ? -1 : 1)
      const counterSideOffset = isOffsetOnXDimension ? (isInMirrorZone ? h : -svgH) : isInMirrorZone ? -svgW : w

      argumentX.value = `${isOffsetOnXDimension ? offset : counterSideOffset}px`
      argumentY.value = `${isOffsetOnXDimension ? counterSideOffset : offset}px`
    },
    { immediate: true }
  )

  function formatPositionAngle(alpha: number /* degrees */) {
    return ((alpha % 360) + 360) % 360 // alpha returned within [0, 360]
  }

  defineExpose({ argumentX, argumentY })
</script>

<template>
  <div
    class="absolute flex items-center justify-center"
    :class="[flexDirection]"
    :style="{
      top: argumentY,
      left: argumentX,
    }"
  >
    <svg
      class="-z-1 w-4 h-4 origin-center"
      :style="{
        transform: `rotate(${argumentAngle}deg)`,
      }"
      viewBox="0 0 16 16"
      stroke="#000"
      fill="#000"
      strokeWidth="1"
    >
      <path d="M0,0 7,0 7,2 1,2 8,15 15,2 9,2 9,0 16,0 16,16 0,16" />
    </svg>
    <p
      class="-z-2 absolute text-[10px]"
      :style="{
        left: `${labelOffset.x}px`,
        top: `${labelOffset.y}px`,
      }"
    >
      {{ label }}
    </p>
  </div>
</template>
