import * as ECSA from '../../libs/pixi-component'
import BaseComponent from './base-component'
import { Attributes, UnitState, GameState, Messages } from '../constants'
import GameUnit from '../game-unit'
import { Direction, directionVectors, calculateAngleFromDirection } from '../direction'
import * as Info from '../info'
import UnitController from './unit-controller'

export default class PlayerController extends UnitController {
  onUpdate(delta: number, absolute: number) {
    const { model, unit, scene } = this
    if (model.state !== GameState.GAME) {
      return
    }

    const cmp = scene.stage.findComponentByName<ECSA.KeyInputComponent>(
      ECSA.KeyInputComponent.name
    )
    const cmpKey = <ECSA.KeyInputComponent><any>cmp
    const { state } = unit

    if (state === UnitState.STANDING || state === UnitState.WALKING) {
      const up = cmpKey.isKeyPressed(ECSA.Keys.KEY_UP)
      const right = cmpKey.isKeyPressed(ECSA.Keys.KEY_RIGHT)
      const down = cmpKey.isKeyPressed(ECSA.Keys.KEY_DOWN)
      const left = cmpKey.isKeyPressed(ECSA.Keys.KEY_LEFT)

      let selectedDirection = true
      if (up && right) {
        unit.dir = Direction.UP_RIGHT
      }
      else if (down && right) {
        unit.dir = Direction.DOWN_RIGHT
      }
      else if (down && left) {
        unit.dir = Direction.DOWN_LEFT
      }
      else if (up && left) {
        unit.dir = Direction.UP_LEFT
      }
      else if (left) {
        unit.dir = Direction.LEFT
      }
      else if (right) {
        unit.dir = Direction.RIGHT
      }
      else if (up) {
        unit.dir = Direction.UP
      }
      else if (down) {
        unit.dir = Direction.DOWN
      }
      else {
        selectedDirection = false
      }

      if (cmpKey.isKeyPressed(ECSA.Keys.KEY_SPACE)) {
        if (unit.attack(absolute)) {
          this.sendMessage(Messages.UNIT_ATTACKED, {
            unitId: unit.id,
          })
        }
      }
      else {
        unit.state = selectedDirection ? UnitState.WALKING : UnitState.STANDING
      }
    }

    super.onUpdate(delta, absolute)
  }
}
