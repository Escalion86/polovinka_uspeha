import { atomFamily } from 'recoil'

const errorAtom = atomFamily({
  key: 'errorAtom',
  default: false,
})

export default errorAtom
