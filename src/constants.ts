export enum Assets {
  BACKGROUND = 'background',
  OBSTACLE = 'obstacle',
  WARRIOR_BLUE = 'warrior_blue',
  WARRIOR_BLUE_FRAME_PREFIX = 'warrior-blue-',
  WARRIOR_RED = 'warrior_red',
  WARRIOR_RED_FRAME_PREFIX = 'warrior-red-',
  WILHELM_SCREAM = 'wilhelm_scream',
  AXE_SWING = 'axe_swing',
  BONUS_TAKEN = 'bonus_taken',
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
  BONUS = 'bonus',
}

export enum UnitState {
  STANDING = 0,
  WALKING = 1,
  ATTACKING = 2,
  DEAD = 3,
}

export enum GameState {
  DEFAULT = 0,
  GAME = 1,
  VICTORY = 2,
  DEFEAT = 3,
}

export enum BonusType {
  SPEED_BOOST,
  FAST_ATTACK,
  REGENERATION,
}

export enum Messages {
  BONUS_TAKEN = 'bonus_taken',
  UNIT_ATTACKED = 'unit_attacked',
  UNIT_DIED = 'unit_died',
}
