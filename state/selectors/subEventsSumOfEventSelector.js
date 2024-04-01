import { selectorFamily } from 'recoil'
// import eventFullAtomAsync from '@state/async/eventFullAtomAsync'
import subEventsSummator from '@helpers/subEventsSummator'
import { DEFAULT_SUBEVENT_GENERATOR } from '@helpers/constants'
import eventSelector from './eventSelector'

export const subEventsSumOfEventSelector = selectorFamily({
  key: 'subEventsSumOfEventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []
      const event = get(eventSelector(id))
      return event?.subEvents
        ? subEventsSummator(event.subEvents)
        : subEventsSummator([DEFAULT_SUBEVENT_GENERATOR()])
    },
})

export default subEventsSumOfEventSelector
