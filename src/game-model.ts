import * as ECSA from '../libs/pixi-component'
import GameUnit from './game-unit'
import { GameState, Info } from './constants'
import { Rectangle, Circle, testCircleRectangleCollision } from './utils/collisions'
import Random from '../libs/pixi-math/math/random'

export default class GameModel {
  state: GameState
  player: GameUnit
  obstacles: Rectangle[]

  initialize() {
    this.state = GameState.DEFAULT
    this.player = new GameUnit(new ECSA.Vector(100, 100))

    this.obstacles = []
    const rnd = new Random(Date.now())
    for (let i = 0; i < 20; ++i) {
      this.obstacles.push(new Rectangle(
        rnd.uniformInt(30, Info.WIDTH - 230),
        rnd.uniformInt(30, Info.HEIGHT - 230),
        rnd.uniformInt(10, 200),
        rnd.uniformInt(10, 200)
      ))
    }
  }

  canGo(pos: ECSA.Vector) {
    const radius = 30
    if (
      pos.x < radius
      || pos.x >= Info.WIDTH - radius
      || pos.y < radius
      || pos.y >= Info.HEIGHT - radius
    ) {
      return false
    }

    const c = new Circle(pos.x, pos.y, radius)
    return !this.obstacles.some(r => testCircleRectangleCollision(c, r))
  }
}
