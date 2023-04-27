import { useUiStore } from '@FEATURES/blueprint/stores'
import type { setManipulationHandling } from './'
import type { Dimension } from '@FEATURES/blueprint/types'

const ui = useUiStore()

interface StyleArguments {
  isEmpty: ReturnType<typeof eagerComputed<boolean>>
  isHovered: ReturnType<typeof setManipulationHandling>['isHovered']
  closeConceptEl: Ref<HTMLElement | null>
}

export default function setStyleHandling({ isEmpty, isHovered, closeConceptEl }: StyleArguments) {
  const boxShadow = computed(
    () => `${isHovered.value && !isEmpty.value ? '0 0 3px var(--foreground)' : '0 1px 3px rgba(0, 0, 0, 0.5)'}`
  )
  const cursor = computed(() => (ui.isDragging ? 'inherit' : isEmpty.value ? 'auto' : 'pointer'))
  const dimensions = reactive({
    width: 'fit-content',
    height: 'fit-content',
  }) as Record<Dimension, string>
  watchOnce(closeConceptEl, () => {
    const htmlElement = unrefElement(closeConceptEl)
    if (!htmlElement) return
    const { width, height } = htmlElement.getBoundingClientRect()
    dimensions.width = `${width}px`
    dimensions.height = `${height}px`
  })

  return reactive({
    boxShadow,
    cursor,
    dimensions,
  })
}
