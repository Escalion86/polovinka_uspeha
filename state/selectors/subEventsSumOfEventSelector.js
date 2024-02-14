import { selectorFamily } from 'recoil'
import eventSelector from './eventSelector'
import subEventsSummator from '@helpers/subEventsSummator'

export const subEventsSumOfEventSelector = selectorFamily({
  key: 'subEventsSumOfEventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []
      const event = get(eventSelector(id))
      return event?.subEvents ? subEventsSummator(event.subEvents) : event
    },
})

export default subEventsSumOfEventSelector
