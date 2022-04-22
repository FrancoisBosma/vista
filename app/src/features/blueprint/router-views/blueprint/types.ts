import type { Axis, Dimension } from '@FEATURES/blueprint/stores'
import type { FullGestureState, StateKey } from '@vueuse/gesture'

export type Offsets = Record<Dimension, number>
export type Coordinates = Record<Axis, number>
export interface GridExposed {
  updateAppearance: Function
  squareLength: number
}
export type DragState = FullGestureState<StateKey<'drag'>>
