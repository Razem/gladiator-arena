import * as ECSA from '../../libs/pixi-component'
import BaseComponent from './base-component'
import { Attributes, UnitState, GameState, Messages, Info } from '../constants'
import GameUnit from '../game-unit'
import { Direction, directionVectors } from '../direction'

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

    owner.anchor.set(...Info.Warrior.ANCHOR)
    if (unit.state === UnitState.STANDING) {
      owner.texture = textures[framePrefix + Info.Warrior.ATTACK_FRAME]
      owner.anchor.set(...Info.Warrior.ATTACK_ANCHOR)
    }
    else if (unit.state === UnitState.WALKING) {
      const duration = 500
      const frame = Math.floor((absolute % duration) / (duration / Info.Warrior.FRAMES))
      owner.texture = textures[framePrefix + frame]
    }

    owner.rotation = 2 * Math.PI * unit.dir / 8

    if (this.unit.state === UnitState.WALKING) {
      const newPos = this.unit.pos.add(
        directionVectors[unit.dir]
        .multiply(delta / 1000)
        .multiply(this.unit.speed)
      )

      if (newPos.x < 0 || newPos.x >= Info.WIDTH || newPos.y < 0 || newPos.y >= Info.HEIGHT) {
        return
      }

      this.unit.pos = newPos

      this.owner.position.x = newPos.x
      this.owner.position.y = newPos.y
    }

    // let newPos = new ECSA.Vector(x, y);
    // this.unit.state = UnitState.WALKING;
    // this.unit.dir = direction;
    // // execute walk anim
    // if (this.currentWalkAnim) {
    //   this.currentWalkAnim.finish();
    //   this.currentWalkAnim = null;
    // }
    // this.owner.addComponent(new ECSA.ChainComponent()
    //   .execute(() => this.currentWalkAnim = new PacmanWalkAnim(this.unit.pos, direction, this.model.isSomethingEatable(newPos), 150))
    //   .addComponentAndWait(() => this.currentWalkAnim)
    //   .execute(() => {
    //     if (this.unit.state === UnitState.WALKING) {
    //       this.confirmPositionChange(direction);

    //       // check tunnel
    //       if (this.unit.pos.equals(this.model.easternTunnelPos)) {
    //         this.unit.pos = this.model.westernTunnelPos.clone();
    //         this.followDirection(Direction.LEFT);
    //       } else if (this.unit.pos.equals(this.model.westernTunnelPos)) {
    //         this.unit.pos = this.model.easternTunnelPos.clone();
    //         this.followDirection(Direction.DOWN);
    //       }

    //       if (this.isRunning) {
    //         this.onUpdate(0, 0); // parameters are not used here
    //       }
    //     }
    //   }), true);
  }

  private confirmPositionChange(direction: Direction) {
    // // confirm position change
    // this.unit.state = UnitState.STANDING;
    // this.unit.dir = direction;
    // this.unit.makeStep();
    // let pos = mapToWorld(this.unit.pos.x, this.unit.pos.y);
    // this.owner.pixiObj.position.set(pos.x, pos.y);

    // let func = this.model.map.getTile(this.unit.pos.x, this.unit.pos.y).specialFunction;
    // if (func === SpecFunctions.PELLET) {
    //   if (this.model.eatPellet(this.unit.pos)) {
    //     this.sendMessage(Messages.BONUS_TAKEN, this.unit.pos);
    //   }
    // } else if (func === SpecFunctions.PACDOT) {
    //   // todo check if the pacdot hasn't been eaten already
    //   if (this.model.eatPacDot(this.unit.pos)) {
    //     this.sendMessage(Messages.PACDOT_EATEN, this.unit.pos);
    //   }
    // }

    // if (this.model.keyPos.x === this.unit.pos.x && this.model.keyPos.y === this.unit.pos.y) {
    //   this.model.fetchKey();
    //   this.sendMessage(Messages.KEY_FETCHED);
    // }
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

    super.onUpdate(delta, absolute)
  }
}
