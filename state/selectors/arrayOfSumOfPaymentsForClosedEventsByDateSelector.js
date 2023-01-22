import isEventClosed from '@helpers/isEventClosed'
import eventsAtom from '@state/atoms/eventsAtom'
import { selector } from 'recoil'
import totalIncomeOfEventSelector from './totalIncomeOfEventSelector'

export const arrayOfSumOfPaymentsForClosedEventsByDateSelector = selector({
  key: 'arrayOfSumOfPaymentsForClosedEventsByDateSelector',
  get: ({ get }) => {
    const array = {}
    get(eventsAtom).forEach((event) => {
      if (isEventClosed(event)) {
        const incomeOfEvent = get(totalIncomeOfEventSelector(event._id))
        const eventDate = event.dateStart
        const yearOfEvent = new Date(eventDate).getFullYear()
        const monthOfEvent = new Date(eventDate).getMonth()
        if (!array[yearOfEvent])
          array[yearOfEvent] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        array[yearOfEvent][monthOfEvent] += incomeOfEvent
      }
    })
    return array
  },
  // set:
  //   (id) =>
  //   ({ set }, event) => {
  //     set(eventsSelector, event)
  //   },
})

export default arrayOfSumOfPaymentsForClosedEventsByDateSelector
