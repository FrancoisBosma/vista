import { useUiStore } from '@FEATURES/blueprint/stores'
import { BlueprintBackgroundColor } from '@FEATURES/blueprint/types'
import type { setManipulationHandling } from './'
import type { BpNodeWrapper, Dimension } from '@FEATURES/blueprint/types'
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
  subConceptStyle?: ReturnType<ReturnType<typeof useUiStore>['getSubConceptStyle']>
  bpNodeId?: BpNodeWrapper['id']
  parentCumulativeSubContentScale: number
}

export default function setStyleHandling({
  isEmpty,
  isHovered,
  concept,
  isConceptFetched,
  parentDepth,
  subConceptStyle,
  bpNodeId,
  parentCumulativeSubContentScale,
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

  const currentContentScale = computed(() =>
    bpNodeId ? ui.getBlueprintTreeNode(bpNodeId)?.bpRef.getContentScale() ?? 1 : 1
  )
  const currentCumulativeSubContentScale = computed(() => parentCumulativeSubContentScale * currentContentScale.value)
  const isAtRootLevel = computed(
    () => bpNodeId && ui.getBlueprintTreeNode(bpNodeId)?.id === ui.getBlueprintTreeRoot()?.id
  )
  const cumulatedContentScale = computed(() => {
    if (isAtRootLevel.value) return currentCumulativeSubContentScale.value
    return currentCumulativeSubContentScale.value * (ui.getBlueprintTreeRoot()?.bpRef.getContentScale() ?? 1)
  })

  watchOnce(isConceptFetched, () => {
    const conceptDimensions = getNumbersFromPair(concept.value.wh as Pair<number>)
    if (conceptDimensions?.length !== 2) return
    dimensions.width = `${conceptDimensions[0]}px`
    dimensions.height = `${conceptDimensions[1]}px`
    const subConceptPosition = {
      left: Number(subConceptStyle?.left.split('px')[0]) || 0,
      top: Number(subConceptStyle?.top.split('px')[0]) || 0,
    } as Position
    watchEffect(() => {
      // TODO: what I'm missing is: Vparent, (diff between -75px and .left) * contentScale
      bgDisplay.left = `${-conceptDimensions[0] / 2 + subConceptPosition.left * cumulatedContentScale.value}px`
      bgDisplay.top = `${-conceptDimensions[1] / 2 + subConceptPosition.top * cumulatedContentScale.value}px`
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
    currentCumulativeSubContentScale,
  })
}
