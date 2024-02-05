import type { ContentProvideData } from '@FEATURES/BlueprintV2/Blueprint/ContentNode'

// Provide/Inject
export const contentProvideKey = Symbol('Content-data') as InjectionKey<ContentProvideData>
