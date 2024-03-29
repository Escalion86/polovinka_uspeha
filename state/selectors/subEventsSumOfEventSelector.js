import { selectorFamily } from 'recoil'
import eventAtom from '@state/async/eventAtom'
import subEventsSummator from '@helpers/subEventsSummator'
import { DEFAULT_SUBEVENT_GENERATOR } from '@helpers/constants'

export const subEventsSumOfEventSelector = selectorFamily({
  key: 'subEventsSumOfEventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []
      const event = get(eventAtom(id))
      return event?.subEvents
        ? subEventsSummator(event.subEvents)
        : subEventsSummator([DEFAULT_SUBEVENT_GENERATOR()])
    },
})

export default subEventsSumOfEventSelector
