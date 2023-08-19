<script setup lang="ts">
  import Blueprint from './Blueprint'
  import { useUiStore } from '@FEATURES/blueprint/stores'
  import { bpNodeProvideKey } from '@FEATURES/blueprint/components/BlueprintNode/Blueprint/constants/symbols'
  import type { ContentIdentification, OffsetSide } from '@FEATURES/blueprint/types'

  const { contentIdentification } = defineProps<{ contentIdentification?: ContentIdentification }>()
  const ui = useUiStore()

  const bp = shallowRef<InstanceType<typeof Blueprint> & HTMLElement>()

  const parentBpNodeData = inject(bpNodeProvideKey, { depth: -1 })
  const depth = parentBpNodeData.depth + 1
  const uuid = generateUuid()
  provide(bpNodeProvideKey, { depth, id: uuid })

  const bgExtraOffsets = computed(() => ui.getBlueprintTreeRoot()?.bpRef.contentOffsets ?? { width: 0, height: 0 })
  const bgExtraPosition = computed(
    () =>
      ({
        left: `calc(50% + ${bgExtraOffsets.value.width}px)`,
        top: `calc(50% + ${bgExtraOffsets.value.height}px)`,
      } as Record<OffsetSide, string>)
  )

  watchOnce(bp, async () => {
    if (!bp.value) return
    const parentBpNodeId = parentBpNodeData.id
    ui.registerNewBlueprintNode(uuid, bp.value, parentBpNodeId)
  })
</script>

<template>
  <Blueprint ref="bp" :content-identification="contentIdentification">
    <template v-if="depth === 0" #background-extra>
      <div :id="`bp-${uuid}`" class="background-extra" />
    </template>
    <slot />
  </Blueprint>
</template>

<style scoped lang="postcss">
  .background-extra {
    @apply w-full h-full absolute children:(absolute);
    left: v-bind('bgExtraPosition.left');
    top: v-bind('bgExtraPosition.top');
  }
</style>
