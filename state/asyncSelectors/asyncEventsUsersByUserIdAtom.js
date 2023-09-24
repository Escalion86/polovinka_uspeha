import getFetch from '@helpers/getFetch'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import { atomFamily, selectorFamily } from 'recoil'
import { setRecoil } from 'recoil-nexus'

const asyncEventsUsersByUserIdSelector = selectorFamily({
  key: 'asyncEventsUsersByUserIdSelector',
  get:
    (userId) =>
    async ({ get, set }) => {
      // console.log('Get :>> ', userId)
      if (!userId) return undefined
      const res = await getFetch('/api/eventsusers', { userId })
      setRecoil(isLoadedAtom('asyncEventsUsersByUserIdAtom' + userId), true)
      // // Throw error with status code in case Fetch API req failed
      // if (!res.ok) {
      //   throw new Error(res.status)
      // }

      const json = await res.json()
      const { data } = json
      return data
    },
})

const asyncEventsUsersByUserIdAtom = atomFamily({
  key: 'asyncEventsUsersByUserIdAtom',
  default: asyncEventsUsersByUserIdSelector,
  // effects: [
  //   ({ onSet }) => {
  //     onSet((newID) => {
  //       console.debug('onSet asyncEventsUsersByUserIdAtom', newID)
  //       setRecoil(isLoadedAtom('asyncEventsUsersByUserIdAtom' + newID), true)
  //     })
  //   },
  //   (params) => console.log('params :>> ', params),
  // ],
})

export default asyncEventsUsersByUserIdAtom
