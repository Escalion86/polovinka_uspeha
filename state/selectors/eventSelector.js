import { getData } from '@helpers/CRUD'
import { DEFAULT_EVENT } from '@helpers/constants'
// import eventsAtom from '@state/atoms/eventsAtom'
import { selectorFamily } from 'recoil'

export const eventSelector = selectorFamily({
  key: 'eventsSelector',
  get:
    (id) =>
    async ({ get }) => {
      if (!id) return DEFAULT_EVENT
      const res = await getData('/api/events/' + id, {}, null, null, false)
      return res
      // return get(eventsAtom).find((item) => item._id === id)
    },
  // set:
  //   (id) =>
  //   ({ set }, event) => {
  //     set(eventsSelector, event)
  //   },
})

export default eventSelector
