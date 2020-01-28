import * as ECSA from '../../libs/pixi-component'
import BaseComponent from './base-component'
import { Attributes, UnitState, GameState, Messages } from '../constants'
import GameUnit from '../game-unit'
import { Direction, directionVectors, calculateAngleFromDirection, calculateUnitAngle, calculateDirectionFromAngle } from '../direction'
import * as Info from '../info'
import UnitController from './unit-controller'
import { calculateDistance } from '../utils/collisions'

export default class EnemyController extends UnitController {
  onUpdate(delta: number, absolute: number) {
    const { unit, model } = this

    const angle = calculateUnitAngle(unit.pos, model.player.pos)
    unit.dir = calculateDirectionFromAngle(angle)

    const dist = calculateDistance(
      unit.pos.x, unit.pos.y,
      model.player.pos.x, model.player.pos.y
    )
    if (dist < Info.Warrior.ATTACK_DISTANCE) {
      if (unit.attack(absolute)) {
        this.sendMessage(Messages.UNIT_ATTACKED, {
          unitId: unit.id,
        })
      }
    }

    super.onUpdate(delta, absolute)
  }
}
