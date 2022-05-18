import { atomFamily } from 'recoil'

const loadingAtom = atomFamily({
  key: 'loadingAtom',
  default: false,
})

export default loadingAtom
