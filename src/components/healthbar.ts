import * as ECSA from '../../libs/pixi-component'
import BaseComponent from './base-component'
import { Attributes } from '../constants'
import GameUnit from '../game-unit'
import * as Info from '../info'

export default class Healtbar extends BaseComponent {
  get unit() {
    return this.owner.getAttribute(Attributes.GAME_UNIT) as GameUnit
  }

  graphics: ECSA.Graphics

  onInit() {
    const { scene } = this

    this.graphics = (
      new ECSA.Builder(scene)
      .asGraphics()
      .withParent(scene.stage)
      .build()
      .asGraphics()
    )
  }

  onRemove() {
    this.scene.stage.removeChild(this.graphics)
  }

  onUpdate(delta: number, absolute: number) {
    const { unit, graphics } = this
    const width = 100
    const height = 10
    const opacity = 0.7

    graphics.position.set(
      Math.max(0, unit.pos.x - width / 2),
      Math.max(0, unit.pos.y - 60)
    )

    const health = unit.health / Info.Warrior.MAX_HEALTH * width

    graphics
    .clear()
    .beginFill(0xff0000, opacity)
    .drawRect(health, 0, width - health, height)
    .endFill()
    .beginFill(0x00ff00, opacity)
    .drawRect(0, 0, health, height)
    .endFill()
  }
}
