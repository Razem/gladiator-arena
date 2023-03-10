import * as ECSA from '../libs/pixi-component'
import { UnitState, BonusType } from './constants'
import { Direction } from './direction'
import * as Info from './info'

export default class GameUnit {
  static idCounter = 0

  id: number
  pos: ECSA.Vector
  radius = Info.Warrior.RADIUS
  dir = Direction.UP
  state = UnitState.STANDING
  speed = Info.Warrior.SPEED
  health = Info.Warrior.MAX_HEALTH
  attackCooldown = Info.Warrior.ATTACK_COOLDOWN
  attackEndsAt = 0

  bonuses = new Map<BonusType, number>()

  constructor(pos: ECSA.Vector) {
    this.id = GameUnit.idCounter++
    this.pos = pos
  }

  deactivateBonuses(time: number) {
    const { bonuses } = this

    for (const [bonus, end] of bonuses.entries()) {
      if (end >= time) continue

      switch (bonus) {
        case BonusType.SPEED_BOOST:
          this.speed = Info.Warrior.SPEED
          break
        case BonusType.FAST_ATTACK:
          this.attackCooldown = Info.Warrior.ATTACK_COOLDOWN
          break
      }

      bonuses.delete(bonus)
    }
  }

  activateBonus(bonus: BonusType, time: number) {
    this.bonuses.set(bonus, time + Info.Bonus.EFFECT_COOLDOWN)

    switch (bonus) {
      case BonusType.SPEED_BOOST:
        this.speed = Info.Warrior.BONUS_SPEED
        break
      case BonusType.FAST_ATTACK:
        this.attackCooldown = Info.Warrior.BONUS_ATTACK_COOLDOWN
        break
      case BonusType.REGENERATION:
        this.health = Math.min(Info.Warrior.MAX_HEALTH, this.health + Info.Warrior.BONUS_HEALTH)
        break
    }
  }

  attack(time: number) {
    if (this.state === UnitState.STANDING || this.state === UnitState.WALKING) {
      this.state = UnitState.ATTACKING
      this.attackEndsAt = time + this.attackCooldown
      return true
    }
    return false
  }
}
