import type { Concept, SubConcept } from '@API/gql-generated/graphql'
import type { Pair } from '@SRC/types'

export default function useConcept() {
  const getContentDisplayDimensions = (concept: Ref<Concept>): Pair<number> => {
    let leftMost = 0
    let rightMost = 0
    let topMost = 0
    let bottomMost = 0
    concept.value.composition?.subConcepts.forEach((subConcept) => {
      const scXy = subConcept.xy?.split(':').map((s) => Number(s))
      const scWh = subConcept.wh?.split(':').map((s) => Number(s))
      if (scXy?.length !== 2 || scWh?.length !== 2) return
      leftMost = Math.min(leftMost, scXy[0] - scWh[0] / 2)
      rightMost = Math.max(rightMost, scXy[0] + scWh[0] / 2)
      topMost = Math.max(topMost, scXy[1] + scWh[1] / 2)
      bottomMost = Math.min(bottomMost, scXy[1] - scWh[1] / 2)
    })
    return `${rightMost - leftMost}:${topMost - bottomMost}`
  }
  const getSubConceptStyle = (sc: SubConcept): Record<string, string> => {
    const positionValues = sc.xy?.split(':')
    if (positionValues?.length !== 2) return {}
    return { transform: `translate(calc(-50% + ${positionValues[0]}px), calc(-50% - ${positionValues[1]}px))` }
  }

  return { getContentDisplayDimensions, getSubConceptStyle }
}
