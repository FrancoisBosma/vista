import type { UUID } from '@GLOBAL/functions/uuid'

export type Axis = 'x' | 'y'
export type OffsetSide = 'left' | 'right' | 'top' | 'bottom'
export type Dimension = 'width' | 'height'
export type Offset = number
export type ZoomDirectionFactor = -1 | 1
export type Offsets = Record<Dimension, Offset>
export type Coordinates = Record<Axis, number>
export interface BlueprintSFC {
  id: UUID
}
