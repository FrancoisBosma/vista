export type Concept = {
  name: string
  arguments: ConceptArgumentType
  composition: ConceptComposition
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
  targetConceptIndex: number
  targetConceptArgumentType: ConceptArgumentType
}
