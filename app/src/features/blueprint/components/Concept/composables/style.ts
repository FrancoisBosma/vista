import { useUiStore } from '@FEATURES/blueprint/stores'
import type { Ref } from 'vue'
import type { setManipulationHandling } from './'

const ui = useUiStore()

interface StyleArguments {
  isEmpty: ReturnType<typeof eagerComputed<boolean>>
  isHovered: ReturnType<typeof setManipulationHandling>['isHovered']
  closeConceptEl: Ref<any>
}

export default function setStyleHandling({ isEmpty, isHovered, closeConceptEl }: StyleArguments) {
  const boxShadow = computed(
    () => `${isHovered.value && !isEmpty.value ? '0 0 3px var(--emphasis)' : '0 1px 3px rgba(0, 0, 0, 0.5)'}`
  )
  const conceptCursor = computed(() => (ui.dragState === 'dragged' ? 'inherit' : isEmpty.value ? 'auto' : 'pointer'))
  const savedConceptDimensions = reactive({
    width: 'fit-content',
    height: 'fit-content',
  })
  const updateSavedConceptDimensions = () => {
    const htmlElement = unrefElement(closeConceptEl)
    if (!htmlElement) return
    const { width, height } = htmlElement.getBoundingClientRect()
    savedConceptDimensions.width = `${width}px`
    savedConceptDimensions.height = `${height}px`
  }
  watchOnce(closeConceptEl, updateSavedConceptDimensions)

  return reactive({
    boxShadow,
    conceptCursor,
    savedConceptDimensions,
    closeConceptEl,
  })
}
