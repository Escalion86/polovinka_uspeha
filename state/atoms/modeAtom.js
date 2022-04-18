import { MODES } from '@helpers/constants'
import { atom } from 'recoil'

const modeAtom = atom({
  key: 'mode',
  default: MODES.VIEWER,
})

export default modeAtom
