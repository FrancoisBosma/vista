import type { Concept } from '@API/gql-generated/graphql'

export type MaybeFetchedConcept = Partial<Concept> & Pick<Concept, 'name'>
