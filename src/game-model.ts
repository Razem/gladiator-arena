import * as ECSA from '../libs/pixi-component'
import GameUnit from './game-unit'
import { GameState } from './constants'

export default class GameModel {
  state: GameState
  player: GameUnit

  initialize() {
    this.state = GameState.DEFAULT
    this.player = new GameUnit(new ECSA.Vector(100, 100))
  }
}
