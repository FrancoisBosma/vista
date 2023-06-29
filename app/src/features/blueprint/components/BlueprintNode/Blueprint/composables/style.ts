import { useUiStore } from '@FEATURES/blueprint/stores'
import type { Ref } from 'vue'
import type { setCommonHandling, setZoomHandling } from '.'

const ui = useUiStore()

type StyleArguments = {
  bp: Ref
  contentScale: ReturnType<typeof setZoomHandling>['contentScale']
} & ReturnType<typeof setCommonHandling>

export default function setStyleHandling({ bp, bgOffsets, contentOffsets, contentScale }: StyleArguments) {
  const { pressed: isUserPressingDown } = useMousePressed({ target: bp })
  const bpCursor = eagerComputed(() => `${isUserPressingDown.value ? 'grabbing ' : 'grab'}`)
  const bgDimensions = computed(() => ({
    left: `-${bgOffsets.width}px`,
    width: `calc(100% + ${bgOffsets.width}px)`,
    top: `-${bgOffsets.height}px`,
    height: `calc(100% + ${bgOffsets.height}px)`,
  }))
  const contentTransform = computed(
    () => `translate(${contentOffsets.width}px, ${contentOffsets.height}px) scale(${contentScale.value})`
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
