export function toDegrees(radianAngle: number): number {
  return radianAngle * (180 / Math.PI)
}

export function toRadians(degreeAngle: number): number {
  return degreeAngle * (Math.PI / 180)
}
