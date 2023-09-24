import getFetch from '@helpers/getFetch'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import { selector } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export const asyncEventsUsersAllSelector = selector({
  key: 'asyncEventsUsersAllSelector',
  get: async ({ get }) => {
    // console.log('!!! asyncEventsUsersAllSelector ')
    const res = await getFetch('/api/eventsusers')
    setRecoil(isLoadedAtom('asyncEventsUsersAllAtom'), true)
    // setRecoil(isLoadedAtom('asyncEventsUsersAllSelector'), true)
    // // Throw error with status code in case Fetch API req failed
    // if (!res.ok) {
    //   throw new Error(res.status)
    // }

    const json = await res.json()
    const { data } = json

    return data
  },
})

export default asyncEventsUsersAllSelector
