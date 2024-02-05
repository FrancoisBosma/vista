import { useBlueprintStore } from '@FEATURES/BlueprintV2/stores'
import type { Concept } from '@FEATURES/BlueprintV2/types'

const ui = useBlueprintStore()

interface ManipulationArguments {
  concept: Ref<Concept>
  conceptEl: ShallowRef<HTMLElement | null>
}

export default function setManipulationHandling({ concept, conceptEl }: ManipulationArguments) {
  const isEmpty = eagerComputed(() => !concept.value.composition?.subConcepts.length)
  const isOpen = ref(false)
  const isHovered = useElementHover(conceptEl)
  const longPressed = ref(false)
  const { pressed } = useMousePressed({ drag: true, target: conceptEl })
  const isClickable = computed(() => !(isOpen.value || ui.isDragging || isEmpty.value))
  const firstClick = useTimeoutFn(() => handleOneTap(), 500, { immediate: false })
  //
  // >> Methods
  //
  const toggleTile = () => {
    isOpen.value = !isOpen.value
    isHovered.value = false
  }
  const handleOneTap = () => {
    // TODO single-click
    console.log('SINGLE')
  }
  const handleDoubleTap = () => {
    toggleTile()
    // TODO fit-screen
    console.log('DOUBLE')
  }
  const handleLongPress = () => {
    toggleTile()
    console.log('LONG')
  }
  const handleClick = () => {
    const justFinishedDragging = ui.lastDragDistance
    if (justFinishedDragging) return firstClick.stop()
    if (!isClickable.value) return
    if (longPressed.value) {
      longPressed.value = false
      return firstClick.stop()
    }
    if (firstClick.isPending.value) {
      firstClick.stop()
      return handleDoubleTap()
    }
    firstClick.start()
  }
  //
  // >> Events
  //
  onLongPress(conceptEl, () => (longPressed.value = true))
  watch(pressed, (isPressed) => {
    if (!isClickable.value) return
    if (!isPressed) return
    console.log('>pressed<')
    // TODO: 1-c animation
  })
  watch(longPressed, (isLongPressed) => {
    if (!isClickable.value) return
    if (!isLongPressed) return
    handleLongPress()
    // TODO: start animation
  })

  return {
    isEmpty,
    isOpen,
    isHovered,
    isClickable,
    handleClick,
  }
}
