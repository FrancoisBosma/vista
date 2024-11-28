import type { Concept, ConceptArgumentType } from '@API/gql-generated/graphql'
import type { Pair } from '@ROOT/src/types'

export type MaybeFetchedConcept = Partial<Concept> & Pick<Concept, 'name'>
export type ConceptArgumentKey = Pair<number>
export type SubConceptArgumentKey = `${ConceptArgumentType['name']}@${Pair<number>}`
