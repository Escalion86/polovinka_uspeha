import { getData } from '@helpers/CRUD'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import { selector } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export const asyncEventsUsersAllSelector = selector({
  key: 'asyncEventsUsersAllSelector',
  get: async ({ get }) => {
    // console.log('!!! asyncEventsUsersAllSelector ')
    const res = await getData('/api/eventsusers', null, null, null, false)
    setRecoil(isLoadedAtom('asyncEventsUsersAllAtom'), true)
    // setRecoil(isLoadedAtom('asyncEventsUsersAllSelector'), true)
    // // Throw error with status code in case Fetch API req failed
    // if (!res.ok) {
    //   throw new Error(res.status)
    // }

    // const json = await res.json()
    // const { data } = json

    return res
  },
})

export default asyncEventsUsersAllSelector
