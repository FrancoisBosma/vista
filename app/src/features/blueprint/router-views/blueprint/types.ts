import type { Axis, Dimension } from '@FEATURES/blueprint/stores'

export type Offsets = Record<Dimension, number>
export type Coordinates = Record<Axis, number>
export interface GridExposed {
  updateAppearance: Function
  squareLength: number
}
