import * as ECSA from '../libs/pixi-component'
import GameUnit from './game-unit'
import GameBonus from './game-bonus'
import { GameState } from './constants'
import { Rectangle, Circle, testCircleRectangleCollision, testCircleCircleCollision, calculateDistance } from './utils/collisions'
import { randomInt } from './utils/random'
import * as Info from './info'
import { calculateAngleFromDirection, calculateUnitAngle } from './direction'

export default class GameModel {
  state = GameState.DEFAULT

  player: GameUnit
  enemies: GameUnit[]
  obstacles: Rectangle[]
  bonuses: GameBonus[]

  initialize() {
    this.state = GameState.GAME
    this.player = new GameUnit(new ECSA.Vector(100, 100))
    this.enemies = [
      new GameUnit(new ECSA.Vector(Info.WIDTH - 100, 100)),
      new GameUnit(new ECSA.Vector(Info.WIDTH - 100, Info.HEIGHT - 100)),
      new GameUnit(new ECSA.Vector(100, Info.HEIGHT - 100)),
    ]

    const unitCircles = this.getOtherUnits(null).map(u => new Circle(u.pos.x, u.pos.y, u.radius))

    this.obstacles = []
    while (this.obstacles.length < 20) {
      const obstacle = new Rectangle(
        randomInt(30, Info.WIDTH - 230),
        randomInt(30, Info.HEIGHT - 230),
        randomInt(100, 200),
        randomInt(100, 200)
      )
      if (!unitCircles.some(c => testCircleRectangleCollision(c, obstacle))) {
        this.obstacles.push(obstacle)
      }
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

  getUnitById(id: number) {
    if (this.player.id === id) {
      return this.player
    }
    return this.enemies.find(u => u.id === id)
  }

  getOtherUnits(unit: GameUnit) {
    return (
      this.enemies
      .concat(this.player)
      .filter(u => u !== unit)
    )
  }

  isNotInCollisionWithOtherUnits(unit: GameUnit, pos: ECSA.Vector) {
    const c = new Circle(pos.x, pos.y, unit.radius)
    return !this.getOtherUnits(unit).some(u => testCircleCircleCollision(
      c,
      new Circle(u.pos.x, u.pos.y, u.radius)
    ))
  }

  getCollidingBonus(pos: ECSA.Vector, radius: number) {
    const c = new Circle(pos.x, pos.y, radius)
    const bonus = this.bonuses.find(b => testCircleCircleCollision(
      new Circle(b.pos.x, b.pos.y, b.radius),
      c
    ))
    return bonus || null
  }

  performAttack(unit: GameUnit) {
    const angle = calculateAngleFromDirection(unit.dir)
    const others = this.getOtherUnits(unit)

    others.sort((a, b) => {
      const aDist = calculateDistance(unit.pos.x, unit.pos.y, a.pos.x, a.pos.y)
      const bDist = calculateDistance(unit.pos.x, unit.pos.y, b.pos.x, b.pos.y)
      return aDist - bDist
    })

    for (const u of others) {
      const dist = calculateDistance(unit.pos.x, unit.pos.y, u.pos.x, u.pos.y)
      if (dist >= Info.Warrior.ATTACK_DISTANCE) {
        return null
      }

      // Calculate angle difference
      const uAngle = calculateUnitAngle(unit.pos, u.pos)
      let diff = Math.abs(angle - uAngle)
      if (diff > Math.PI) diff = Math.PI * 2 - diff

      if (diff < Info.Warrior.ATTACK_ANGLE_DIFFERENCE) {
        u.health = Math.max(
          0,
          u.health - randomInt(Info.Warrior.ATTACK_MIN, Info.Warrior.ATTACK_MAX + 1)
        )
        return u
      }
    }

    return null
  }

  killUnit(unit: GameUnit) {
    if (this.player === unit) {
      return GameState.DEFEAT
    }

    const index = this.enemies.findIndex(u => u === unit)
    if (index !== -1) {
      this.enemies.splice(index, 1)
      if (this.enemies.length === 0) {
        return GameState.VICTORY
      }
    }

    return GameState.GAME
  }
}
