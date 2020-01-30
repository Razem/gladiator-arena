import * as ECSA from '../../libs/pixi-component'
import BaseComponent from './base-component'
import { Attributes, UnitState, GameState, Messages } from '../constants'
import GameUnit from '../game-unit'
import { Direction, directionVectors, calculateAngleFromDirection, calculateUnitAngle, calculateDirectionFromAngle } from '../direction'
import * as Info from '../info'
import UnitController from './unit-controller'
import { calculateDistance } from '../utils/collisions'

type GameObject = {
  pos: ECSA.Vector
}

export default class EnemyController extends UnitController {
  lastDir: Direction = null
  lastPos: ECSA.Vector = null
  posAlterationEndsAt = 0

  onUpdate(delta: number, absolute: number) {
    const { unit, model } = this

    if (unit.state === UnitState.ATTACKING) {
      this.lastPos = null
    }
    else if (unit.state === UnitState.STANDING || unit.state === UnitState.WALKING) {
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
        if (absolute > this.posAlterationEndsAt) {
          const angle = calculateUnitAngle(unit.pos, target.pos)
          unit.dir = calculateDirectionFromAngle(angle)

          if (this.lastPos) {
            if (
              unit.dir === this.lastDir
              && unit.pos.x === this.lastPos.x
              && unit.pos.y === this.lastPos.y
            ) {
              const add = Math.random() < 0.5 ? 1 : 7
              unit.dir = (unit.dir + add) % 8
              this.posAlterationEndsAt = absolute + 1500
            }
          }

          if (absolute > this.posAlterationEndsAt) {
            this.lastPos = unit.pos.clone()
            this.lastDir = unit.dir
          }
          else {
            this.lastPos = null
          }
        }

        const dist = calculateDistance(
          unit.pos.x, unit.pos.y,
          target.pos.x, target.pos.y
        )

        if (
          target instanceof GameUnit
          && dist < Info.Warrior.ATTACK_DISTANCE
        ) {
          if (unit.attack(absolute)) {
            this.sendMessage(Messages.UNIT_ATTACKED, {
              unitId: unit.id,
            })
          }
        }
      }
    }

    super.onUpdate(delta, absolute)
  }
}
