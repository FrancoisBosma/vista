import type { InjectionKey } from 'vue'
import type { EventBusKey } from '@vueuse/core'
import type { BlueprintNodeProvideData, BlueprintProvideData } from '@FEATURES/blueprint/types'

// Provide/Inject
export const bpNodeProvideKey = Symbol('BlueprintNode-data') as InjectionKey<BlueprintNodeProvideData>
export const bpProvideKey = Symbol('Blueprint-data') as EventBusKey<BlueprintProvideData>
