export const genericTapCoords = (e: MouseEvent | TouchEvent) => {
  let x = 0
  let y = 0
  if (Object.prototype.hasOwnProperty.call(e, 'changedTouches')) {
    x = (e as TouchEvent).changedTouches[0].clientX
    y = (e as TouchEvent).changedTouches[0].clientY
  } else {
    x = (e as MouseEvent).x
    y = (e as MouseEvent).y
  }
  return { x, y }
}
