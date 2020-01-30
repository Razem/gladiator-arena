import * as ECSA from '../../libs/pixi-component'
import BaseComponent from './base-component'
import { Attributes, UnitState, GameState, Messages, BonusType, Names, Assets } from '../constants'
import GameUnit from '../game-unit'
import { Direction, directionVectors, calculateAngleFromDirection } from '../direction'
import * as Info from '../info'
import { randomInt } from '../utils/random'
import GameBonus from '../game-bonus'

export default class GameController extends BaseComponent {
  bonusAddedAt: number = null

  onInit() {
    super.onInit()
    this.subscribe(Messages.BONUS_TAKEN, Messages.UNIT_ATTACKED)
  }

  removeBonus(bonusId: number, unitId: number, time: number) {
    const { model, factory } = this

    const unit = model.getUnitById(unitId)
    if (!unit) return

    const bonusIndex = model.bonuses.findIndex(b => b.id === bonusId)
    if (bonusIndex === -1) return

    // Remove component
    factory.removeBonus(model.bonuses[bonusIndex])

    // Activate bonus
    unit.activateBonus(model.bonuses[bonusIndex].type, time)

    // Remove actual bonus object
    model.bonuses.splice(bonusIndex, 1)
  }

  performAttack(unitId: number) {
    const { model, factory, scene } = this

    const unit = model.getUnitById(unitId)
    if (!unit) return

    const target = model.performAttack(unit)
    if (target) {
      if (target.health === 0) {
        const state = model.killUnit(target)
        if (state === GameState.VICTORY || state === GameState.DEFEAT) {
          model.state = state
          scene.invokeWithDelay(0, () => factory.initialize())
        }
        else {
          scene
          .findObjectByName(Names.LAYER_CHARACTERS)
          .removeChild(
            scene.findObjectByName(Names.ENEMY + target.id)
          )
        }
        this.spawnBonus(new GameBonus(target.pos.clone(), BonusType.REGENERATION))
        this.sendMessage(Messages.UNIT_DIED)
      }
    }
  }

  onMessage(msg: ECSA.Message) {
    switch (msg.action) {
      case Messages.BONUS_TAKEN:
        this.removeBonus(
          msg.data.bonusId as number,
          msg.data.unitId as number,
          msg.data.time as number
        )
        break
      case Messages.UNIT_ATTACKED:
        this.performAttack(msg.data.unitId as number)
        break
    }
  }

  spawnBonus(bonus: GameBonus) {
    const { model } = this
    model.bonuses.push(bonus)
    this.factory.spawnBonus(bonus)
  }

  onUpdate(delta: number, absolute: number) {
    const { model } = this

    if (this.bonusAddedAt === null) {
      this.bonusAddedAt = absolute
    }
    else if (
      model.bonuses.length < Info.Bonus.MAX_AMOUNT
      && this.bonusAddedAt + Info.Bonus.SPAWN_COOLDOWN < absolute
    ) {
      this.bonusAddedAt = absolute

      let pos: ECSA.Vector
      do {
        pos = new ECSA.Vector(
          randomInt(100, Info.WIDTH - 100),
          randomInt(100, Info.HEIGHT - 100)
        )
      } while (
        !model.isValidPoisition(pos, Info.Bonus.RADIUS)
        || !!model.getCollidingBonus(pos, Info.Bonus.RADIUS)
      )

      const bonus = new GameBonus(pos, randomInt(0, Info.Bonus.TYPES))
      this.spawnBonus(bonus)
    }
  }
}
