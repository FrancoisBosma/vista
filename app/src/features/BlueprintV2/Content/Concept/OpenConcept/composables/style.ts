import type { Concept } from '@FEATURES/BlueprintV2/types'

type StyleArguments = {
  concept: Ref<Concept>
}

export default function setStyleHandling({
  concept,
}: StyleArguments) {
  const bgDisplay = reactive({
    left: '0px',
    top: '0px',
    transform: '',
  }) as Record<string, string>
  const conceptBgColor =
    (parentDepth + 1) % 2 === 0 ? BlueprintBackgroundColor.normal : BlueprintBackgroundColor.stronger

  const conceptDimensions = getNumbersFromPair(concept.value.wh as Pair<number>)
  if (conceptDimensions?.length !== 2) return
  watchEffect(() => {
    bgDisplay.left = `${
      -conceptDimensions[0] / 2 + cumulativeSubConceptPosition.value.left * rootContentScale.value
    }px`
    bgDisplay.top = `${-conceptDimensions[1] / 2 + cumulativeSubConceptPosition.value.top * rootContentScale.value}px`
    bgDisplay.transform = `scale(${cumulativeConceptScale.value})`
  })

  return {

  }
}
