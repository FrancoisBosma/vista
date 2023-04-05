import { bpUpdateKey } from '@FEATURES/blueprint/components/Blueprint/constants/symbols'
import type { BlueprintBounding, BlueprintDepth } from '@FEATURES/blueprint/types'

interface ZoomSetterArguments {
  bp: Ref<HTMLElement | null>
  depth: Ref<BlueprintDepth>
}

export default function setElemBoundingHandling({ bp, depth }: ZoomSetterArguments) {
  const bpBounding = useElementBounding(bp) as BlueprintBounding
  const updateBus = useEventBus(bpUpdateKey)
  const updateBpBounding = () => {
    bpBounding.update()
    updateBus.emit(depth.value)
  }
  updateBus.on((updateDepth) => {
    if (depth.value <= updateDepth) return
    bpBounding.update()
  })
  return {
    bpBounding,
    updateBus,
    updateBpBounding,
  }
}
