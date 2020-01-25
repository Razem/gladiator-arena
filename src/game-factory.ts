import * as ECSA from '../libs/pixi-component'
import { Assets, Attributes, Names, UnitState, Info } from './constants'
import GameModel from './game-model'
import { PlayerKeyController } from './components/player-controller'
import GameUnit from './game-unit'
import { Direction } from './direction'

export default class GameFactory {
  initialize(scene: ECSA.Scene, model: GameModel, resources: PIXI.IResourceDictionary) {
    scene.clearScene()
    model.initialize()

    scene.assignGlobalAttribute(Attributes.FACTORY, this)
    scene.assignGlobalAttribute(Attributes.MODEL, model)

    scene.addGlobalComponent(new ECSA.KeyInputComponent())

    console.log(scene.stage.width)

    const builder = new ECSA.Builder(scene)

    const backgroundLayer = (
      builder
      .withParent(scene.stage)
      .asContainer(Names.LAYER_BACKGROUND)
      .build()
    )

    builder
    .withParent(scene.stage)
    .asContainer(Names.LAYER_CHARACTERS)
    .build()

    builder
    .asSprite(PIXI.Texture.from(Assets.BACKGROUND), Names.BACKGROUND)
    .withParent(backgroundLayer)
    .build()

    this.spawnPlayer(scene, model, resources)
  }

  spawnPlayer(scene: ECSA.Scene, model: GameModel, resources: PIXI.IResourceDictionary) {
    // const animation = new PIXI.AnimatedSprite(
    //   resources[Assets.WARRIOR_BLUE].spritesheet.animations['warrior']
    // )
    // animation.animationSpeed = 1 / 7
    // animation.loop = true
    // animation.play()

    const { textures } = resources[Assets.WARRIOR_BLUE]
    let counter = 0

    const player = (
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

    // player.addChild(animation)
    // player.removeChild(animation)
  }
}
