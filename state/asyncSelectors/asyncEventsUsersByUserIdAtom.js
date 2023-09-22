import getFetch from '@helpers/getFetch'
import { atomFamily, selectorFamily } from 'recoil'

const asyncEventsUsersByUserIdSelector = selectorFamily({
  key: 'asyncEventsUsersByUserIdSelector',
  get:
    (userId) =>
    async ({ get, set }) => {
      // console.log('Get :>> ', userId)
      if (!userId) return undefined
      const res = await getFetch('/api/eventsusers', { userId })
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
})

export default asyncEventsUsersByUserIdAtom
