import type { InjectionKey } from 'vue'
import type { BlueprintNodeProvideData } from '@FEATURES/blueprint/types'
import type { ConceptProvideData } from '@FEATURES/blueprint/components/Concept/types/Concept'

// Provide/Inject
export const bpNodeProvideKey = Symbol('BlueprintNode-data') as InjectionKey<BlueprintNodeProvideData>
export const conceptProvideKey = Symbol('Concept-data') as InjectionKey<ConceptProvideData>
