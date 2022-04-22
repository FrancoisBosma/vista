import type { Axis, Dimension } from '@FEATURES/blueprint/stores'
import type { FullGestureState, StateKey } from '@vueuse/gesture'
import type { Dictionary } from '@ROOT/src/types'
import type { Ref } from 'vue'

export type Offset = number
export type Offsets = Record<Dimension, Offset>
export type Coordinates = Record<Axis, number>
export interface GridExposed {
  updateAppearance: Function
  squareLength: number
}
export type DragState = FullGestureState<StateKey<'drag'>>
export type BlueprintInfo = Dictionary<Ref<number>>
export type GridRefs = Ref<Object[]>
