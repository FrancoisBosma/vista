import type { ViteSSGContext } from 'vite-ssg'
import type { FullGestureState, StateKey } from '@vueuse/gesture'

export type UserModule = (ctx: ViteSSGContext) => void
export type Dictionary<T> = Record<string, T>
export type DragState = FullGestureState<StateKey<'drag'>>
export type TapState = 'idle' | 'dragStart' | 'dragged'
