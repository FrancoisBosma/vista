export type Concept = MinimalConcept | FullConcept
//
// Fully filled Concept
//
export type FullConcept = {
  fetchStatus: FetchStatus.full
  name: string
  arguments: ConceptArgumentType[]
  composition?: ConceptComposition
}
export type ConceptArgumentType = {
  name: string
  capacity: `${number}` | 'infinite'
}
export type ConceptComposition = {
  subConcepts: SubConcept[]
  connections: SubConceptConnection[]
}
export type SubConcept = {
  concept: MinimalConcept
  x: number
  y: number
  w: number
  h: number
}
export type SubConceptConnection = {
  sourceCustomID: String
  sourceArgumentType: ConceptArgumentType
  targetConceptType: TargetConceptType
  targetConceptCustomID?: String // For OtherSubConcept + OtherSubConceptArgument
  targetConceptArgumentType?: ConceptArgumentType // For OtherSubConceptArgument + OwnerArgument
}

enum TargetConceptType {
  Self = 'Self',
  OtherSubConcept = 'OtherSubConcept',
  OtherSubConceptArgument = 'OtherSubConceptArgument',
  OwnerArgument = 'OwnerArgument',
}
//
// Minimally filled Concept
//
export type MinimalConcept = {
  fetchStatus?: FetchStatus
  name: FullConcept['name']
  composition?: {
    subConcepts: MinimalSubConcept[]
  }
}
export type MinimalSubConcept = {
  concept: Pick<FullConcept, 'name'>
}
//
// Fetch status
//
export enum FetchStatus {
  failure,
  loading,
  minimal,
  full,
}
