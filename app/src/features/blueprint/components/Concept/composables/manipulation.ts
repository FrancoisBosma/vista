import { useUiStore } from '@FEATURES/blueprint/stores'

const ui = useUiStore()

interface ManipulationArguments {
  isEmpty: ReturnType<typeof eagerComputed<boolean>>
  closeConceptEl: Ref<HTMLElement | null>
}

export default function setManipulationHandling({ isEmpty, closeConceptEl }: ManipulationArguments) {
  const isOpen = ref(false)
  const isHovered = useElementHover(closeConceptEl)
  const toggleTile = () => {
    isOpen.value = !isOpen.value
    isHovered.value = false
  }

  const longPressed = ref(false)
  onLongPress(closeConceptEl, () => (longPressed.value = true), { modifiers: { stop: true } })
  const { pressed } = useMousePressed({ drag: false, target: closeConceptEl })
  const isClickable = computed(() => !(isOpen.value || ui.isDragging || isEmpty.value))
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
  const firstClick = useTimeoutFn(() => handleOneTap(), 500, { immediate: false })
  const handleClick = () => {
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
    isOpen,
    isHovered,
    isClickable,
    handleClick,
  }
}
