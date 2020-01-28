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
  GAME_BONUS = 'attr_game_bonus',
}

export enum Names {
  LAYER_BACKGROUND = 'layer_background',
  LAYER_ENVIRONMENT = 'layer_environments',
  LAYER_BONUSES = 'layer_bonuses',
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

export enum BonusType {
  SPEED_BOOST,
  FAST_ATTACK,
}

export enum Messages {
  BONUS_TAKEN = 'bonus_taken',
}
