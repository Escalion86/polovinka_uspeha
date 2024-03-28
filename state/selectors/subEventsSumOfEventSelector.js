import { selectorFamily } from 'recoil'
import eventSelector from './eventSelector'
import subEventsSummator from '@helpers/subEventsSummator'
import { DEFAULT_SUBEVENT_GENERATOR } from '@helpers/constants'

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
