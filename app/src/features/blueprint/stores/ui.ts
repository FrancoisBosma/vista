import { acceptHMRUpdate, defineStore } from 'pinia'
import { nthRoot } from '@GLOBAL/functions/numbers'
import { objectMap } from '@GLOBAL/functions/objects'
import type { Ref } from 'vue'
import type { Dictionary } from '@SRC/types'

export type Axis = 'x' | 'y'
export type Dimension = 'width' | 'height'
export type Axes = Record<Dimension, Axis>
export interface DimensionProperties {
  axis: Axis
  boundingClientRectProperty: string
  boxSizeProperty: string
}
export type Dimensions = Record<Dimension, DimensionProperties>
export type Zoom = 'out' | 'in'
export type ZoomDirectionFactor = -1 | 1
export interface ZoomProperties {
  directionFactor: ZoomDirectionFactor
}
export type ZoomTypes = Record<Zoom, ZoomProperties>

export const useUiStore = defineStore('ui', () => {
  const dimensions: Ref<Dimensions> = ref({
    width: { axis: <Axis>'x', boundingClientRectProperty: 'width', boxSizeProperty: 'inlineSize' },
    height: { axis: <Axis>'y', boundingClientRectProperty: 'height', boxSizeProperty: 'blockSize' },
  })
  const axes: Ref<Axes> = ref(objectMap(dimensions.value, (value: DimensionProperties) => value.axis))
  const mouseCoords: Dictionary<Ref> = useMouse()
  const gridConfig = ref({
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
  })
  const zoomTypes: Ref<ZoomTypes> = ref({
    out: { directionFactor: <ZoomDirectionFactor>-1 },
    in: { directionFactor: <ZoomDirectionFactor>1 },
  })
  const zoomRate = computed(() => nthRoot(gridConfig.value.subSquareAmount, gridConfig.value.zoom.levelReset))
  return {
    axes,
    dimensions,
    mouseCoords,
    gridConfig,
    zoomRate,
    zoomTypes,
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot))
