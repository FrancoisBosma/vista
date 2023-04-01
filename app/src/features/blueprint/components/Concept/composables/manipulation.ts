import { genericTapCoords } from '@GLOBAL/functions/coordinates'
import type { Coordinates } from '@FEATURES/blueprint/types'

interface ManipulationArguments {
  isEmpty: ReturnType<typeof eagerComputed<boolean>>
}

export default function setManipulationHandling({ isEmpty }: ManipulationArguments) {
  const click = reactive({
    tapCoords: { x: 0, y: 0 } as Coordinates,
    isDragging: false,
  })
  const isOpen = ref(false)
  const isHovered = ref(false)
  const toggleTile = () => {
    isOpen.value = !isOpen.value
    isHovered.value = false
  }
  const isClickable = computed(() => !(isOpen.value || click.isDragging || isEmpty.value))
  const handleClick = async () => {
    if (!isClickable.value) return
    toggleTile()
  }
  const handleTapDown = (e: MouseEvent | TouchEvent) => {
    const { x, y } = genericTapCoords(e)
    click.tapCoords.x = x
    click.tapCoords.y = y
    click.isDragging = false
  }
  const handleTapUp = (e: MouseEvent | TouchEvent) => {
    const { x, y } = genericTapCoords(e)
    if (click.tapCoords.x !== x || click.tapCoords.y !== y) click.isDragging = true
    click.tapCoords.x = 0
    click.tapCoords.y = 0
  }

  return {
    click,
    isOpen,
    isHovered,
    isClickable,
    handleClick,
    handleTapDown,
    handleTapUp,
  }
}
