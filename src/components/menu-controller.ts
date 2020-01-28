import * as ECSA from '../../libs/pixi-component'
import BaseComponent from './base-component'
import { GameState } from '../constants'

export default class MenuController extends BaseComponent {
  onUpdate(delta: number, absolute: number) {
    const cmp = this.scene.stage.findComponentByName<ECSA.KeyInputComponent>(
      ECSA.KeyInputComponent.name
    )
    const cmpKey = <ECSA.KeyInputComponent><any>cmp

    if (cmpKey.isKeyPressed(ECSA.Keys.KEY_ENTER)) {
      this.model.state = GameState.GAME
      this.scene.invokeWithDelay(0, () => this.factory.initializeGame())
    }
  }
}
