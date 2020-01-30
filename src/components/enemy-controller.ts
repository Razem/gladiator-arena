import * as ECSA from '../../libs/pixi-component'
import BaseComponent from './base-component'
import { Attributes, UnitState, GameState, Messages } from '../constants'
import GameUnit from '../game-unit'
import { Direction, directionVectors, calculateAngleFromDirection, calculateUnitAngle, calculateDirectionFromAngle, DIRECTIONS_AMOUNT } from '../direction'
import * as Info from '../info'
import UnitController from './unit-controller'
import { calculateDistance, testCircleCircleCollision } from '../utils/collisions'
import GameModel from '../game-model'
import { Circle } from 'pixi.js'

type GameObject = {
  pos: ECSA.Vector
  radius: number
}

const index = (vector: ECSA.Vector) => `${vector.x.toFixed(0)},${vector.y.toFixed(0)}`
function pseudoBFS(model: GameModel, unit: GameUnit, target: GameObject) {
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
      return calculateDirectionFromAngle(calculateUnitAngle(start, res))
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

  return Direction.UP
}

export default class EnemyController extends UnitController {
  alterationEndsAt = 0

  onUpdate(delta: number, absolute: number) {
    const { unit, model } = this

    if (unit.state === UnitState.STANDING || unit.state === UnitState.WALKING) {
      const target: GameObject = (
        (model.getOtherUnits(unit) as GameObject[])
        .concat(model.bonuses)
        .sort((a, b) => {
          const aDist = calculateDistance(unit.pos.x, unit.pos.y, a.pos.x, a.pos.y)
          const bDist = calculateDistance(unit.pos.x, unit.pos.y, b.pos.x, b.pos.y)
          return aDist - bDist
        })
      )[0]

      unit.state = UnitState.WALKING

      if (target) {
        const dist = calculateDistance(
          unit.pos.x, unit.pos.y,
          target.pos.x, target.pos.y
        )

        if (
          target instanceof GameUnit
          && dist < Info.Warrior.ATTACK_DISTANCE
        ) {
          unit.dir = calculateDirectionFromAngle(calculateUnitAngle(unit.pos, target.pos))
          if (unit.attack(absolute)) {
            this.sendMessage(Messages.UNIT_ATTACKED, {
              unitId: unit.id,
            })
          }
        }
        else if (absolute > this.alterationEndsAt) {
          unit.dir = pseudoBFS(model, unit, target)
          this.alterationEndsAt = absolute + 500
        }
      }
    }

    super.onUpdate(delta, absolute)
  }
}
