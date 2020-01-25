import * as ECSA from '../../libs/pixi-component'
import BaseComponent from './base-component'
import { Attributes, UnitState, GameState, Messages } from '../constants'
import GameUnit from '../game-unit'
import { Direction, directionVectors } from '../direction'

export class PlayerController extends BaseComponent {
  get unit() {
    return this.owner.getAttribute(Attributes.GAME_UNIT) as GameUnit
  }

  onInit() {
    super.onInit()
    // this.subscribe(Messages.)
  }

  onMessage(msg: ECSA.Message) {

  }

  protected followDirection(direction: Direction, delta: number): boolean {
    if (this.model.state !== GameState.DEFAULT) {
      return false
    }

    this.unit.dir = direction

    const newPos = this.unit.pos.add(
      directionVectors[direction]
      .multiply(delta / 1000)
      .multiply(this.unit.speed)
    )

    if (newPos.x < 0 || newPos.x >= 1920 || newPos.y < 0 || newPos.y >= 1080) {
      return false
    }

    this.unit.state = UnitState.WALKING
    this.unit.pos = newPos

    this.owner.position.x = newPos.x
    this.owner.position.y = newPos.y

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

    return true
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
      this.unit.state = UnitState.STANDING

      const up = cmpKey.isKeyPressed(ECSA.Keys.KEY_UP)
      const right = cmpKey.isKeyPressed(ECSA.Keys.KEY_RIGHT)
      const down = cmpKey.isKeyPressed(ECSA.Keys.KEY_DOWN)
      const left = cmpKey.isKeyPressed(ECSA.Keys.KEY_LEFT)

      if (up && right) {
        this.followDirection(Direction.UP_RIGHT, delta)
      }
      else if (down && right) {
        this.followDirection(Direction.DOWN_RIGHT, delta)
      }
      else if (down && left) {
        this.followDirection(Direction.DOWN_LEFT, delta)
      }
      else if (up && left) {
        this.followDirection(Direction.UP_LEFT, delta)
      }
      else if (left) {
        this.followDirection(Direction.LEFT, delta)
      }
      else if (right) {
        this.followDirection(Direction.RIGHT, delta)
      }
      else if (up) {
        this.followDirection(Direction.UP, delta)
      }
      else if (down) {
        this.followDirection(Direction.DOWN, delta)
      }
    }
  }
}
