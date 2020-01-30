import * as ECSA from '../../libs/pixi-component'
import GameModel from '../game-model'
import GameUnit from '../game-unit'
import { Circle, testCircleCircleCollision } from './collisions'
import { DIRECTIONS_AMOUNT, directionVectors } from '../direction'

export type GameObject = {
  pos: ECSA.Vector
  radius: number
}

const index = (vector: ECSA.Vector) => `${vector.x.toFixed(0)},${vector.y.toFixed(0)}`

export function pseudoBFS(model: GameModel, unit: GameUnit, target: GameObject) {
  const { radius, pos } = unit
  const targetCircle = new Circle(target.pos.x, target.pos.y, target.radius)

  const start = pos.clone()
  const list = [start]
  const visited: { [key: string]: boolean } = {}
  const parents = new WeakMap<ECSA.Vector, ECSA.Vector>()

  while (list.length > 0) {
    const point = list.shift()
    if (visited[index(point)]) continue
    visited[index(point)] = true

    if (testCircleCircleCollision(new Circle(point.x, point.y, radius), targetCircle)) {
      let res = point
      let parent: ECSA.Vector
      while ((parent = parents.get(res)) !== start) {
        res = parent
      }
      return res
    }

    for (let i = 0; i < DIRECTIONS_AMOUNT; ++i) {
      const dirVector: ECSA.Vector = directionVectors[i]
      const newPoint = point.add(dirVector.multiply(radius))
      if (model.isValidPoisition(newPoint, radius)) {
        parents.set(newPoint, point)
        list.push(newPoint)
      }
    }
  }

  return null
}
