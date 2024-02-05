import { useUiStore } from '@FEATURES/blueprint/stores'
import { BlueprintBackgroundColor } from '@FEATURES/blueprint/types'
import type { setManipulationHandling } from './'
import type { Dimension } from '@FEATURES/blueprint/types'
import type { Concept } from '@API/gql-generated/graphql'
import type { Pair } from '@SRC/types'
import type { Position } from '@FEATURES/blueprint/components/Concept/types/Concept'

const ui = useUiStore()

interface StyleArguments {
  isEmpty: ReturnType<typeof eagerComputed<boolean>>
  isHovered: ReturnType<typeof setManipulationHandling>['isHovered']
  concept: Ref<Concept>
  isConceptFetched: Ref<boolean>
  parentDepth: number
  rootContentScale: Ref<number>
  cumulativeConceptScale: Ref<number>
  cumulativeSubConceptPosition: Ref<Position>
}

export default function setStyleHandling({
  isEmpty,
  isHovered,
  concept,
  isConceptFetched,
  parentDepth,
  rootContentScale,
  cumulativeConceptScale,
  cumulativeSubConceptPosition,
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
    watchEffect(() => {
      bgDisplay.left = `${
        -conceptDimensions[0] / 2 + cumulativeSubConceptPosition.value.left * rootContentScale.value
      }px`
      bgDisplay.top = `${-conceptDimensions[1] / 2 + cumulativeSubConceptPosition.value.top * rootContentScale.value}px`
      bgDisplay.transform = `scale(${cumulativeConceptScale.value})`
    })
  })
  const conceptBgColor =
    (parentDepth + 1) % 2 === 0 ? BlueprintBackgroundColor.normal : BlueprintBackgroundColor.stronger
  const conceptRoundness = '10px'

  return reactive({
    boxShadow,
    cursor,
    dimensions,
    bgDisplay,
    conceptBgColor,
    conceptRoundness,
  })
}
