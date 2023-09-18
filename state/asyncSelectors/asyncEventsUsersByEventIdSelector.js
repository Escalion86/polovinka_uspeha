import getFetch from '@helpers/getFetch'
import sleep from '@helpers/sleep'
import { atomFamily, selectorFamily } from 'recoil'

const asyncEventsUsersByEventIdSelector = selectorFamily({
  key: 'asyncEventsUsersByEventIdSelector',
  get:
    (eventId) =>
    async ({ get, set }) => {
      const res = await getFetch('/api/eventsusers', { eventId })

      await sleep(1000)
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
  //     set(asyncEventsUsersByEventIdSelector(eventId), newItem)
  //   },
})

const asyncEventsUsersByEventIdAtom = atomFamily({
  key: 'asyncEventsUsersByEventIdAtom',
  default: asyncEventsUsersByEventIdSelector,
})

export default asyncEventsUsersByEventIdAtom
