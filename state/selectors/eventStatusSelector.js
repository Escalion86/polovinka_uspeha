import isEventCanceled from '@helpers/isEventCanceled'
import isEventClosed from '@helpers/isEventClosed'
import isEventExpired from '@helpers/isEventExpired'
import isEventInProcess from '@helpers/isEventInProcess'
import { selectorFamily } from 'recoil'

export const eventStatusSelector = selectorFamily({
  key: 'eventStatusSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return null
      const event = get(eventsSelector(id))
      if (isEventCanceled(event)) return 'canceled'
      if (isEventClosed(event)) return 'closed'
      if (isEventExpired(event)) return 'finished'
      if (isEventInProcess(event)) return 'inProcess'
      return 'active'
    },
})

export default eventStatusSelector
