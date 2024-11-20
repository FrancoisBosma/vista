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
  import type { Coordinates } from '@FEATURES/blueprint/types'
  import type { Concept, SubConceptConnection } from '@API/gql-generated/graphql'

  interface Props {
    connection: SubConceptConnection
    conceptName: Concept['name']
    conceptWH: Pair<number>
    tileRoundness: string
  }
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  type Emits = {
    'update:argumentPosition': [position: Coordinates]
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const positionAngle /* 'a' on the ascii diagram */ = formatPositionAngle(
    props.connection.fedSubConceptArgumentPositionAngle
  )
  const [svgW, svgH] = [16, 16]
  const argumentX = ref(0)
  const argumentY = ref(0)
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

  function formatPositionAngle(alpha: number /* degrees */) {
    return ((alpha % 360) + 360) % 360 // alpha returned within [0, 360]
  }

  watchEffect(() => {
    const [w, h] = getNumbersFromPair(props.conceptWH)
    let isOffsetOnXDimension = true
    let isInMirrorZone = false
    // offsets so to target the "entrance" of the argument, relative to the top-left corer
    let argumentEntranceOffsetX: number
    let argumentEntranceOffsetY: number
    // angle + positioning calibration
    if (
      (positionAngle >= argumentAllowedAngles.value[0][0] && positionAngle <= argumentAllowedAngles.value[0][1]) ||
      (positionAngle >= argumentAllowedAngles.value[4][0] && positionAngle <= argumentAllowedAngles.value[4][1])
    ) {
      // zone 1 or 5
      argumentAngle.value = 0
      isOffsetOnXDimension = true
      isInMirrorZone = false
      flexDirection.value = 'flex-col-reverse'
      labelOffset.y = -svgH / 2
      argumentEntranceOffsetX = svgW / 2
      argumentEntranceOffsetY = 0
    } else if (
      positionAngle >= argumentAllowedAngles.value[1][0] &&
      positionAngle <= argumentAllowedAngles.value[1][1]
    ) {
      // zone 2
      argumentAngle.value = 90
      isOffsetOnXDimension = false
      isInMirrorZone = false
      flexDirection.value = 'flex-row'
      labelOffset.x = svgW
      argumentEntranceOffsetX = svgW
      argumentEntranceOffsetY = svgH / 2
    } else if (
      positionAngle >= argumentAllowedAngles.value[2][0] &&
      positionAngle <= argumentAllowedAngles.value[2][1]
    ) {
      // zone 3
      argumentAngle.value = 180
      isOffsetOnXDimension = true
      isInMirrorZone = true
      flexDirection.value = 'flex-col'
      labelOffset.y = svgH
      argumentEntranceOffsetX = svgW / 2
      argumentEntranceOffsetY = svgH
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
      argumentEntranceOffsetX = 0
      argumentEntranceOffsetY = svgH / 2
    } else throw new Error("[Concept.vue] concept argument's angle is not allowed")

    const tileCenterOffsetSideCoord = (isOffsetOnXDimension ? w : h) / 2
    const tileCenterCounterSideCoord = (isOffsetOnXDimension ? h : w) / 2
    const svgCenterOffsetSideCoord = (isOffsetOnXDimension ? svgW : svgH) / 2

    const offset /* 'o' on the ascii diagram */ =
      tileCenterOffsetSideCoord -
      svgCenterOffsetSideCoord +
      Math.tan(toRadians(positionAngle - argumentAngle.value)) * tileCenterCounterSideCoord * (isInMirrorZone ? -1 : 1)
    const counterSideOffset = isOffsetOnXDimension ? (isInMirrorZone ? h : -svgH) : isInMirrorZone ? -svgW : w

    argumentX.value = isOffsetOnXDimension ? offset : counterSideOffset
    argumentY.value = isOffsetOnXDimension ? counterSideOffset : offset
    emit('update:argumentPosition', {
      x: argumentX.value + argumentEntranceOffsetX,
      y: argumentY.value + argumentEntranceOffsetY,
    })
  })
</script>

<template>
  <div
    class="absolute flex items-center justify-center"
    :class="[flexDirection]"
    :style="{
      top: `${argumentY}px`,
      left: `${argumentX}px`,
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
