import { useUiStore } from '@FEATURES/blueprint/stores'
import type { Ref } from 'vue'
import type { setCommonHandling } from '.'

const ui = useUiStore()

type StyleArguments = {
  bp: Ref
} & ReturnType<typeof setCommonHandling>

export default function setStyleHandling({ bp, bgOffsets, contentOffsets }: StyleArguments) {
  const { pressed: isUserPressingDown } = useMousePressed({ target: bp })
  const bpCursor = eagerComputed(() => `${isUserPressingDown.value ? 'grabbing ' : 'grab'}`)
  const bgDimensions = computed(() => ({
    left: `-${bgOffsets.width}px`,
    width: `calc(100% + ${bgOffsets.width}px)`,
    top: `-${bgOffsets.height}px`,
    height: `calc(100% + ${bgOffsets.height}px)`,
  }))
  const contentTransform = computed(
    () => `translate(calc(-50% + ${contentOffsets.width}px), calc(-50% + ${contentOffsets.height}px))`
  )
  const contentZIndex = 2 * ui.gridConfig.zoom.levelReset + 1

  return reactive({
    bpCursor,
    bgDimensions,
    contentTransform,
    contentZIndex,
    isUserPressingDown,
  })
}
