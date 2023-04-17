import { useUiStore } from '@FEATURES/blueprint/stores'
import type { BlueprintBounding, BlueprintNodeProvideData } from '@FEATURES/blueprint/types'

interface ZoomSetterArguments {
  bp: Ref<HTMLElement | null>
  parentBpNodeData: BlueprintNodeProvideData
}

const ui = useUiStore()

export default function setElemBoundingHandling({ bp, parentBpNodeData }: ZoomSetterArguments) {
  const bpBounding = useElementBounding(bp) as BlueprintBounding
  const updateBpSubtreeBoundings = () => {
    ui.updateBpSubtree(parentBpNodeData.id!)
  }
  return {
    bpBounding,
    updateBpSubtreeBoundings,
  }
}
