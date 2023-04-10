import { useUiStore } from '@FEATURES/blueprint/stores'
import type { Ref } from 'vue'
import type { setManipulationHandling } from './'

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
  const conceptCursor = computed(() => (ui.isDragging ? 'inherit' : isEmpty.value ? 'auto' : 'pointer'))
  const openConceptZoomScale = ref(1)
  const defaultConceptDimensions = reactive({
    width: -1,
    height: -1,
  })
  watchOnce(closeConceptEl, () => {
    const htmlElement = unrefElement(closeConceptEl)
    if (!htmlElement) return
    const { width, height } = htmlElement.getBoundingClientRect()
    defaultConceptDimensions.width = width
    defaultConceptDimensions.height = height
  })
  const conceptDimensions = computed(() => {
    if (defaultConceptDimensions.width < 0) return { width: 'fit-content', height: 'fit-content' }
    const width = defaultConceptDimensions.width * openConceptZoomScale.value
    const height = defaultConceptDimensions.height * openConceptZoomScale.value
    return { width: `${width}px`, height: `${height}px` }
  })

  return reactive({
    boxShadow,
    conceptCursor,
    conceptDimensions,
    closeConceptEl,
  })
}
