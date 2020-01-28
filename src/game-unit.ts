import * as ECSA from '../libs/pixi-component'
import { UnitState, BonusType } from './constants'
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
  actionEndsAt = 0

  activeBonus: BonusType = null
  bonusEndsAt = 0

  constructor(pos: ECSA.Vector) {
    this.id = GameUnit.idCounter++
    this.pos = pos
  }

  deactivateBonus() {
    if (this.activeBonus !== null) {
      switch (this.activeBonus) {
        case BonusType.SPEED_BOOST:
          this.speed = Info.Warrior.SPEED
          break
      }

      this.activeBonus = null
    }
  }

  activateBonus(bonus: BonusType, time: number) {
    this.deactivateBonus()

    this.activeBonus = bonus
    this.bonusEndsAt = time + Info.Bonus.EFFECT_COOLDOWN

    switch (bonus) {
      case BonusType.SPEED_BOOST:
        this.speed = Info.Warrior.BONUS_SPEED
        break
    }
  }
}
