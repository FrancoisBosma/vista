import { useUiStore } from '@FEATURES/blueprint/stores'
import type {
  Axes,
  Axis,
  BlueprintElement,
  BpNodeId,
  DimensionProperties,
  Dimensions,
  ZoomDirectionFactor,
  ZoomTypes,
} from '@FEATURES/blueprint/types/'
import type { Pair } from '@SRC/types'
import type { ShallowRef } from 'vue'

export default function setStyleHandling() {
  const ui = useUiStore()
  const dimensions: Dimensions = {
    width: { axis: <Axis>'x', boundingClientRectProperty: 'width', boxSizeProperty: 'inlineSize', offsetSide: 'left' },
    height: { axis: <Axis>'y', boundingClientRectProperty: 'height', boxSizeProperty: 'blockSize', offsetSide: 'top' },
  }
  const axes: Axes = objectMap(dimensions, (value: DimensionProperties) => value.axis)
  const mouseCoords = useMouse()
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

  const _getCumulativeContentScale = (bpNodeId: BpNodeId): number => {
    const contentScales = [1]
    let _nodeId: BpNodeId | undefined = bpNodeId
    do {
      const bpNode = ui.getBlueprintTreeNode(_nodeId!)
      if (!bpNode) break
      contentScales.push(resolveUnref(bpNode.bpRef.contentScale))
      _nodeId = bpNode.parentId
    } while (_nodeId)
    return contentScales.reduce((acc, val) => acc * val)
  }
  const getBpInitialContentScale = (
    bp: ShallowRef<BlueprintElement>,
    contentDimensions: Ref<Pair<number>>,
    parentBpNodeId: BpNodeId
  ) => {
    const cumulativePreviousScale = _getCumulativeContentScale(parentBpNodeId)
    const containerW = bp.value.bpBounding.width.value / cumulativePreviousScale
    const containerH = bp.value.bpBounding.height.value / cumulativePreviousScale
    const extractedContentDimensions = getNumbersFromPair(contentDimensions.value)
    const widthNecessaryScale = containerW / extractedContentDimensions[0]
    const heightNecessaryScale = containerH / extractedContentDimensions[1]
    return Math.min(widthNecessaryScale, heightNecessaryScale)
  }

  return {
    dimensions,
    axes,
    mouseCoords,
    gridConfig,
    zoomTypes,
    zoomRate,
    lastDragDistance,
    isDragging,
    getBpInitialContentScale,
  }
}
