// import getFetch from '@helpers/getFetch'
import { atom, errorSelector } from 'recoil'

const asyncEventsUsersAllAtom = atom({
  key: 'asyncEventsUsersAllAtom',
  default: undefined,
  // default: errorSelector('Attempt to use Atom before initialization'),
  effects: [
    ({ onSet }) => {
      onSet((newID) => {
        console.debug('Current user ID:', newID)
      })
    },
    (params) => console.log('params :>> ', params),
  ],
})

export default asyncEventsUsersAllAtom
