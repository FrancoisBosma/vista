import setDynamicAppearance from './composables/dynamicBackground'
import type { GridSFC } from '@FEATURES/BlueprintV2/Blueprint/BlueprintBackground/Grid/types'

export interface BlueprintBackgroundSFC {
  grids: Array<GridSFC>
  bgOffsets: ReturnType<typeof setDynamicAppearance>['bgOffsets']
  bgDimensions: ReturnType<typeof setDynamicAppearance>['bgDimensions']
  bgExtraPosition: ReturnType<typeof setDynamicAppearance>['bgExtraPosition']
  updateBackgroundOffsets: ReturnType<typeof setDynamicAppearance>['updateBackgroundOffsets']
  applyForEveryGrid: ReturnType<typeof setDynamicAppearance>['applyForEveryGrid']
  getCurrentBiggestSquareLength: ReturnType<typeof setDynamicAppearance>['getCurrentBiggestSquareLength']
  computeExtraOffset: ReturnType<typeof setDynamicAppearance>['computeExtraOffset']
}
