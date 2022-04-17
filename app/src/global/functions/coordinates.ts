// import { absoluteValue, floorRoundUp, toTheNth } from './numbers'
// import { objectMap } from './objects'

// export const computeExtraOffset = (extraOffsetToBe: number, oldOffset: number, limit: number) => {
//   const offsetTest = oldOffset + extraOffsetToBe
//   if (offsetTest < 0) {
//     const adjustmentFactor = absoluteValue(floorRoundUp(offsetTest / limit)) + (offsetTest % limit ? 1 : 0)
//     return extraOffsetToBe + limit * adjustmentFactor
//   }
//   if (offsetTest >= limit) {
//     const adjustmentFactor = floorRoundUp(offsetTest / limit)
//     return extraOffsetToBe - limit * adjustmentFactor
//   }
//   return extraOffsetToBe
// }
// export const computeLengthDelta = (newScale: number, lastScale: number, length: number) =>
//   (newScale / lastScale - 1) * length
// export const computeZoomedContentOffsets = (
//   axes,
//   contentOffset,
//   bpDimensions,
//   cursorRelCoords,
//   newScale: number,
//   lastScale: number
// ) => {
//   const output = {}
//   Object.entries(axes).forEach(([dim, axis]) => {
//     const contentToCursor = bpDimensions[dim] / 2 + contentOffset[dim] - cursorRelCoords[axis]
//     const extraContentOffset = computeLengthDelta(newScale, lastScale, contentToCursor)
//     output[dim] = extraContentOffset
//   })
//   return output
// }
// export const computeZoomedGridOffsets = (
//   axes,
//   gridsOffsets,
//   cursorRelCoords,
//   zoomRate: number,
//   zoomFactor: number,
//   biggerSquareLength: number
// ) => {
//   const output = {}
//   Object.entries(axes).forEach(([dim, axis]) => {
//     const svgToCursorLength = gridsOffsets[dim] + cursorRelCoords[axis]
//     const lengthDelta = (toTheNth(zoomRate, zoomFactor) - 1) * svgToCursorLength
//     const extraOffset = computeExtraOffset(lengthDelta, gridsOffsets[dim], biggerSquareLength)
//     output[dim] = extraOffset
//   })
//   return output
// }
// screen touch vs click
// export const generalPressEventFormatting = (e: TouchEvent | MouseEvent) =>
//   e instanceof TouchEvent ? e.changedTouches[0] : e
// export const getCoordinatesRelativeToElement = (absoluteCoordinates, elementAbsoluteCoordinates, dimensionAxes) =>
//   objectMap(dimensionAxes, (value, key) => absoluteCoordinates[key] - elementAbsoluteCoordinates[key], true)
// export const getSpatialData = (localStore, bpRef, event) => {
//   const axes = localStore.getter('axes')
//   const bpInfo = bpRef.getBoundingClientRect()
//   const bpAbsCoordinates = objectMap(axes, (axis) => bpInfo[axis])
//   const bpDimensions = objectMap(axes, (axis, dim) => bpInfo[dim])
//   const eventAbsCoordinates = objectMap(axes, (value) => event[value])
//   const eventRelativeCoordinates = getCoordinatesRelativeToElement(eventAbsCoordinates, bpAbsCoordinates, axes)
//   return {
//     axes,
//     bpInfo,
//     bpAbsCoordinates,
//     bpDimensions,
//     eventAbsCoordinates,
//     eventRelativeCoordinates,
//   }
// }
