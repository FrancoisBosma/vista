import type { Pair } from '@SRC/types'
import type { Concept as _Concept, SubConcept as _SubConcept } from '@API/gql-generated/graphql'

export type Concept = _Concept
export type SubConcept = _SubConcept

export type ContentType = 'concept'
export type ContentKey = ConceptKey
export type ContentIdentification = Pair<ContentType, ContentKey>

// 
// Concept
// 
export type ConceptKey = Concept['name']
