import * as ECSA from '../libs/pixi-component'
import { Assets, Attributes, Names, UnitState } from './constants'
import GameModel from './game-model'
import { PlayerKeyController } from './components/player-controller'
import GameUnit from './game-unit'
import { Direction } from './direction'
import * as Info from './info'

export default class GameFactory {
  initialize(scene: ECSA.Scene, model: GameModel, resources: PIXI.IResourceDictionary) {
    scene.clearScene()
    model.initialize()

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
    .withParent(scene.stage)
    .asContainer(Names.LAYER_ENVIRONMENT)
    .build()

    builder
    .withParent(scene.stage)
    .asContainer(Names.LAYER_CHARACTERS)
    .build()

    builder
    .asSprite(PIXI.Texture.from(Assets.BACKGROUND), Names.BACKGROUND)
    .withParent(backgroundLayer)
    .build()

    this.spawnObstacles(scene, model)

    this.spawnPlayer(scene, model, resources)
  }

  spawnObstacles(scene: ECSA.Scene, model: GameModel) {
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

  spawnPlayer(scene: ECSA.Scene, model: GameModel, resources: PIXI.IResourceDictionary) {
    const { textures } = resources[Assets.WARRIOR_BLUE]

    return (
      new ECSA.Builder(scene)
      .withAttribute(Attributes.GAME_UNIT, model.player)
      .globalPos(model.player.pos)
      .anchor(...Info.Warrior.ANCHOR)
      .withComponent(new PlayerKeyController(textures, Assets.WARRIOR_BLUE_FRAME_PREFIX))
      .asSprite(
        textures[Assets.WARRIOR_BLUE_FRAME_PREFIX + Info.Warrior.DEFAULT_FRAME],
        Names.PLAYER
      )
      .withParent(scene.findObjectByName(Names.LAYER_CHARACTERS))
      .build()
    )
  }
}
