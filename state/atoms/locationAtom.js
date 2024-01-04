import { atom } from 'recoil'

const locationAtom = atom({
  key: 'locationAtom', // unique ID (with respect to other atoms/selectors)
  default: 'krasnoyarsk', // default value (aka initial value)
})

export default locationAtom
