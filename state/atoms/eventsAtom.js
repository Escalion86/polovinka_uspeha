import { atom } from 'recoil'

const eventsAtom = atom({
  key: 'events',
  default: [],
})

export default eventsAtom
