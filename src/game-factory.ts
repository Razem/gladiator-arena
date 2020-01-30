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
import { soundComponent } from './components/sound-component'
import GameBonus from './game-bonus'

export default class GameFactory {
  constructor(
    private scene: ECSA.Scene,
    private model: GameModel,
    private resources: PIXI.IResourceDictionary
  ) {}

  initializeCommon() {
    const { scene, model } = this

    scene.clearScene()

    scene.assignGlobalAttribute(Attributes.FACTORY, this)
    scene.assignGlobalAttribute(Attributes.MODEL, model)

    scene.addGlobalComponent(new ECSA.KeyInputComponent())

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

    return backgroundLayer
  }

  initialize() {
    const { scene, model } = this
    const backgroundLayer = this.initializeCommon()
    const builder = new ECSA.Builder(scene)

    scene.addGlobalComponent(new MenuController())

    this.writeHeadingAndText(
      builder,
      backgroundLayer,
      'Press ENTER to start the game'
    )

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

      this.writeCenterText(builder, backgroundLayer, text, color)
    }
  }

  initializeNextLevel() {
    const { scene, model } = this
    const backgroundLayer = this.initializeCommon()
    const builder = new ECSA.Builder(scene)

    scene.addGlobalComponent(new MenuController())

    this.writeHeadingAndText(
      builder,
      backgroundLayer,
      'Press ENTER to continue to the next level'
    )

    this.writeCenterText(
      builder,
      backgroundLayer,
      `LEVEL ${model.level - 1} DONE!`
    )
  }

  writeHeadingAndText(builder: ECSA.Builder, backgroundLayer: ECSA.Container, text: string) {
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
    .asText('', text, new PIXI.TextStyle({
      fontFamily: 'Helvetica',
      fontSize: 50,
      fontWeight: 'bold',
      fill: 'white',
    }))
    .anchor(0.5, 0.5)
    .globalPos(Info.WIDTH / 2, 3 * Info.HEIGHT / 4)
    .withParent(backgroundLayer)
    .build()
  }

  writeCenterText(
    builder: ECSA.Builder,
    backgroundLayer: ECSA.Container,
    text: string,
    color: string = 'white'
  ) {
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

  initializeGame() {
    const { scene, model } = this

    model.initialize()
    this.initializeCommon()

    scene.addGlobalComponent(new GameController())
    scene.addGlobalComponent(soundComponent())

    const builder = new ECSA.Builder(scene)

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

  spawnBonus(bonus: GameBonus) {
    const { scene } = this

    const comp = (
      new ECSA.Builder(scene)
      .withAttribute(Attributes.GAME_BONUS, bonus)
      .globalPos(bonus.pos)
      .anchor(...Info.Warrior.ANCHOR)
      .asGraphics(Names.BONUS + bonus.id)
      .withParent(scene.findObjectByName(Names.LAYER_BONUSES))
      .build()
      .asGraphics()
    )

    comp
    .beginFill(Info.Bonus.colors[bonus.type], Info.Bonus.OPACITY)
    .drawCircle(0, 0, Info.Bonus.RADIUS)
    .endFill()
    .beginFill(Info.Bonus.colors[bonus.type], Info.Bonus.INNER_OPACITY)
    .drawCircle(0, 0, Info.Bonus.INNER_RADIUS)
    .endFill()

    return comp
  }

  removeBonus(bonus: GameBonus) {
    const { scene } = this

    const bonusComponent = scene.findObjectByName(Names.BONUS + bonus.id)
    if (bonusComponent) {
      scene
      .findObjectByName(Names.LAYER_BONUSES)
      .removeChild(bonusComponent)
    }
  }

  spawnHealthbar() {
    const { scene } = this
    return (
      new ECSA.Builder(scene)
      .asGraphics()
      .withParent(scene.stage)
      .build()
      .asGraphics()
    )
  }

  removeHealthbar(graphics: ECSA.Graphics) {
    this.scene.stage.removeChild(graphics)
  }
}
