import { useUiStore } from '@FEATURES/blueprint/stores'
import type { BpNodeWrapper } from '@FEATURES/blueprint/types'
import type { Position } from '@FEATURES/blueprint/components/Concept/types/Concept'

const ui = useUiStore()

interface RecursivityArguments {
  subConceptStyle?: ReturnType<ReturnType<typeof useUiStore>['getSubConceptStyle']>
  bpNodeId?: BpNodeWrapper['id']
  parentsCumulativeSubConceptScale: number
  parentsCumulativeSubConceptPosition: Position
}

export default function setConceptRecursivity({
  subConceptStyle,
  bpNodeId,
  parentsCumulativeSubConceptScale,
  parentsCumulativeSubConceptPosition,
}: RecursivityArguments) {
  const currentConceptScale = computed(() =>
    bpNodeId ? ui.getBlueprintTreeNode(bpNodeId)?.bpRef.getContentScale() ?? 1 : 1
  )
  const currentCumulativeSubConceptScale = computed(() => parentsCumulativeSubConceptScale * currentConceptScale.value)
  const isAtRootLevel = computed(
    () => bpNodeId && ui.getBlueprintTreeNode(bpNodeId)?.id === ui.getBlueprintTreeRoot()?.id
  )
  const rootContentScale = computed(() => ui.getBlueprintTreeRoot()?.bpRef.getContentScale() ?? 1)
  const cumulativeConceptScale = computed(() => {
    if (isAtRootLevel.value) return currentCumulativeSubConceptScale.value
    return currentCumulativeSubConceptScale.value * rootContentScale.value
  })
  const currentSubConceptPosition = {
    left: Number(subConceptStyle?.left.split('px')[0]) || 0,
    top: Number(subConceptStyle?.top.split('px')[0]) || 0,
  } as Position
  const cumulativeSubConceptPosition = computed(
    () =>
      objectMap(
        currentSubConceptPosition,
        (v: number, k: keyof Position) =>
          parentsCumulativeSubConceptPosition[k] + v * currentCumulativeSubConceptScale.value
      ) as Position
  )

  return {
    rootContentScale,
    currentCumulativeSubConceptScale,
    cumulativeSubConceptPosition,
    cumulativeConceptScale,
  }
}
