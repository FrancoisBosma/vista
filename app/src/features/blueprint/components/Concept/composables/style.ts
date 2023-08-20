import { useUiStore } from '@FEATURES/blueprint/stores'
import { BlueprintBackgroundColor } from '@FEATURES/blueprint/types'
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
  parentDepth: number
  subConceptStyle?: ReturnType<ReturnType<typeof useUiStore>['getSubConceptStyle']>
}

export default function setStyleHandling({
  isEmpty,
  isHovered,
  concept,
  isConceptFetched,
  contentScale,
  parentDepth,
  subConceptStyle,
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
    width: '0px',
    height: '0px',
    transform: '',
  }) as Record<string, string>

  const isWithinParentBlueprint = parentDepth === 0

  watchOnce(isConceptFetched, () => {
    const conceptDimensions = getNumbersFromPair(concept.value.wh as Pair<number>)
    if (conceptDimensions?.length !== 2) return
    dimensions.width = `${conceptDimensions[0]}px`
    dimensions.height = `${conceptDimensions[1]}px`
    const subConceptPlacement = {
      left: Number(subConceptStyle?.left.split('px')[0]) || 0,
      top: Number(subConceptStyle?.top.split('px')[0]) || 0,
    }
    const cumulatedContentScale = computed(() => {
      if (isWithinParentBlueprint) return contentScale.value
      return contentScale.value * (ui.getBlueprintTreeRoot()?.bpRef.getContentScale() || 1)
    })
    watchEffect(() => {
      bgDisplay.left = `${-conceptDimensions[0] / 2 + subConceptPlacement.left * cumulatedContentScale.value}px`
      bgDisplay.top = `${-conceptDimensions[1] / 2 + subConceptPlacement.top * cumulatedContentScale.value}px`
      bgDisplay.width = `${conceptDimensions[0] * cumulatedContentScale.value}px`
      bgDisplay.height = `${conceptDimensions[1] * cumulatedContentScale.value}px`
      bgDisplay.transform = `scale(${cumulatedContentScale.value})`
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
