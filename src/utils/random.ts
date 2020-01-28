export function randomFloat(min: number, max: number) {
  return min + (max - min) * Math.random()
}

export function randomInt(min: number, max: number) {
  return Math.trunc(randomFloat(min, max))
}
