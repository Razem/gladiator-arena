import * as ECSA from '../../libs/pixi-component'
import BaseComponent from './base-component'
import { Attributes, UnitState, GameState, Messages, BonusType, Names, Assets } from '../constants'
import GameUnit from '../game-unit'
import { Direction, directionVectors, directionAngle } from '../direction'
import * as Info from '../info'
import { randomInt } from '../utils/random'
import GameBonus from '../game-bonus'

export default class GameController extends BaseComponent {
  bonusAddedAt: number = null
  bonusComponents: ECSA.Container[]

  onInit() {
    super.onInit()
    this.subscribe(Messages.BONUS_TAKEN, Messages.BONUS_TAKEN)
    this.bonusComponents = []
  }

  removeBonus(bonusId: number, unitId: number, time: number) {
    const { scene, model, bonusComponents } = this

    const unit = model.getUnitById(unitId)
    if (!unit) return

    const bonusIndex = model.bonuses.findIndex(b => b.id === bonusId)
    if (bonusIndex === -1) return

    // Remove component
    const bonusComponentIndex = (
      bonusComponents
      .findIndex(b => (
        (b.getAttribute(Attributes.GAME_BONUS) as GameBonus).id === bonusId
      ))
    )
    if (bonusComponentIndex !== -1) {
      scene
      .findObjectByName(Names.LAYER_BONUSES)
      .removeChild(bonusComponents[bonusComponentIndex])
      bonusComponents.splice(bonusComponentIndex, 1)
    }

    // Activate bonus
    unit.activateBonus(model.bonuses[bonusIndex].type, time)

    // Remove actual bonus object
    model.bonuses.splice(bonusIndex, 1)
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
    }
  }

  onUpdate(delta: number, absolute: number) {
    const { model, scene } = this

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

      model.bonuses.push(bonus)

      const comp = (
        new ECSA.Builder(scene)
        .withAttribute(Attributes.GAME_BONUS, bonus)
        .globalPos(pos)
        .anchor(...Info.Warrior.ANCHOR)
        .asGraphics()
        .withParent(scene.findObjectByName(Names.LAYER_BONUSES))
        .build()
        .asGraphics()
      )

      this.bonusComponents.push(comp)

      comp
      .beginFill(Info.Bonus.colors[bonus.type], Info.Bonus.OPACITY)
      .drawCircle(0, 0, Info.Bonus.RADIUS)
      .endFill()
      .beginFill(Info.Bonus.colors[bonus.type], Info.Bonus.INNER_OPACITY)
      .drawCircle(0, 0, Info.Bonus.INNER_RADIUS)
      .endFill()
    }
  }
}
