import type { ViteSSGContext } from 'vite-ssg'
import type { FullGestureState, StateKey } from '@vueuse/gesture'

export type UserModule = (ctx: ViteSSGContext) => void
export type DragState = FullGestureState<StateKey<'drag'>>
export type PinchState = FullGestureState<StateKey<'pinch'>>
