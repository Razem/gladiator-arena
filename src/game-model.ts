import * as ECSA from '../libs/pixi-component'
import GameUnit from './game-unit'
import GameBonus from './game-bonus'
import { GameState } from './constants'
import { Rectangle, Circle, testCircleRectangleCollision, testCircleCircleCollision } from './utils/collisions'
import { randomInt } from './utils/random'
import * as Info from './info'

export default class GameModel {
  state: GameState
  player: GameUnit
  enemies: GameUnit[]
  obstacles: Rectangle[]
  bonuses: GameBonus[]

  initialize() {
    this.state = GameState.DEFAULT
    this.player = new GameUnit(new ECSA.Vector(100, 100))
    this.enemies = [
      new GameUnit(new ECSA.Vector(Info.WIDTH - 100, 100)),
      new GameUnit(new ECSA.Vector(Info.WIDTH - 100, Info.HEIGHT - 100)),
      new GameUnit(new ECSA.Vector(100, Info.HEIGHT - 100)),
    ]

    this.obstacles = []
    for (let i = 0; i < 20; ++i) {
      this.obstacles.push(new Rectangle(
        randomInt(30, Info.WIDTH - 230),
        randomInt(30, Info.HEIGHT - 230),
        randomInt(100, 200),
        randomInt(100, 200)
      ))
    }

    this.bonuses = []
  }

  isValidPoisition(pos: ECSA.Vector, radius: number) {
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

  isNotInCollisionWithOtherUnits(unit: GameUnit, pos: ECSA.Vector) {
    const c = new Circle(pos.x, pos.y, unit.radius)
    return !(
      this.enemies
      .concat(this.player)
      .some(u => (
        u !== unit
        && testCircleCircleCollision(
          c,
          new Circle(u.pos.x, u.pos.y, u.radius)
        )
      ))
    )
  }

  getCollidingBonus(pos: ECSA.Vector, radius: number) {
    const c = new Circle(pos.x, pos.y, radius)
    const bonus = this.bonuses.find(b => testCircleCircleCollision(
      new Circle(b.pos.x, b.pos.y, b.radius),
      c
    ))
    return bonus || null
  }
}
