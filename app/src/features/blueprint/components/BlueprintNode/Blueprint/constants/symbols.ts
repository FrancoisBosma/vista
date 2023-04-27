import type { InjectionKey } from 'vue'
import type { BlueprintNodeProvideData } from '@FEATURES/blueprint/types'

// Provide/Inject
export const bpNodeProvideKey = Symbol('BlueprintNode-data') as InjectionKey<BlueprintNodeProvideData>
