import * as ECSA from '../../libs/pixi-component'
import { Messages, Assets } from '../constants'
import PIXISound from 'pixi-sound'

export const soundComponent = () => (
  new ECSA.GenericComponent('SoundComponent')
  .doOnMessage(Messages.UNIT_ATTACKED, () => PIXISound.play(Assets.AXE_SWING, { volume: 0.2 }))
  .doOnMessage(Messages.BONUS_TAKEN, () => PIXISound.play(Assets.BONUS_TAKEN))
  .doOnMessage(Messages.UNIT_DIED, () => PIXISound.play(Assets.WILHELM_SCREAM))
)
