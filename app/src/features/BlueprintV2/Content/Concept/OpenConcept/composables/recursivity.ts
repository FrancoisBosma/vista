import { invoke } from '@vueuse/core'
import { contentProvideKey, getContentInfo } from '@FEATURES/BlueprintV2/Blueprint/ContentNode/utils'
import { useConceptStore } from '@FEATURES/BlueprintV2/Content/Concept/stores'
import { getConceptSubLevelScale, getConceptEdgePositions } from '@FEATURES/BlueprintV2/Blueprint/ContentNode/utils'

import type { Concept } from '@FEATURES/BlueprintV2/types'
import type { NodeAttributes, Position, ContentProvideData } from '@FEATURES/BlueprintV2/Blueprint/ContentNode'

export default function setConceptRecursivity() {
  const { getStoreConcept } = useConceptStore()

  const nodeData = inject(contentProvideKey) as NonNullable<ContentProvideData>
  
  const nodeAttributes: NodeAttributes = invoke(() => {
    const [contentType, contentKey] = getContentInfo(nodeData.content)
    if (contentType === 'concept') return handleConceptCase(contentKey)
    return undefined as never
  })
  function handleConceptCase(conceptName: Concept['name']): NodeAttributes {
    const concept = getStoreConcept(conceptName)
    if (!concept?.wh) return undefined as never
    const conceptEdgePositions = getConceptEdgePositions(concept)
    const conceptSubLevelScale = getConceptSubLevelScale(concept.wh, conceptEdgePositions)
    const cumulativeNodeScale = nodeData.parentNodeAttributes.scale * conceptSubLevelScale
    const cumulativeNodePosition = objectMap(nodeData.parentNodeAttributes.position, (v: number, k: keyof Position) => v + nodeData.relativeToParentPosition[k] * cumulativeNodeScale)
    return {
      scale: cumulativeNodeScale,
      position: cumulativeNodePosition,
    }
  }

  provide(contentProvideKey, {
    ...nodeData,
    depth: nodeData.depth + 1,
    parentNodeAttributes: nodeAttributes,
  })

  return {
    nodeAttributes,
  }
}
