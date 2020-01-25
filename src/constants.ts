export enum Assets {
  BACKGROUND = 'background',
  OBSTACLE = 'obstacle',
  WARRIOR_BLUE = 'warrior_blue',
  WARRIOR_BLUE_FRAME_PREFIX = 'warrior-blue-',
  WARRIOR_RED = 'warrior_red',
  WARRIOR_RED_FRAME_PREFIX = 'warrior-red-',
}

export enum Attributes {
  FACTORY = 'attr_factory',
  MODEL = 'attr_model',
  GAME_UNIT = 'attr_game_unit',
}

export enum Names {
  LAYER_BACKGROUND = 'layer_background',
  LAYER_ENVIRONMENT = 'layer_environments',
  LAYER_CHARACTERS = 'layer_characters',
  BACKGROUND = 'background',
  PLAYER = 'player',
  ENEMY = 'enemy',
}

export enum UnitState {
  STANDING = 0,
  WALKING = 1,
  ATTACKING = 2,
  DEAD = 3,
}

export enum GameState {
  DEFAULT = 0,
  GAME_OVER = 1,
}

export enum Messages {

}

export module Info {
  export const WIDTH = 1920
  export const HEIGHT = 1080

  export module Warrior {
    export const ANCHOR: [number, number] = [0.34, 0.65]
    export const ATTACK_ANCHOR: [number, number] = [0.34, 0.83]

    export const FRAMES = 5
    export const DEFAULT_FRAME = 0
    export const ATTACK_FRAME = 6

    export const ATTACK_COOLDOWN = 500
  }
}
