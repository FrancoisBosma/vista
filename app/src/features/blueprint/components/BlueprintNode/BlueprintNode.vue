<script setup lang="ts">
  import Blueprint from './Blueprint'
  import { useUiStore } from '@FEATURES/blueprint/stores'
  import { bpNodeProvideKey } from '@FEATURES/blueprint/components/BlueprintNode/Blueprint/constants/symbols'
  import { BlueprintBackgroundColor } from '@FEATURES/blueprint/types'
  import type { BlueprintElement } from '@FEATURES/blueprint/types'
  import type { Pair } from '@SRC/types'
  import type { ShallowRef } from 'vue'

  const { contentDimensions } = defineProps<{ contentDimensions?: Pair<number> }>()
  const ui = useUiStore()
  const bp = shallowRef<BlueprintElement | null>(null)

  const parentBpNodeData = inject(bpNodeProvideKey, { depth: -1, id: undefined })
  const depth = parentBpNodeData.depth + 1
  const uuid = generateUuid()
  provide(bpNodeProvideKey, { depth, id: uuid })

  const bgColor = depth % 2 === 0 ? BlueprintBackgroundColor.normal : BlueprintBackgroundColor.stronger
  const initialContentScale = ref(1)

  watchOnce(bp, async () => {
    if (!bp.value) return
    const parentBpNodeId = parentBpNodeData.id
    ui.registerNewBlueprintNode(uuid, bp.value, parentBpNodeId)
    if (contentDimensions && parentBpNodeId) {
      initialContentScale.value = ui.getBpInitialContentScale(
        bp as ShallowRef<BlueprintElement>,
        contentDimensions,
        parentBpNodeId
      )
    }
  })
</script>

<template>
  <Blueprint ref="bp" :bg-color="bgColor" :initial-content-scale="initialContentScale">
    <slot />
  </Blueprint>
</template>
