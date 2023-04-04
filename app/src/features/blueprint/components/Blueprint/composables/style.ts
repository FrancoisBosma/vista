import { BlueprintBackgroundColor } from '@FEATURES/blueprint/types'
import { useUiStore } from '@FEATURES/blueprint/stores'
import type { Ref } from 'vue'
import type { setCommonHandling, setZoomHandling } from './'
import type { BlueprintDepth } from '@FEATURES/blueprint/types'

const ui = useUiStore()

type StyleArguments = {
  bp: Ref
  contentScale: ReturnType<typeof setZoomHandling>['contentScale']
  depth: Ref<BlueprintDepth>
} & ReturnType<typeof setCommonHandling>

export default function setStyleHandling({ bp, bgOffsets, contentOffsets, contentScale, depth }: StyleArguments) {
  const bgColor = depth.value % 2 === 0 ? BlueprintBackgroundColor.normal : BlueprintBackgroundColor.stronger
  const { pressed: isUserPressingDown } = useMousePressed({ target: bp })
  const bpCursor = eagerComputed(() => `${isUserPressingDown.value ? 'grabbing ' : 'grab'}`)
  const bgDimensions = computed(() => ({
    left: `-${bgOffsets.width}px`,
    width: `calc(100% + ${bgOffsets.width}px)`,
    top: `-${bgOffsets.height}px`,
    height: `calc(100% + ${bgOffsets.height}px)`,
  }))
  const contentTransform = computed(
    () => `translate(calc(-50% + ${contentOffsets.width}px), \
    calc(-50% + ${contentOffsets.height}px)) scale(${contentScale.value})`
  )
  const contentZIndex = ref(2 * ui.gridConfig.zoom.levelReset + 1)

  return reactive({
    bgColor,
    bpCursor,
    bgDimensions,
    contentTransform,
    contentZIndex,
    isUserPressingDown,
  })
}
