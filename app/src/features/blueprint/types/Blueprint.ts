import type { UUID } from '@GLOBAL/functions/uuid'
import type { Pair } from '@SRC/types'

export type Axis = 'x' | 'y'
export type Dimension = 'width' | 'height'
export type OffsetSide = 'left' | 'right' | 'top' | 'bottom'
export type Axes = Record<Dimension, Axis>
export interface DimensionProperties {
  axis: Axis
}
export type Dimensions = Record<Dimension, DimensionProperties>

export type Zoom = 'out' | 'in'
export type ZoomDirectionFactor = -1 | 1
export interface ZoomProperties {
  directionFactor: ZoomDirectionFactor
}
export type ZoomTypes = Record<Zoom, ZoomProperties>

export type Offset = number
export type Offsets = Record<Dimension, Offset>
export type Coordinates = Record<Axis, number>
export interface GridExposed {
  updateAppearance: Function
  squareLength: number | Ref<number>
}
export type GridRefs = Ref<Array<GridExposed>>

export enum BlueprintBackgroundColor {
  normal = 'var(--background)',
  stronger = 'var(--background-stronger)',
}
export interface BlueprintExpose {
  handleWheel: Function
  handlePinch: Function
  handleDrag: Function
  getContentScale: () => number
  contentOffsets: Offsets
}
export interface BlueprintNodeProvideData {
  depth: number
  id?: UUID
}
export type BpNodeId = UUID
export interface BpNodeWrapper {
  id: BpNodeId
  bpRef: BlueprintExpose
  childrenIds: Array<BpNodeId>
  parentId?: BpNodeId
}

export type ContentType = 'concept'
export type ContentKey = string
export type ContentIdentification = Pair<ContentType, ContentKey>
