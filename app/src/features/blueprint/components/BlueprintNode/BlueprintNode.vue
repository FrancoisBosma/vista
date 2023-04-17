<script setup lang="ts">
  import Blueprint from './Blueprint'
  import { useUiStore } from '@FEATURES/blueprint/stores'
  import { bpNodeProvideKey } from '@FEATURES/blueprint/components/BlueprintNode/Blueprint/constants/symbols'
  import { BlueprintBackgroundColor } from '@FEATURES/blueprint/types'
  import type { BlueprintElement } from '@FEATURES/blueprint/types'

  const ui = useUiStore()

  const parentBpNodeData = inject(bpNodeProvideKey, { depth: -1, id: undefined })
  const uuid = generateUuid()

  const bp = ref<BlueprintElement | null>(null)

  const depth = parentBpNodeData.depth + 1
  const bgColor = depth % 2 === 0 ? BlueprintBackgroundColor.normal : BlueprintBackgroundColor.stronger

  watchOnce(bp, () => {
    const parentBpNodeId = parentBpNodeData.id
    ui.registerNewBlueprintNode(uuid, bp.value as unknown as BlueprintElement, parentBpNodeId)
  })

  provide(bpNodeProvideKey, { depth, id: uuid })
</script>

<template>
  <Blueprint ref="bp" :bg-color="bgColor">
    <slot />
  </Blueprint>
</template>
