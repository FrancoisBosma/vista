import { acceptHMRUpdate, defineStore } from 'pinia'
import setBlueprintStyleHandling from './composables/style'
import useBlueprintNodeTree from './composables/blueprintNodeTree'
import useConcept from './composables/concept'

export const useUiStore = defineStore('UI', () => {
  const { dimensions, axes, mouseCoords, gridConfig, zoomTypes, zoomRate, lastDragDistance, isDragging } =
    setBlueprintStyleHandling()
  const { getBlueprintTreeRoot, getBlueprintTreeNode, registerNewBlueprintNode } = useBlueprintNodeTree()
  const { getContentDisplayDimensions, getContentEdgePositions, getSubConceptStyle } = useConcept()

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
    getContentDisplayDimensions,
    getContentEdgePositions,
    getSubConceptStyle,
    registerNewBlueprintNode,
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot))
