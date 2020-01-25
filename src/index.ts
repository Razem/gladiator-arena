import * as ECSA from '../libs/pixi-component'
import { Assets, Info } from './constants'
import GameFactory from './game-factory'
import GameModel from './game-model'

class Game {
  engine: ECSA.GameLoop

  constructor() {
    this.engine = new ECSA.GameLoop()
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement

    // init the game loop
    this.engine.init(canvas, Info.WIDTH, Info.HEIGHT, 1, {
      flagsSearchEnabled: false, // searching by flags feature
      statesSearchEnabled: false, // searching by states feature
      tagsSearchEnabled: false, // searching by tags feature
      namesSearchEnabled: true, // searching by names feature
      notifyAttributeChanges: false, // will send message if attributes change
      notifyStateChanges: false, // will send message if states change
      notifyFlagChanges: false, // will send message if flags change
      notifyTagChanges: false, // will send message if tags change
      debugEnabled: false, // debugging window
    }, true) // resize to screen

    this.engine.app.loader
    .reset()
    .add(Assets.BACKGROUND, './assets/environment/background.png')
    .add(Assets.OBSTACLE, './assets/environment/obstacle.png')
    .add(Assets.WARRIOR_BLUE, './assets/characters/warrior-blue.json')
    .add(Assets.WARRIOR_RED, './assets/characters/warrior-red.json')
    .load(() => this.onAssetsLoaded())
  }

  onAssetsLoaded() {
    const {
      scene,
      app: { loader: { resources } },
    } = this.engine

    const factory = new GameFactory()
    const model = new GameModel()

    factory.initialize(scene, model, resources)

    // new ECSA.Builder(scene)
    // .localPos(this.engine.app.screen.width / 2, this.engine.app.screen.height / 2)
    // .anchor(0.5)
    // .withParent(scene.stage)
    // .withComponent(
    //   new ECSA.GenericComponent('rotation')
    //   .doOnUpdate((cmp, delta, absolute) => cmp.owner.asText().rotation += 0.001 * delta)
    // )
    // .asText(
    //   'text', '\u0047\u004F\u004F\u0044 \u004C\u0055\u0043\u004B\u0021',
    //   new PIXI.TextStyle({ fill: '#FF0000', fontSize: 80, fontFamily: 'Courier New' })
    // )
    // .build()
  }
}

export default new Game()
