import { atom } from 'recoil'

const directionsAtom = atom({
  key: 'directions',
  default: [],
})

export default directionsAtom
