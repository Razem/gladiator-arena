import * as ECSA from '../../libs/pixi-component'
import BaseComponent from './base-component'
import { Attributes, UnitState, GameState, Messages } from '../constants'
import GameUnit from '../game-unit'
import { Direction, directionVectors, directionAngle } from '../direction'
import * as Info from '../info'

export class PlayerController extends BaseComponent {
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
    if (this.model.state !== GameState.DEFAULT) {
      return
    }

    const { textures, framePrefix, unit } = this
    const owner = this.owner.asSprite()

    if (unit.state === UnitState.ATTACKING) {
      if (unit.actionEnd < absolute) {
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

    if (this.unit.state === UnitState.WALKING) {
      let newPos = unit.pos.add(
        directionVectors[unit.dir]
        .multiply(delta / 1000)
        .multiply(this.unit.speed)
      )

      if (!this.model.canGo(newPos)) {
        let altPos = new ECSA.Vector(newPos.x, unit.pos.y)
        if (this.model.canGo(altPos)) {
          newPos = altPos
        }
        else {
          altPos = new ECSA.Vector(unit.pos.x, newPos.y)
          if (this.model.canGo(altPos)) {
            newPos = altPos
          }
          else {
            return
          }
        }
      }

      this.unit.pos = newPos

      this.owner.position.x = newPos.x
      this.owner.position.y = newPos.y
    }
  }
}

export class PlayerKeyController extends PlayerController {
  onUpdate(delta: number, absolute: number) {
    const cmp = this.scene.stage.findComponentByName<ECSA.KeyInputComponent>(
      ECSA.KeyInputComponent.name
    )
    const cmpKey = <ECSA.KeyInputComponent><any>cmp
    const state = this.unit.state

    if (state === UnitState.STANDING || state === UnitState.WALKING) {
      if (cmpKey.isKeyPressed(ECSA.Keys.KEY_SPACE)) {
        this.unit.state = UnitState.ATTACKING
        this.unit.actionEnd = absolute + Info.Warrior.ATTACK_COOLDOWN
      }
      else {
        this.unit.state = UnitState.WALKING

        const up = cmpKey.isKeyPressed(ECSA.Keys.KEY_UP)
        const right = cmpKey.isKeyPressed(ECSA.Keys.KEY_RIGHT)
        const down = cmpKey.isKeyPressed(ECSA.Keys.KEY_DOWN)
        const left = cmpKey.isKeyPressed(ECSA.Keys.KEY_LEFT)

        if (up && right) {
          this.unit.dir = Direction.UP_RIGHT
        }
        else if (down && right) {
          this.unit.dir = Direction.DOWN_RIGHT
        }
        else if (down && left) {
          this.unit.dir = Direction.DOWN_LEFT
        }
        else if (up && left) {
          this.unit.dir = Direction.UP_LEFT
        }
        else if (left) {
          this.unit.dir = Direction.LEFT
        }
        else if (right) {
          this.unit.dir = Direction.RIGHT
        }
        else if (up) {
          this.unit.dir = Direction.UP
        }
        else if (down) {
          this.unit.dir = Direction.DOWN
        }
        else {
          this.unit.state = UnitState.STANDING
        }
      }
    }

    super.onUpdate(delta, absolute)
  }
}
