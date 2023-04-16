import { useUiStore } from '@FEATURES/blueprint/stores'
import type { setManipulationHandling } from './'
import type { BlueprintProvideData, Dimension } from '@FEATURES/blueprint/types'

const ui = useUiStore()

interface StyleArguments {
  isEmpty: ReturnType<typeof eagerComputed<boolean>>
  isHovered: ReturnType<typeof setManipulationHandling>['isHovered']
  closeConceptEl: Ref<HTMLElement | null>
  parentBpData: BlueprintProvideData
}

export default function setStyleHandling({ isEmpty, isHovered, closeConceptEl, parentBpData }: StyleArguments) {
  const boxShadow = computed(
    () => `${isHovered.value && !isEmpty.value ? '0 0 3px var(--foreground)' : '0 1px 3px rgba(0, 0, 0, 0.5)'}`
  )
  const cursor = computed(() => (ui.isDragging ? 'inherit' : isEmpty.value ? 'auto' : 'pointer'))
  const defaultDimensions = reactive({
    width: -1,
    height: -1,
  }) as Record<Dimension, number>
  watchOnce(closeConceptEl, () => {
    const htmlElement = unrefElement(closeConceptEl)
    if (!htmlElement) return
    const { width, height } = htmlElement.getBoundingClientRect()
    defaultDimensions.width = width
    defaultDimensions.height = height
  })
  const dimensions = eagerComputed(() => {
    if (defaultDimensions.width < 0) return { width: 'fit-content', height: 'fit-content' }
    const dimMultiplier = parentBpData.contentScale.value < 1 ? 1 : parentBpData.contentScale.value
    const width = defaultDimensions.width * dimMultiplier
    const height = defaultDimensions.height * dimMultiplier
    return { width: `${width}px`, height: `${height}px` }
  })
  const transform = eagerComputed(
    () => `scale(${parentBpData.contentScale.value < 1 ? parentBpData.contentScale.value : 1})`
  )

  return reactive({
    boxShadow,
    cursor,
    closeConceptEl,
    dimensions,
    transform,
  })
}
