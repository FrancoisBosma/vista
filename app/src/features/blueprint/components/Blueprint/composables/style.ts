import type { Ref } from 'vue'
import type { setCommonHandling, setZoomHandling } from './'
import type { useUiStore } from '@FEATURES/blueprint/stores'

type StyleArguments = {
  bp: Ref
  contentScale: ReturnType<typeof setZoomHandling>['contentScale']
  ui: ReturnType<typeof useUiStore>
} & ReturnType<typeof setCommonHandling>

export default function setDragHandling({ bp, bgOffsets, contentOffsets, contentScale, ui }: StyleArguments) {
  const { pressed: isUserPressingDown } = useMousePressed({ target: bp })
  const bpCursor = computed(() => `${isUserPressingDown.value ? 'grabbing ' : 'grab'}`)
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
  const contentZIndex = computed(() => 2 * ui.gridConfig.zoom.levelReset + 1)

  return reactive({
    bpCursor,
    bgDimensions,
    contentTransform,
    contentZIndex,
    isUserPressingDown,
  })
}
