import * as ECSA from '../../libs/pixi-component'
import BaseComponent from './base-component'
import { Attributes, UnitState, GameState, Messages } from '../constants'
import GameUnit from '../game-unit'
import { Direction, directionVectors, calculateAngleFromDirection } from '../direction'
import * as Info from '../info'
import UnitController from './unit-controller'

export default class PlayerController extends UnitController {
  onUpdate(delta: number, absolute: number) {
    const cmp = this.scene.stage.findComponentByName<ECSA.KeyInputComponent>(
      ECSA.KeyInputComponent.name
    )
    const cmpKey = <ECSA.KeyInputComponent><any>cmp
    const state = this.unit.state

    if (state === UnitState.STANDING || state === UnitState.WALKING) {
      if (cmpKey.isKeyPressed(ECSA.Keys.KEY_SPACE)) {
        if (this.unit.attack(absolute)) {
          this.sendMessage(Messages.UNIT_ATTACKED, {
            unitId: this.unit.id,
          })
        }
      }
      else {
        this.unit.state = UnitState.WALKING

        const up = cmpKey.isKeyPressed(ECSA.Keys.KEY_UP)
        const right = cmpKey.isKeyPressed(ECSA.Keys.KEY_RIGHT)
        const down = cmpKey.isKeyPressed(ECSA.Keys.KEY_DOWN)
        const left = cmpKey.isKeyPressed(ECSA.Keys.KEY_LEFT)

        if (up && right) {
          this.unit.dir = Direction.UP_RIGHT
        }
        else if (down && right) {
          this.unit.dir = Direction.DOWN_RIGHT
        }
        else if (down && left) {
          this.unit.dir = Direction.DOWN_LEFT
        }
        else if (up && left) {
          this.unit.dir = Direction.UP_LEFT
        }
        else if (left) {
          this.unit.dir = Direction.LEFT
        }
        else if (right) {
          this.unit.dir = Direction.RIGHT
        }
        else if (up) {
          this.unit.dir = Direction.UP
        }
        else if (down) {
          this.unit.dir = Direction.DOWN
        }
        else {
          this.unit.state = UnitState.STANDING
        }
      }
    }

    super.onUpdate(delta, absolute)
  }
}
