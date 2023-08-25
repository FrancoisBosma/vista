import type { Pair } from '@SRC/types'
import type { Concept } from '@API/gql-generated/graphql'

export type ContentType = 'concept'
export type ContentKey = Concept['name']
export type ContentIdentification = Pair<ContentType, ContentKey>
