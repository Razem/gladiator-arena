export const WIDTH = 1920
export const HEIGHT = 1080

export module Warrior {
  export const ANCHOR: [number, number] = [0.34, 0.65]
  export const ATTACK_ANCHOR: [number, number] = [0.34, 0.83]
  export const RADIUS = 30
  export const SPEED = 150

  export const FRAMES = 5
  export const DEFAULT_FRAME = 0
  export const ATTACK_FRAME = 6

  export const ATTACK_COOLDOWN = 500
}

export module Bonus {
  export const RADIUS = 20

  export const MAX_AMOUNT = 10

  export const EFFECT_COOLDOWN = 10e3
  export const SPAWN_COOLDOWN = 5e3
}
