<script setup lang="ts">
  import Blueprint from './Blueprint'
  import { useUiStore } from '@FEATURES/blueprint/stores'
  import { bpNodeProvideKey } from '@FEATURES/blueprint/components/BlueprintNode/Blueprint/constants/symbols'
  import { BlueprintBackgroundColor } from '@FEATURES/blueprint/types'
  import type { BlueprintElement, BpNodeId } from '@FEATURES/blueprint/types'
  import type { Pair } from '@SRC/types'

  const props = defineProps<{ contentDimensions: Pair<number> }>()
  const { contentDimensions } = toRefs(props)
  const ui = useUiStore()
  const bp = shallowRef<BlueprintElement | null>(null)

  const parentBpNodeData = inject(bpNodeProvideKey, { depth: -1, id: undefined })
  const depth = parentBpNodeData.depth + 1
  const uuid = generateUuid()
  provide(bpNodeProvideKey, { depth, id: uuid })

  const bgColor = depth % 2 === 0 ? BlueprintBackgroundColor.normal : BlueprintBackgroundColor.stronger
  const initialContentScale = ref(1)

  const getCumulativeContentScale = (bpNodeId: BpNodeId): number => {
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

  watchOnce(bp, async () => {
    if (!bp.value) return
    const parentBpNodeId = parentBpNodeData.id
    ui.registerNewBlueprintNode(uuid, bp.value, parentBpNodeId)
    if (!contentDimensions.value) return
    if (!parentBpNodeId) return
    const cumulativePreviousScale = getCumulativeContentScale(parentBpNodeId)
    const containerW = bp.value.bpBounding.width.value / cumulativePreviousScale
    const containerH = bp.value.bpBounding.height.value / cumulativePreviousScale
    const extractedContentDimensions = contentDimensions.value.split(':').map((s) => Number(s))
    const widthNecessaryScale = containerW / extractedContentDimensions[0]
    const heightNecessaryScale = containerH / extractedContentDimensions[1]
    initialContentScale.value = Math.min(widthNecessaryScale, heightNecessaryScale)
  })
</script>

<template>
  <Blueprint ref="bp" :bg-color="bgColor" :initial-content-scale="initialContentScale">
    <slot />
  </Blueprint>
</template>
