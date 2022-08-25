import { atomFamily } from 'recoil'

const stateAtom = atomFamily({
  key: 'stateAtom',
  default: { loading: false, error: false },
})

export default stateAtom
