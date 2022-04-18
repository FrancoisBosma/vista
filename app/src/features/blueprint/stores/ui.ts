import { acceptHMRUpdate, defineStore } from 'pinia'
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

  return {
    dimensions,
    mouseCoords,
    isUserPressingDown,
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot))
