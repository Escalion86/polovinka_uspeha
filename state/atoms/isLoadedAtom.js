import { atomFamily } from 'recoil'

const isLoadedAtom = atomFamily({
  key: 'isLoadedAtom',
  default: false,
  // effects: (param) => [
  //   ({ node, onSet, getInfo_UNSTABLE }) => {
  //     onSet((newID) => {
  //       if (param === 'asyncEventsUsersAllAtom')
  //         console.debug('!!!!! onSet asyncEventsUsersAllAtom')
  //       console.debug('onSet isLoadedAtom', param)
  //     })
  //   },
  //   // (params) => console.log('params isLoadedAtom :>> ', params),
  // ],
})

export default isLoadedAtom
