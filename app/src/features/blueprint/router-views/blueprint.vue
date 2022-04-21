<route lang="yaml">
meta:
  public: true # cf. auth/navigationGuards.ts
  layout: FullScreenLayout
</route>

<script setup lang="ts">
  import { Concept, Grid } from '../components'
  import { useConceptStore, useUiStore } from '@FEATURES/blueprint/stores'
  import { absoluteValue, floorRoundUp, range, toTheNth } from '@GLOBAL/functions/numbers'
  import { objectMap } from '@GLOBAL/functions/objects'
  import type { Ref } from 'vue'
  import type { Dictionary } from '@ROOT/src/types'
  import type { Axis, Dimension, ZoomDirectionFactor } from '@FEATURES/blueprint/stores'

  type Offsets = Record<Dimension, number>
  type Coordinates = Record<Axis, number>
  interface GridExposed {
    updateAppearance: Function
    squareLength: number
  }

  const concepts = useConceptStore()
  const ui = useUiStore()

  const concept = concepts.helloWorld

  const bp = ref(null)
  const gridRefs = ref<Object[]>([])
  const { pressed: isUserPressingDown } = useMousePressed({ target: bp })
  const bpInfo = useElementBounding(bp) as Dictionary<Ref<number>>
  const bgOffsets: Ref<Offsets> = ref({
    width: ui.gridConfig.middleSizeSquare.length / 2,
    height: ui.gridConfig.middleSizeSquare.length / 2,
  })
  const contentOffsets: Ref<Offsets> = ref({ width: 0, height: 0 })
  const contentScale = ref(1)

  watch(isUserPressingDown, () => (ui.isUserPressingDown = isUserPressingDown.value))

  const computeLengthDelta = (newScale: number, lastScale: number, length: number) =>
    (newScale / lastScale - 1) * length
  const computeZoomedContentOffsets = (zoomRelCoords: Coordinates, newScale: number, lastScale: number): Offsets => {
    const output: Dictionary<number> = {}
    const { axes } = ui
    Object.entries(axes).forEach(([dim, axis]) => {
      const contentToZoomCenterDistance =
        bpInfo[dim].value / 2 + contentOffsets.value[dim as Dimension] - zoomRelCoords[axis]
      const extraContentOffset = computeLengthDelta(newScale, lastScale, contentToZoomCenterDistance)
      output[dim] = extraContentOffset
    })
    return output as Offsets
  }
  const computeExtraOffset = (extraOffsetToBe: number, oldOffset: number, limit: number) => {
    const offsetTest = oldOffset + extraOffsetToBe
    if (offsetTest < 0) {
      const adjustmentFactor = absoluteValue(floorRoundUp(offsetTest / limit)) + (offsetTest % limit ? 1 : 0)
      return extraOffsetToBe + limit * adjustmentFactor
    }
    if (offsetTest >= limit) {
      const adjustmentFactor = floorRoundUp(offsetTest / limit)
      return extraOffsetToBe - limit * adjustmentFactor
    }
    return extraOffsetToBe
  }
  const computeZoomedGridOffsets = (
    zoomRelCoords: Coordinates,
    zoomFactor: ZoomDirectionFactor,
    biggestSquareLength: number
  ): Offsets => {
    const output: Dictionary<number> = {}
    const { axes, zoomRate } = ui
    Object.entries(axes).forEach(([dim, axis]) => {
      const svgToZoomCenterDistance = bgOffsets.value[dim as Dimension] + zoomRelCoords[axis]
      const lengthDelta = (toTheNth(zoomRate, zoomFactor) - 1) * svgToZoomCenterDistance
      const extraOffset = computeExtraOffset(lengthDelta, bgOffsets.value[dim as Dimension], biggestSquareLength)
      output[dim] = extraOffset
    })
    return output as Offsets
  }
  const applyForEveryGrid = (fn: Function) => {
    const outputs: ReturnType<any>[] = []
    range(ui.gridConfig.gridAmount).forEach((i) => {
      outputs.push(fn(gridRefs.value[i]))
    })
    return outputs
  }
  const getCurrentBiggestSquareLength = () => {
    const squareLengths = applyForEveryGrid((grid: GridExposed) => grid.squareLength)
    return Math.max(...squareLengths)
  }
  const updateContentScale = (zoomFactor: ZoomDirectionFactor) => {
    const lastScaleContent = contentScale.value
    contentScale.value *= toTheNth(ui.zoomRate, zoomFactor)
    return { lastScaleContent, newScaleContent: contentScale.value }
  }
  const updateContentOffsets = (extraOffsets: Offsets) =>
    (Object.keys(extraOffsets) as Dimension[]).forEach((dim) => {
      contentOffsets.value[dim] += extraOffsets[dim]
    })
  const updateBackgroundOffsets = (extraOffsets: Offsets) =>
    (Object.keys(extraOffsets) as Dimension[]).forEach((dim) => {
      bgOffsets.value[dim] += extraOffsets[dim]
    })
  const updateGridsAppearance = (zoomFactor: ZoomDirectionFactor) => {
    applyForEveryGrid((grid: GridExposed) => grid.updateAppearance(zoomFactor))
    return getCurrentBiggestSquareLength()
  }
  const updateBackground = (zoomRelativeCoords: Coordinates, zoomFactor: ZoomDirectionFactor) => {
    const currentBiggestSquareLength = updateGridsAppearance(zoomFactor)
    const extraOffsets = computeZoomedGridOffsets(zoomRelativeCoords, zoomFactor, currentBiggestSquareLength)
    updateBackgroundOffsets(extraOffsets)
  }
  const handleZoom = (event: WheelEvent) => {
    const zoomFactor: ZoomDirectionFactor =
      event.deltaY > 0 ? ui.zoomTypes.out.directionFactor : ui.zoomTypes.in.directionFactor
    const zoomRelativeCoords: Coordinates = objectMap(ui.axes, (axis: Axis) => event[axis] - bpInfo[axis].value, true)
    // Calling update methods ...
    const { lastScaleContent, newScaleContent } = updateContentScale(zoomFactor)
    const extraContentOffsets = computeZoomedContentOffsets(zoomRelativeCoords, newScaleContent, lastScaleContent)
    updateContentOffsets(extraContentOffsets)
    updateBackground(zoomRelativeCoords, zoomFactor)
  }
</script>

<template>
  <div ref="bp" class="blueprint" @wheel.stop.prevent="handleZoom">
    <div class="bp-background">
      <Grid v-for="n in ui.gridConfig.gridAmount" :key="n" :ref="(el: any) => gridRefs.push(el)" :grid-id="n - 1" />
    </div>
    <Concept class="bp-content" :concept="concept" />
  </div>
</template>

<style scoped lang="postcss">
  .blueprint {
    @apply relative w-full h-full overflow-hidden;
    .bp-background {
      @apply absolute w-full h-full children:(absolute);
      cursor: v-bind('`${isUserPressingDown ? "grabbing ": "grab"}`');
      left: v-bind('`-${bgOffsets.width}px`');
      width: v-bind('`calc(100% + ${bgOffsets.width}px)`');
      top: v-bind('`-${bgOffsets.height}px`');
      height: v-bind('`calc(100% + ${bgOffsets.height}px)`');
    }
    .bp-content {
      @apply relative top-1/2 left-1/2;
      transform: v-bind(
        '`translate(calc(-50% + ${contentOffsets.width}px), calc(-50% + ${contentOffsets.height}px)) \
      scale(${contentScale})`'
      );
      z-index: v-bind('2 * ui.gridConfig.zoom.levelReset + 1');
    }
  }
</style>
