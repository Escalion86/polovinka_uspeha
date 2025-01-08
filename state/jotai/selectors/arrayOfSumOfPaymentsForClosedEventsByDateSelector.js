import { atom } from 'jotai'

import allClosedEventsSelector from './allClosedEventsSelector'
import totalIncomeOfEventSelector from './totalIncomeOfEventSelector'

export const arrayOfSumOfPaymentsForClosedEventsByDateSelector = atom((get) => {
  const array = {}
  get(allClosedEventsSelector).forEach((event) => {
    const incomeOfEvent = get(totalIncomeOfEventSelector(event._id))
    const eventDate = event.dateStart
    const yearOfEvent = new Date(eventDate).getFullYear()
    const monthOfEvent = new Date(eventDate).getMonth()
    if (!array[yearOfEvent])
      array[yearOfEvent] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    array[yearOfEvent][monthOfEvent] += incomeOfEvent
  })
  return array
})

export default arrayOfSumOfPaymentsForClosedEventsByDateSelector
