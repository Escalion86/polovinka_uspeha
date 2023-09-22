import getFetch from '@helpers/getFetch'
// import sleep from '@helpers/sleep'
import { atomFamily, noWait, selectorFamily, waitForNone } from 'recoil'
// import asyncEventsUsersAllSelector from './asyncEventsUsersAllSelector'

const asyncEventsUsersByEventIdSelector = selectorFamily({
  key: 'asyncEventsUsersByEventIdSelector',
  get:
    (eventId) =>
    async ({ get }) => {
      // const test = get(noWait(asyncEventsUsersAllSelector))
      // console.log('test', test)
      if (!eventId) return undefined
      const res = await getFetch('/api/eventsusers', { eventId })
      // // Throw error with status code in case Fetch API req failed
      // if (!res.ok) {
      //   throw new Error(res.status)
      // }

      const json = await res.json()
      const { data } = json
      return data
    },
  // set:
  //   (eventId) =>
  //   ({ set, get }, newItem) => {
  //     set(asyncEventsUsersByEventIdAtom(eventId), newItem)
  //   },
})

const asyncEventsUsersByEventIdAtom = atomFamily({
  key: 'asyncEventsUsersByEventIdAtom',
  default: asyncEventsUsersByEventIdSelector,
})

export default asyncEventsUsersByEventIdAtom
