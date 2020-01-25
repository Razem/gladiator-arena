import * as ECSA from '../../libs/pixi-component';
import { Attributes } from '../constants';
import GameModel from '../game-model';
import GameFactory from '../game-factory';

export default class BaseComponent extends ECSA.Component {
  protected model: GameModel
  protected factory: GameFactory

  onInit() {
    this.model = this.scene.getGlobalAttribute(Attributes.MODEL)
    this.factory = this.scene.getGlobalAttribute(Attributes.FACTORY)
  }
}
