import type { Pair } from '@SRC/types'
import type { Concept } from '@API/gql-generated/graphql'

export type ContentType = 'concept'
export type ContentKey = ConceptKey
export type ContentIdentification = Pair<ContentType, ContentKey>

// 
// Concept
// 
export type ConceptKey = Concept['name']
