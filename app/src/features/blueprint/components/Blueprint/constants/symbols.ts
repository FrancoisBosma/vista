import type { InjectionKey } from 'vue'
import type { EventBusKey } from '@vueuse/core'
import type { BlueprintDepth } from '@FEATURES/blueprint/types'

// Provide/Inject
export const bpDepthKey = Symbol('blueprint-depth') as InjectionKey<BlueprintDepth>

// EvensBus
export const bpUpdateKey = Symbol('blueprint-update') as EventBusKey<BlueprintDepth>
