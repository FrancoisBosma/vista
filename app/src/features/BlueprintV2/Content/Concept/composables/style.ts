import { useBlueprintStore } from '@FEATURES/BlueprintV2/stores'
// import { BlueprintBackgroundColor } from '@FEATURES/BlueprintV2/types'
import type { setManipulationHandling } from './'
import type { Dimension, Concept } from '@FEATURES/BlueprintV2/types'
import type { Pair } from '@SRC/types'
// import type { Position } from '@FEATURES/BlueprintV2/components/Concept/types/Concept'

const ui = useBlueprintStore()

type StyleArguments = {
  isEmpty: ReturnType<typeof eagerComputed<boolean>>
  isHovered: ReturnType<typeof setManipulationHandling>['isHovered']
  concept: Ref<Concept>
  isConceptFetched: Ref<boolean>
}

export default function setStyleHandling({
  isEmpty,
  isHovered,
  concept,
  isConceptFetched,
}: StyleArguments) {
  const boxShadow = computed(
    () => `${isHovered.value && !isEmpty.value ? '0 0 3px var(--foreground)' : '0 1px 3px rgba(0, 0, 0, 0.5)'}`
  )
  const cursor = computed(() => (ui.isDragging ? 'inherit' : isEmpty.value ? 'auto' : 'pointer'))
  const dimensions = reactive({
    width: 'fit-content',
    height: 'fit-content',
  }) as Record<Dimension, string>
  const conceptRoundness = '10px'
  //
  // >> Events
  //
  watchOnce(isConceptFetched, () => {
    const conceptDimensions = getNumbersFromPair(concept.value.wh as Pair<number>)
    if (conceptDimensions?.length !== 2) return
    dimensions.width = `${conceptDimensions[0]}px`
    dimensions.height = `${conceptDimensions[1]}px`
  })

  return reactive({
    boxShadow,
    cursor,
    dimensions,
    conceptRoundness,
  })
}
