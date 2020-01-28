import * as ECSA from '../../libs/pixi-component'
import BaseComponent from './base-component'
import { Attributes, UnitState, GameState, Messages } from '../constants'
import GameUnit from '../game-unit'
import { Direction, directionVectors, directionAngle } from '../direction'
import * as Info from '../info'

export default class UnitController extends BaseComponent {
  constructor(private textures: PIXI.ITextureDictionary, private framePrefix: string) {
    super()
  }

  get unit() {
    return this.owner.getAttribute(Attributes.GAME_UNIT) as GameUnit
  }

  onInit() {
    super.onInit()
    // this.subscribe(Messages.)
  }

  onMessage(msg: ECSA.Message) {

  }

  onUpdate(delta: number, absolute: number) {
    if (this.model.state !== GameState.GAME) {
      return
    }

    const { textures, framePrefix, unit, model } = this
    const owner = this.owner.asSprite()

    unit.deactivateBonuses(absolute)

    if (unit.state === UnitState.ATTACKING) {
      if (unit.attackEndsAt < absolute) {
        unit.state = UnitState.STANDING
      }
      else {
        owner.texture = textures[framePrefix + Info.Warrior.ATTACK_FRAME]
        owner.anchor.set(...Info.Warrior.ATTACK_ANCHOR)
      }
    }

    if (unit.state === UnitState.STANDING) {
      owner.texture = textures[framePrefix + Info.Warrior.DEFAULT_FRAME]
      owner.anchor.set(...Info.Warrior.ANCHOR)
    }
    else if (unit.state === UnitState.WALKING) {
      const duration = 700
      const frame = Math.floor((absolute % duration) / (duration / Info.Warrior.FRAMES))
      owner.texture = textures[framePrefix + frame]
      owner.anchor.set(...Info.Warrior.ANCHOR)
    }

    owner.rotation = directionAngle(unit.dir)

    if (unit.state === UnitState.WALKING) {
      let newPos = unit.pos.add(
        directionVectors[unit.dir]
        .multiply(delta / 1000)
        .multiply(unit.speed)
      )

      if (
        !model.isValidPoisition(newPos, unit.radius)
        || !model.isNotInCollisionWithOtherUnits(unit, newPos)
      ) {
        let altPos = new ECSA.Vector(newPos.x, unit.pos.y)
        if (
          model.isValidPoisition(altPos, unit.radius)
          && model.isNotInCollisionWithOtherUnits(unit, altPos)
        ) {
          newPos = altPos
        }
        else {
          altPos = new ECSA.Vector(unit.pos.x, newPos.y)
          if (
            model.isValidPoisition(altPos, unit.radius)
            && model.isNotInCollisionWithOtherUnits(unit, altPos)
          ) {
            newPos = altPos
          }
          else {
            return
          }
        }
      }

      unit.pos = newPos

      owner.position.x = newPos.x
      owner.position.y = newPos.y
    }

    const bonus = model.getCollidingBonus(unit.pos, unit.radius)
    if (bonus !== null) {
      this.sendMessage(Messages.BONUS_TAKEN, {
        bonusId: bonus.id,
        unitId: unit.id,
        time: absolute,
      })
    }
  }
}
