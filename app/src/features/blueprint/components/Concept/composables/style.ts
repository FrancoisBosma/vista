import { useUiStore } from '@FEATURES/blueprint/stores'
import type { setManipulationHandling } from './'
import type { Dimension } from '@FEATURES/blueprint/types'
import type { Concept } from '@API/gql-generated/graphql'
import type { Pair } from '@SRC/types'

const ui = useUiStore()

interface StyleArguments {
  isEmpty: ReturnType<typeof eagerComputed<boolean>>
  isHovered: ReturnType<typeof setManipulationHandling>['isHovered']
  concept: Ref<Concept>
  isConceptFetched: Ref<boolean>
  contentScale: Ref<number>
}

export default function setStyleHandling({
  isEmpty,
  isHovered,
  concept,
  isConceptFetched,
  contentScale,
}: StyleArguments) {
  const boxShadow = computed(
    () => `${isHovered.value && !isEmpty.value ? '0 0 3px var(--foreground)' : '0 1px 3px rgba(0, 0, 0, 0.5)'}`
  )
  const cursor = computed(() => (ui.isDragging ? 'inherit' : isEmpty.value ? 'auto' : 'pointer'))

  const dimensions = reactive({
    width: 'fit-content',
    height: 'fit-content',
  }) as Record<Dimension, string>
  const bgDisplay = reactive({
    left: '0px',
    top: '0px',
    transform: '',
  }) as Record<string, string>
  watchOnce(isConceptFetched, () => {
    const conceptDimensions = getNumbersFromPair(concept.value.wh as Pair<number>)
    if (conceptDimensions?.length !== 2) return
    dimensions.width = `${conceptDimensions[0]}px`
    dimensions.height = `${conceptDimensions[1]}px`
    bgDisplay.left = `-${conceptDimensions[0] / 2}px`
    bgDisplay.top = `-${conceptDimensions[1] / 2}px`
    watchEffect(() => {
      bgDisplay.width = `${conceptDimensions[0] * contentScale.value}px`
      bgDisplay.height = `${conceptDimensions[1] * contentScale.value}px`
      bgDisplay.transform = `scale(${contentScale.value})`
    })
  })

  const conceptRoundness = '10px'

  return reactive({
    boxShadow,
    cursor,
    dimensions,
    bgDisplay,
    conceptRoundness,
  })
}
