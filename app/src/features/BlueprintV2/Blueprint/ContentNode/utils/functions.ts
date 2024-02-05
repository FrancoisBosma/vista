import type { Concept, ContentIdentification, ContentKey, ContentType, SubConcept } from '@FEATURES/BlueprintV2/types'
import type { Position } from '@FEATURES/BlueprintV2/Blueprint/ContentNode'
import type { Pair } from '@SRC/types'

type EdgePosition = 'leftMost' | 'rightMost' | 'topMost' | 'bottomMost'
type EdgePositions = Record<EdgePosition, number>

//
// > Content
//
export const getContentInfo = (content: ContentIdentification) => content.split(':') as [ContentType, ContentKey]
const getContentDisplayDimensions = (edgePositions: EdgePositions): Pair<number> => {
  const displayPadding = 20 * 2 // px
  const horizontalLength = edgePositions.rightMost - edgePositions.leftMost + displayPadding
  const verticalLength = edgePositions.topMost - edgePositions.bottomMost + displayPadding
  return `${horizontalLength}:${verticalLength}`
}
const getDisplayOffsets = ({ leftMost, rightMost, topMost, bottomMost }: EdgePositions) => ({
  horizontal: (leftMost + rightMost) / -2,
  vertical: (topMost + bottomMost) / -2,
})
//
// > Concept specific
//
export const getConceptEdgePositions = (concept: Concept): EdgePositions => {
  const output = {
    leftMost: 0,
    rightMost: 0,
    topMost: 0,
    bottomMost: 0,
  } as EdgePositions
  concept.composition?.subConcepts.forEach((subConcept) => {
    const scXy = getNumbersFromPair(subConcept.xy as Pair<number>)
    const scWh = getNumbersFromPair(subConcept.concept.wh as Pair<number>)
    if (scXy?.length !== 2 || scWh?.length !== 2) return
    output.leftMost = Math.min(output.leftMost, scXy[0] - scWh[0] / 2)
    output.rightMost = Math.max(output.rightMost, scXy[0] + scWh[0] / 2)
    output.topMost = Math.max(output.topMost, scXy[1] + scWh[1] / 2)
    output.bottomMost = Math.min(output.bottomMost, scXy[1] - scWh[1] / 2)
  })
  return output
}
export const getSubConceptPosition = (conceptEdgePositions: EdgePositions, sc: SubConcept): Position => {
  const positionValues = getNumbersFromPair(sc.xy as Pair<number>)
  if (positionValues?.length !== 2) return null as never
  const displayOffsets = getDisplayOffsets(conceptEdgePositions)
  return {
    left: positionValues[0] + displayOffsets.horizontal,
    top: positionValues[1] + displayOffsets.vertical,
  }
}
export const getConceptSubLevelScale = (conceptWh: Concept['wh'], conceptEdgePositions: EdgePositions): number => {
  const [containerW, containerH] = getNumbersFromPair(conceptWh as Pair<number>)
  const conceptDimensions = getContentDisplayDimensions(conceptEdgePositions)
  const extractedConceptDimensions = getNumbersFromPair(conceptDimensions)
  const widthNecessaryScale = containerW / extractedConceptDimensions[0]
  const heightNecessaryScale = containerH / extractedConceptDimensions[1]
  return Math.min(widthNecessaryScale, heightNecessaryScale)
}
