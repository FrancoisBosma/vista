import { acceptHMRUpdate, defineStore } from 'pinia'
import { nthRoot } from '@GLOBAL/functions/numbers'
import { objectMap } from '@GLOBAL/functions/objects'
import type { Ref } from 'vue'
import type {
  Axes,
  Axis,
  DimensionProperties,
  Dimensions,
  ZoomDirectionFactor,
  ZoomTypes,
} from '@FEATURES/blueprint/types/'

export const useUiStore = defineStore('ui', () => {
  const dimensions: Dimensions = reactive({
    width: { axis: <Axis>'x', boundingClientRectProperty: 'width', boxSizeProperty: 'inlineSize' },
    height: { axis: <Axis>'y', boundingClientRectProperty: 'height', boxSizeProperty: 'blockSize' },
  })
  const axes: Ref<Axes> = ref(objectMap(dimensions, (value: DimensionProperties) => value.axis))
  const mouseCoords: Record<string, Ref> = useMouse()
  const gridConfig = reactive({
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
  const zoomTypes: ZoomTypes = reactive({
    out: { directionFactor: <ZoomDirectionFactor>-1 },
    in: { directionFactor: <ZoomDirectionFactor>1 },
  })
  const zoomRate = ref(nthRoot(gridConfig.subSquareAmount, gridConfig.zoom.levelReset))
  const isDragging = ref(false)
  return {
    axes,
    dimensions,
    mouseCoords,
    gridConfig,
    zoomRate,
    zoomTypes,
    isDragging,
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot))
