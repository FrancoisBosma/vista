import { acceptHMRUpdate, defineStore } from 'pinia'
import setStyleHandling from './composables/style'
import useBlueprintNodeMap from './composables/blueprintNodeMap'

export const useUiStore = defineStore('UI', () => {
  const { dimensions, axes, mouseCoords, gridConfig, zoomTypes, zoomRate, lastDragDistance, isDragging } =
    setStyleHandling()
  const { getBlueprintTreeRoot, getBlueprintTreeNode, registerNewBlueprintNode, updateBpSubtree } =
    useBlueprintNodeMap()

  return {
    axes,
    dimensions,
    mouseCoords,
    gridConfig,
    zoomRate,
    zoomTypes,
    lastDragDistance,
    isDragging,
    getBlueprintTreeRoot,
    getBlueprintTreeNode,
    registerNewBlueprintNode,
    updateBpSubtree,
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot))
