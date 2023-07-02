import { useUiStore } from '@FEATURES/blueprint/stores'
import type { setManipulationHandling } from './'
import type { Dimension } from '@FEATURES/blueprint/types'
import type { Concept } from '@API/gql-generated/graphql'

const ui = useUiStore()

interface StyleArguments {
  isEmpty: ReturnType<typeof eagerComputed<boolean>>
  isHovered: ReturnType<typeof setManipulationHandling>['isHovered']
  closeConceptEl: Ref<HTMLElement | null>
  wh?: Ref<Concept['wh']>
}

export default function setStyleHandling({ isEmpty, isHovered, closeConceptEl, wh }: StyleArguments) {
  const boxShadow = computed(
    () => `${isHovered.value && !isEmpty.value ? '0 0 3px var(--foreground)' : '0 1px 3px rgba(0, 0, 0, 0.5)'}`
  )
  const cursor = computed(() => (ui.isDragging ? 'inherit' : isEmpty.value ? 'auto' : 'pointer'))
  const dimensions = reactive({
    width: 'fit-content',
    height: 'fit-content',
  }) as Record<Dimension, string>
  const dimValues = wh?.value?.split(':')
  if (dimValues?.length !== 2) {
    watchOnce(closeConceptEl, () => {
      const htmlElement = unrefElement(closeConceptEl)
      if (!htmlElement) return
      const { width, height } = htmlElement.getBoundingClientRect()
      dimensions.width = `${width}px`
      dimensions.height = `${height}px`
    })
  } else {
    dimensions.width = `${dimValues[0]}px`
    dimensions.height = `${dimValues[1]}px`
  }

  return reactive({
    boxShadow,
    cursor,
    dimensions,
  })
}
