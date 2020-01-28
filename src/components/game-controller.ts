import * as ECSA from '../../libs/pixi-component'
import BaseComponent from './base-component'
import { Attributes, UnitState, GameState, Messages, BonusType, Names, Assets } from '../constants'
import GameUnit from '../game-unit'
import { Direction, directionVectors, directionAngle } from '../direction'
import * as Info from '../info'
import Random from '../../libs/pixi-math/math/random'
import GameBonus from '../game-bonus'

export default class GameController extends BaseComponent {
  bonusAddedAt: number = null
  rnd: Random

  constructor() {
    super()
    this.rnd = new Random(Date.now())
  }

  onInit() {
    super.onInit()
    // this.subscribe(Messages.)
  }

  onMessage(msg: ECSA.Message) {

  }

  onUpdate(delta: number, absolute: number) {
    const { rnd, model, scene } = this

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
          rnd.uniformInt(100, Info.WIDTH - 100),
          rnd.uniformInt(100, Info.HEIGHT - 100)
        )
      } while (!model.isValidPoisition(pos, Info.Bonus.RADIUS))

      const bonus = new GameBonus(pos, BonusType.SPEED_BOOST)

      model.bonuses.push(bonus)

      new ECSA.Builder(scene)
      .withAttribute(Attributes.GAME_BONUS, bonus)
      .globalPos(pos)
      .anchor(...Info.Warrior.ANCHOR)
      .asGraphics()
      .withParent(scene.findObjectByName(Names.LAYER_BONUSES))
      .build()
      .asGraphics()
      .beginFill(0x00ff00, 0.5)
      .drawCircle(0, 0, Info.Bonus.RADIUS)
      .endFill()
    }
  }
}
