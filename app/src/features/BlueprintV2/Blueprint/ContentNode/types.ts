import type { ContentIdentification } from '@FEATURES/BlueprintV2/types'

export interface Position {
  left: number
  top: number
}

export interface NodeAttributes {
  position: Position
  scale: number
}

export interface ContentProvideData {
  content: ContentIdentification
  relativeToParentPosition: Position
  depth: number
  parentNodeAttributes: NodeAttributes
}
