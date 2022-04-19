import { acceptHMRUpdate, defineStore } from 'pinia'
import { nthRoot } from '@GLOBAL/functions/numbers'
import type { Ref } from 'vue'
import type { Dictionary } from '@SRC/types'

type Axis = string
interface Dimension {
  axis: Axis
  boundingClientRectProperty: string
  boxSizeProperty: string
}

export const useUiStore = defineStore('ui', () => {
  // N.B: It is considered that the dimension names 'width' and 'height' are to remain forever unchanged.
  //      Some code logic is thus based on it. Beware.
  const dimensions: Ref<{ [x: string]: Dimension }> = ref({
    width: { axis: 'x', boundingClientRectProperty: 'width', boxSizeProperty: 'inlineSize' },
    height: { axis: 'y', boundingClientRectProperty: 'height', boxSizeProperty: 'blockSize' },
  })
  const mouseCoords: Dictionary<Ref> = useMouse()
  const isUserPressingDown = ref(false)
  const gridConfig = ref({
    gridAmount: 2, // N.B: As of now, it only works properly w/ value '2' (zoom, colours, etc)
    middleSizeSquare: {
      strokeWidth: 1,
      length: 45, // px
    },
    subSquareAmount: 3, // must be an odd nb if we want subsquares to "naturally" replace squares through zooms
    zoom: {
      levelReset: 5,
      strokeStep: 3, // decimal nb, not hexa
    },
  })

  const zoomRate = computed(() => nthRoot(gridConfig.value.subSquareAmount, gridConfig.value.zoom.levelReset))

  return {
    dimensions,
    mouseCoords,
    isUserPressingDown,
    gridConfig,
    zoomRate,
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot))
