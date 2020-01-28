import * as ECSA from '../libs/pixi-component'
import { UnitState } from './constants'
import { Direction } from './direction'
import * as Info from './info'

export default class GameUnit {
  static idCounter = 0

  id: number
  pos: ECSA.Vector
  dir = Direction.UP
  state = UnitState.STANDING
  speed = Info.Warrior.SPEED
  radius = Info.Warrior.RADIUS
  actionEnd = 0

  constructor(pos: ECSA.Vector) {
    this.id = GameUnit.idCounter++
    this.pos = pos
  }
}
