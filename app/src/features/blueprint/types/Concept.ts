export type Concept = MinimalConcept | FullConcept
//
// Fully filled Concept
//
export type FullConcept = {
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
  concept: Concept
  x: number
  y: number
}
export type SubConceptConnection = {
  sourceSCIndex: number
  sourceSCArgumentType: ConceptArgumentType
  targetConceptType: 'Self' | 'SC' | 'Argument' | 'SCArgument'
  targetConceptIndex?: number
  targetConceptArgumentType?: ConceptArgumentType
}
//
// Minimally filled Concept
//
export type MinimalConcept = {
  name: FullConcept['name']
  composition?: {
    subConcepts: MinimalSubConcept[]
  }
}
export type MinimalSubConcept = {
  concept: Pick<FullConcept, 'name'>
}
