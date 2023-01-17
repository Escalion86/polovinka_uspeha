import { atom } from 'recoil'

const servicesAtom = atom({
  key: 'services',
  default: [],
})

export default servicesAtom
