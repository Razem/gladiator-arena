import * as ECSA from '../libs/pixi-component'
import GameUnit from './game-unit'

export const DIRECTIONS_AMOUNT = 8

export enum Direction {
  UP,
  UP_RIGHT,
  RIGHT,
  DOWN_RIGHT,
  DOWN,
  DOWN_LEFT,
  LEFT,
  UP_LEFT,
}

export const directionVectors = {
  [Direction.UP]: new ECSA.Vector(0, -1),
  [Direction.UP_RIGHT]: new ECSA.Vector(1, -1),
  [Direction.RIGHT]: new ECSA.Vector(1, 0),
  [Direction.DOWN_RIGHT]: new ECSA.Vector(1, 1),
  [Direction.DOWN]: new ECSA.Vector(0, 1),
  [Direction.DOWN_LEFT]: new ECSA.Vector(-1, 1),
  [Direction.LEFT]: new ECSA.Vector(-1, 0),
  [Direction.UP_LEFT]: new ECSA.Vector(-1, -1),
}

export function calculateAngleFromDirection(dir: Direction) {
  return Math.PI * dir / 4
}

export function calculateDirectionFromAngle(angle: number): Direction {
  return Math.round(angle / (Math.PI / 4)) % 8
}

export function calculateUnitAngle(center: ECSA.Vector, target: ECSA.Vector) {
  // Yeah, I know this is weird, but this way it's aligned with the direction angle
  let uAngle = Math.atan2(target.x - center.x, center.y - target.y)
  uAngle += Math.PI * 2
  uAngle %= Math.PI * 2
  return uAngle
}
