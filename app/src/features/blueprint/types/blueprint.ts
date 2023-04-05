export type Axis = 'x' | 'y'
export type Dimension = 'width' | 'height'
export type Axes = Record<Dimension, Axis>
export interface DimensionProperties {
  axis: Axis
  boundingClientRectProperty: string
  boxSizeProperty: string
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
  squareLength: number
}

export type BlueprintBounding = ReturnType<typeof useElementBounding>
export enum BlueprintBackgroundColor {
  normal = 'var(--background)',
  stronger = 'var(--background-stronger)',
}
export type BlueprintDepth = number
