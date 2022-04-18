import { atom } from 'recoil'

const modalsFuncAtom = atom({
  key: 'modalsFunc', // unique ID (with respect to other atoms/selectors)
  default: {}, // default value (aka initial value)
})

export default modalsFuncAtom
