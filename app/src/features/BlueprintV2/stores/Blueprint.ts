import { acceptHMRUpdate, defineStore } from 'pinia'
import type {
  Axes,
  Axis,
  DimensionProperties,
  Dimensions,
  ZoomDirectionFactor,
  ZoomTypes,
} from '@FEATURES/blueprint/types/'

export const useBlueprintStore = defineStore('Blueprint', () => {
  const dimensions: Dimensions = {
    width: { axis: <Axis>'x' },
    height: { axis: <Axis>'y' },
  }
  const axes: Axes = objectMap(dimensions, (value: DimensionProperties) => value.axis)
  const gridConfig = {
    gridAmount: 2, // N.B: As of now, it only works properly w/ value '2' (zoom, colours, etc)
    middleSizeSquare: {
      strokeColor: '#444444', // N.B: always keep it expressed with 6 digits for color operations
      strokeWidth: 1,
      length: 45, // px
    },
    subSquareAmount: 3, // must be an odd nb if we want subsquares to "naturally" replace squares through zooms
    zoom: {
      levelReset: 5,
      strokeStep: 3, // decimal nb, not hexa
    },
  }
  const zoomTypes: ZoomTypes = {
    out: { directionFactor: <ZoomDirectionFactor>-1 },
    in: { directionFactor: <ZoomDirectionFactor>1 },
  }
  const zoomRate = nthRoot(gridConfig.subSquareAmount, gridConfig.zoom.levelReset)
  const lastDragDistance = ref(0)
  const isDragging = ref(false)

  return {
    dimensions,
    axes,
    gridConfig,
    zoomTypes,
    zoomRate,
    lastDragDistance,
    isDragging,
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useBlueprintStore, import.meta.hot))