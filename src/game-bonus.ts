import * as ECSA from '../libs/pixi-component'
import { BonusType } from './constants'
import * as Info from './info'

export default class GameBonus {
  static idCounter = 0

  id: number
  radius = Info.Bonus.RADIUS

  constructor(public pos: ECSA.Vector, public type: BonusType) {
    this.id = GameBonus.idCounter++
  }
}
