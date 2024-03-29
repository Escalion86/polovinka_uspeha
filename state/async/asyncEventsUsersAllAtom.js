import { atom } from 'recoil'
import asyncEventsUsersAllSelector from './asyncEventsUsersAllSelector'
// import { setRecoil } from 'recoil-nexus'
// import isLoadedAtom from '@state/atoms/isLoadedAtom'

const asyncEventsUsersAllAtom = atom({
  key: 'asyncEventsUsersAllAtom',
  default: asyncEventsUsersAllSelector,
  // default: errorSelector('Attempt to use Atom before initialization'),
  // effects: [
  //   ({ onSet }) => {
  //     onSet((newID) => {
  //       console.debug('onSet asyncEventsUsersAllAtom', newID)
  //       setRecoil(isLoadedAtom('asyncEventsUsersAllAtom'), true)
  //     })
  //   },
  //   (params) => console.log('params :>> ', params),
  // ],
})

export default asyncEventsUsersAllAtom
