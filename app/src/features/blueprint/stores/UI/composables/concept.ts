import type { Concept, SubConcept } from '@API/gql-generated/graphql'
import type { Pair } from '@SRC/types'

type EdgePosition = 'leftMost' | 'rightMost' | 'topMost' | 'bottomMost'
type EdgePositions = Record<EdgePosition, number>

export default function useConcept() {
  const getContentEdgePositions = (concept: Ref<Concept>): EdgePositions => {
    const output = {
      leftMost: 0,
      rightMost: 0,
      topMost: 0,
      bottomMost: 0,
    } as EdgePositions
    concept.value.composition?.subConcepts.forEach((subConcept) => {
      const scXy = getNumbersFromPair(subConcept.xy as Pair<number> | undefined)
      const scWh = getNumbersFromPair(subConcept.wh as Pair<number> | undefined)
      if (scXy?.length !== 2 || scWh?.length !== 2) return
      output.leftMost = Math.min(output.leftMost, scXy[0] - scWh[0] / 2)
      output.rightMost = Math.max(output.rightMost, scXy[0] + scWh[0] / 2)
      output.topMost = Math.max(output.topMost, scXy[1] + scWh[1] / 2)
      output.bottomMost = Math.min(output.bottomMost, scXy[1] - scWh[1] / 2)
    })
    return output
  }
  const getContentDisplayDimensions = (edgePositions: EdgePositions): Pair<number> => {
    return `${edgePositions.rightMost - edgePositions.leftMost}:${edgePositions.topMost - edgePositions.bottomMost}`
  }
  const getDisplayOffsets = ({ leftMost, rightMost, topMost, bottomMost }: EdgePositions) => ({
    horizontal: (leftMost + rightMost) / -2,
    vertical: (topMost + bottomMost) / -2,
  })
  const getSubConceptStyle = (contentEdgePositions: EdgePositions, sc: SubConcept): Record<string, string> => {
    const positionValues = getNumbersFromPair(sc.xy as Pair<number> | undefined)
    if (positionValues?.length !== 2) return {}
    const displayOffsets = getDisplayOffsets(contentEdgePositions)
    const transformOffsets = {
      horizontal: `-50% + ${positionValues[0] + displayOffsets.horizontal}px`,
      vertical: `-50% - ${positionValues[1] + displayOffsets.vertical}px`,
    }
    return { transform: `translate(calc(${transformOffsets.horizontal}), calc(${transformOffsets.vertical}))` }
  }

  return { getContentDisplayDimensions, getContentEdgePositions, getDisplayOffsets, getSubConceptStyle }
}
