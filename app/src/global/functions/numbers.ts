// export const absoluteValue = (nb: number) => Math.abs(nb)
export const toTheNth = (base = 0, exponent = 2) => base ** exponent
// export const floorRoundUp = (nb: number) => ~~nb // A better performing alternative to Math.floor
export const nthRoot = (base = 0, exponent = 2) => toTheNth(base, 1 / exponent)
export const range = (end: number, start = 0, step = 1) =>
  Array.from({ length: Math.ceil((end - start) / step) }, (_, i) => start + i * step)
// export const convertDec2Hex = (nb: number, minStringSize = 2) => {
//   let output = nb.toString(16)
//   for (let i = 0; i < minStringSize - output.length; i++) {
//     output = `0${output}`
//   }
//   return output
// }
// export const convertHex2Dec = (hexString: string) => parseInt(hexString, 16)
// export const hexDivision = (...nbs: string[]) => {
//   // Let's have x = nbs[0],
//   // We want the first step of the reducer to yield acc = x
//   // Thus: acc = x²/x <=> acc = x
//   const accumulatorStartingValue = toTheNth(convertHex2Dec(nbs[0]))
//   return convertDec2Hex(Math.round(nbs.reduce((acc, curr) => acc / convertHex2Dec(curr), accumulatorStartingValue)))
// }
// export const hexMultiplication = (...nbs: string[]) =>
//   convertDec2Hex(Math.round(nbs.reduce((a, curr) => a * convertHex2Dec(curr), 1)))
// export const hexSubtraction = (...nbs: string[]) => {
//   // Let's have x = nbs[0],
//   // We want the first step of the reducer to yield acc = x
//   // Thus: acc = x + |x| - x <=> acc = x
//   const accumulatorStartingValue = convertHex2Dec(nbs[0]) + absoluteValue(convertHex2Dec(nbs[0]))
//   return convertDec2Hex(nbs.reduce((acc, curr) => acc - convertHex2Dec(curr), accumulatorStartingValue))
// }
// export const hexSum = (...nbs: string[]) => convertDec2Hex(nbs.reduce((acc, curr) => acc + convertHex2Dec(curr), 0))
