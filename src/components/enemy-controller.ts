import * as ECSA from '../../libs/pixi-component'
import BaseComponent from './base-component'
import { Attributes, UnitState, GameState, Messages } from '../constants'
import GameUnit from '../game-unit'
import { Direction, directionVectors, calculateAngleFromDirection, calculateUnitAngle, calculateDirectionFromAngle, DIRECTIONS_AMOUNT } from '../direction'
import * as Info from '../info'
import UnitController from './unit-controller'
import { calculateDistance, testCircleCircleCollision } from '../utils/collisions'
import GameModel from '../game-model'
import { GameObject, pseudoBFS } from '../utils/pathfinding'

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
          const next = pseudoBFS(model, unit, target)
          unit.dir = (
            next
            ? calculateDirectionFromAngle(calculateUnitAngle(unit.pos, next))
            : Direction.UP_RIGHT
          )
          this.alterationEndsAt = absolute + 300
        }
      }
    }

    super.onUpdate(delta, absolute)
  }
}
