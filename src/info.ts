import { BonusType } from './constants'

export const WIDTH = 1920
export const HEIGHT = 1080

export module Warrior {
  export const ANCHOR: [number, number] = [0.34, 0.65]
  export const ATTACK_ANCHOR: [number, number] = [0.34, 0.83]
  export const RADIUS = 30

  export const FRAMES = 5
  export const DEFAULT_FRAME = 0
  export const ATTACK_FRAME = 6

  export const ATTACK_COOLDOWN = 500
  export const BONUS_ATTACK_COOLDOWN = 100
  export const ATTACK_DISTANCE = 150
  export const ATTACK_ANGLE_DIFFERENCE = Math.PI * 0.25
  export const ATTACK_MIN = 4
  export const ATTACK_MAX = 6

  export const SPEED = 150
  export const BONUS_SPEED = 250

  export const MAX_HEALTH = 100
  export const BONUS_HEALTH = 25
}

export module Bonus {
  export const RADIUS = 20
  export const INNER_RADIUS = 15
  export const OPACITY = 0.3
  export const INNER_OPACITY = 0.4

  export const MAX_AMOUNT = 10

  export const EFFECT_COOLDOWN = 10e3
  export const SPAWN_COOLDOWN = 5e3

  export const TYPES = 3
  export const colors = {
    [BonusType.SPEED_BOOST]: 0xaa00aa,
    [BonusType.FAST_ATTACK]: 0xff0000,
    [BonusType.REGENERATION]: 0x00cc00,
  }
}
