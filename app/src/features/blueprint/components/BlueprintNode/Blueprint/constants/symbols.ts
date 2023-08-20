import type { InjectionKey } from 'vue'
import type { BlueprintNodeProvideData, BlueprintProvideData } from '@FEATURES/blueprint/types'

// Provide/Inject
export const bpNodeProvideKey = Symbol('BlueprintNode-data') as InjectionKey<BlueprintNodeProvideData>
export const bpProvideKey = Symbol('Blueprint-data') as InjectionKey<BlueprintProvideData>
