import * as ECSA from '../libs/pixi-component'
import { Assets, Attributes, Names, UnitState, GameState } from './constants'
import GameModel from './game-model'
import PlayerController from './components/player-controller'
import GameUnit from './game-unit'
import { Direction } from './direction'
import * as Info from './info'
import GameController from './components/game-controller'
import MenuController from './components/menu-controller'
import Healthbar from './components/healthbar'
import EnemyController from './components/enemy-controller'

export default class GameFactory {
  constructor(
    private scene: ECSA.Scene,
    private model: GameModel,
    private resources: PIXI.IResourceDictionary
  ) {}

  initialize() {
    const { scene, model } = this

    scene.clearScene()

    scene.assignGlobalAttribute(Attributes.FACTORY, this)
    scene.assignGlobalAttribute(Attributes.MODEL, model)

    scene.addGlobalComponent(new ECSA.KeyInputComponent())
    scene.addGlobalComponent(new MenuController())

    const builder = new ECSA.Builder(scene)

    const backgroundLayer = (
      builder
      .withParent(scene.stage)
      .asContainer(Names.LAYER_BACKGROUND)
      .build()
    )

    builder
    .asSprite(PIXI.Texture.from(Assets.BACKGROUND), Names.BACKGROUND)
    .withParent(backgroundLayer)
    .build()

    builder
    .asText('', 'Gladiator Arena', new PIXI.TextStyle({
      fontFamily: 'Helvetica',
      fontSize: 200,
      fontWeight: 'bold',
      fill: 'white',
      dropShadow: true,
      dropShadowAngle: 45,
      dropShadowBlur: 0.5,
      dropShadowDistance: 5,
    }))
    .anchor(0.5, 0.5)
    .globalPos(Info.WIDTH / 2, Info.HEIGHT / 5)
    .withParent(backgroundLayer)
    .build()

    builder
    .asText('', 'Press ENTER to start the game', new PIXI.TextStyle({
      fontFamily: 'Helvetica',
      fontSize: 50,
      fontWeight: 'bold',
      fill: 'white',
    }))
    .anchor(0.5, 0.5)
    .globalPos(Info.WIDTH / 2, 3 * Info.HEIGHT / 4)
    .withParent(backgroundLayer)
    .build()

    builder
    .asText('', 'Move using Arrows | Attack using Spacebar', new PIXI.TextStyle({
      fontFamily: 'Helvetica',
      fontSize: 40,
      fontWeight: 'bold',
      fill: 'white',
    }))
    .anchor(0.5, 0.5)
    .globalPos(Info.WIDTH / 2, 5 * Info.HEIGHT / 6)
    .withParent(backgroundLayer)
    .build()

    if (model.state !== GameState.DEFAULT) {
      let text: string
      let color: string
      if (model.state === GameState.VICTORY) {
        text = 'VICTORY!'
        color = 'green'
      }
      else {
        text = 'DEFEAT!'
        color = 'red'
      }

      builder
      .asText('', text, new PIXI.TextStyle({
        fontFamily: 'Helvetica',
        fontSize: 100,
        fontWeight: 'bold',
        fill: color,
      }))
      .anchor(0.5, 0.5)
      .globalPos(Info.WIDTH / 2, Info.HEIGHT / 2)
      .withParent(backgroundLayer)
      .build()
    }
  }

  initializeGame() {
    const { scene, model } = this

    scene.clearScene()
    model.initialize()

    scene.assignGlobalAttribute(Attributes.FACTORY, this)
    scene.assignGlobalAttribute(Attributes.MODEL, model)

    scene.addGlobalComponent(new ECSA.KeyInputComponent())
    scene.addGlobalComponent(new GameController())

    const builder = new ECSA.Builder(scene)

    const backgroundLayer = (
      builder
      .withParent(scene.stage)
      .asContainer(Names.LAYER_BACKGROUND)
      .build()
    )

    builder
    .withParent(scene.stage)
    .asContainer(Names.LAYER_ENVIRONMENT)
    .build()

    builder
    .withParent(scene.stage)
    .asContainer(Names.LAYER_BONUSES)
    .build()

    builder
    .withParent(scene.stage)
    .asContainer(Names.LAYER_CHARACTERS)
    .build()

    builder
    .asSprite(PIXI.Texture.from(Assets.BACKGROUND), Names.BACKGROUND)
    .withParent(backgroundLayer)
    .build()

    this.spawnObstacles()

    this.spawnEnemies()
    this.spawnPlayer()
  }

  spawnObstacles() {
    const { scene, model } = this

    for (const obstacle of model.obstacles) {
      new ECSA.Builder(scene)
      .globalPos(obstacle.x, obstacle.y)
      .asTilingSprite(
        PIXI.Texture.from(Assets.OBSTACLE),
        obstacle.width,
        obstacle.height
      )
      .withParent(scene.findObjectByName(Names.LAYER_ENVIRONMENT))
      .build()
    }
  }

  spawnPlayer() {
    const { scene, model, resources } = this
    const { textures } = resources[Assets.WARRIOR_BLUE]

    return (
      new ECSA.Builder(scene)
      .withAttribute(Attributes.GAME_UNIT, model.player)
      .globalPos(model.player.pos)
      .anchor(...Info.Warrior.ANCHOR)
      .withComponent(new PlayerController(textures, Assets.WARRIOR_BLUE_FRAME_PREFIX))
      .withComponent(new Healthbar())
      .asSprite(
        textures[Assets.WARRIOR_BLUE_FRAME_PREFIX + Info.Warrior.DEFAULT_FRAME],
        Names.PLAYER
      )
      .withParent(scene.findObjectByName(Names.LAYER_CHARACTERS))
      .build()
    )
  }

  spawnEnemies() {
    const { scene, model, resources } = this
    const { textures } = resources[Assets.WARRIOR_RED]

    for (const enemy of model.enemies) {
      new ECSA.Builder(scene)
      .withAttribute(Attributes.GAME_UNIT, enemy)
      .globalPos(enemy.pos)
      .anchor(...Info.Warrior.ANCHOR)
      .withComponent(new EnemyController(textures, Assets.WARRIOR_RED_FRAME_PREFIX))
      .withComponent(new Healthbar())
      .asSprite(
        textures[Assets.WARRIOR_RED_FRAME_PREFIX + Info.Warrior.DEFAULT_FRAME],
        Names.ENEMY + enemy.id
      )
      .withParent(scene.findObjectByName(Names.LAYER_CHARACTERS))
      .build()
    }
  }
}
