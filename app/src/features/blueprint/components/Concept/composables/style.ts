import { useUiStore } from '@FEATURES/blueprint/stores'
import type { Ref } from 'vue'

const ui = useUiStore()

type StyleArguments = {
  isEmpty: ReturnType<typeof eagerComputed<boolean>>
  closeConceptEl: Ref<any>
}

export default function setStyleHandling({ isEmpty, closeConceptEl }: StyleArguments) {
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
    conceptCursor,
    savedConceptDimensions,
    closeConceptEl,
  })
}
