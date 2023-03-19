import type { Ref } from 'vue'

export type Axis = 'x' | 'y'
export type Dimension = 'width' | 'height'
export type Axes = Record<Dimension, Axis>
export type DimensionProperties = {
  axis: Axis
  boundingClientRectProperty: string
  boxSizeProperty: string
}
export type Dimensions = Record<Dimension, DimensionProperties>
export type Zoom = 'out' | 'in'
export type ZoomDirectionFactor = -1 | 1
export type ZoomProperties = {
  directionFactor: ZoomDirectionFactor
}
export type ZoomTypes = Record<Zoom, ZoomProperties>
export type Offset = number
export type Offsets = Record<Dimension, Offset>
export type Coordinates = Record<Axis, number>
export type GridExposed = {
  updateAppearance: Function
  squareLength: number
}

export type BlueprintInfo = Record<string, Ref<number>>
export type GridRefs = Ref<Object[]>
export enum BlueprintBackgroundColor {
  normal = 'var(--background)',
  stronger = 'var(--background-stronger)',
}
