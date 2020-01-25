import * as ECSA from '../libs/pixi-component'

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
  [Direction.UP_RIGHT]: new ECSA.Vector(Math.SQRT1_2, -Math.SQRT1_2),
  [Direction.RIGHT]: new ECSA.Vector(1, 0),
  [Direction.DOWN_RIGHT]: new ECSA.Vector(Math.SQRT1_2, Math.SQRT1_2),
  [Direction.DOWN]: new ECSA.Vector(0, 1),
  [Direction.DOWN_LEFT]: new ECSA.Vector(-Math.SQRT1_2, Math.SQRT1_2),
  [Direction.LEFT]: new ECSA.Vector(-1, 0),
  [Direction.UP_LEFT]: new ECSA.Vector(-Math.SQRT1_2, -Math.SQRT1_2),
}
