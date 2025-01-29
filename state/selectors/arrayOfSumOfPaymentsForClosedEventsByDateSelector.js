'use client'

import { atom } from 'jotai'

import allClosedEventsSelector from './allClosedEventsSelector'
import totalIncomeOfEventSelector from './totalIncomeOfEventSelector'

const arrayOfSumOfPaymentsForClosedEventsByDateSelector = atom(async (get) => {
  const array = {}
  const allClosedEvents = get(allClosedEventsSelector)
  for (let i = 0; i < allClosedEvents.length; i++) {
    const event = allClosedEvents[i]
    const incomeOfEvent = await get(totalIncomeOfEventSelector(event._id))
    const eventDate = event.dateStart
    const yearOfEvent = new Date(eventDate).getFullYear()
    const monthOfEvent = new Date(eventDate).getMonth()
    if (!array[yearOfEvent])
      array[yearOfEvent] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    array[yearOfEvent][monthOfEvent] += incomeOfEvent
  }

  return array
})

export default arrayOfSumOfPaymentsForClosedEventsByDateSelector
