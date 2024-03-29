import { DEFAULT_EVENT } from '@helpers/constants'
import getEventDuration from '@helpers/getEventDuration'
import getMinutesBetween from '@helpers/getMinutesBetween'
import eventsAtom from '@state/atoms/eventsAtom'
import { selectorFamily } from 'recoil'
import eventAtom from '@state/async/eventAtom'

export const eventDurationSelector = selectorFamily({
  key: 'eventDurationSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return null
      const event = get(eventAtom(id))
      return getEventDuration(event)
    },
  // set:
  //   (id) =>
  //   ({ set }, event) => {
  //     set(eventsSelector, event)
  //   },
})

export default eventDurationSelector
