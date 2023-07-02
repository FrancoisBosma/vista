import { useUiStore } from '@FEATURES/blueprint/stores'
import type { setManipulationHandling } from './'
import type { Dimension } from '@FEATURES/blueprint/types'
import type { Concept } from '@API/gql-generated/graphql'

const ui = useUiStore()

interface StyleArguments {
  isEmpty: ReturnType<typeof eagerComputed<boolean>>
  isHovered: ReturnType<typeof setManipulationHandling>['isHovered']
  concept: Ref<Concept>
  isConceptFetched: Ref<boolean>
}

export default function setStyleHandling({ isEmpty, isHovered, concept, isConceptFetched }: StyleArguments) {
  const boxShadow = computed(
    () => `${isHovered.value && !isEmpty.value ? '0 0 3px var(--foreground)' : '0 1px 3px rgba(0, 0, 0, 0.5)'}`
  )
  const cursor = computed(() => (ui.isDragging ? 'inherit' : isEmpty.value ? 'auto' : 'pointer'))
  const dimensions = reactive({
    width: 'fit-content',
    height: 'fit-content',
  }) as Record<Dimension, string>
  watchOnce(isConceptFetched, () => {
    const conceptDimensions = concept.value.wh?.split(':')
    if (conceptDimensions?.length !== 2) return
    dimensions.width = `${conceptDimensions[0]}px`
    dimensions.height = `${conceptDimensions[1]}px`
  })

  return reactive({
    boxShadow,
    cursor,
    dimensions,
  })
}
