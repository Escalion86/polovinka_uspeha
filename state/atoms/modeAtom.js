import { atom } from 'recoil'

const modeAtom = atom({
  key: 'modeAtom', // unique ID (with respect to other atoms/selectors)
  default: 'production', // default value (aka initial value)
})

export default modeAtom
