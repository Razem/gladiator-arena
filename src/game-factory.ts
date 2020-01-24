import * as ECSA from '../libs/pixi-component'
import { Assets, Names } from './constants'

export default class GameFactory {
  initialize(scene: ECSA.Scene) {
    scene.clearScene()

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
  }
}
