import { atom } from 'recoil'

const modalsAtom = atom({
  key: 'modals', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
})

export default modalsAtom
