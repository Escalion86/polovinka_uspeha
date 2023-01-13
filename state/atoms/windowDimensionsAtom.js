import { atom } from 'recoil'

const windowDimensionsAtom = atom({
  key: 'windowDimensions',
  default: { width: undefined, height: undefined },
})

export default windowDimensionsAtom
