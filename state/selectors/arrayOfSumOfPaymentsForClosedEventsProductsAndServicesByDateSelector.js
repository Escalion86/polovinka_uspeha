'use client'

import { atom } from 'jotai'

import allClosedEventsSelector from './allClosedEventsSelector'
import allPaymentsOfInternalSelector from './allPaymentsOfInternalSelector'
import totalIncomeOfEventSelector from './totalIncomeOfEventSelector'

const arrayOfSumOfPaymentsForClosedEventsProductsAndServicesByDateSelector =
  atom(async (get) => {
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

    const allPaymentsOfInternal = await get(allPaymentsOfInternalSelector)
    allPaymentsOfInternal.forEach(({ payAt, sum, payDirection }) => {
      const yearOfPayment = new Date(payAt).getFullYear()
      const monthOfPayment = new Date(payAt).getMonth()
      if (!array[yearOfPayment])
        array[yearOfPayment] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      if (payDirection === 'fromInternal')
        array[yearOfPayment][monthOfPayment] += sum / 100
      else array[yearOfPayment][monthOfPayment] -= sum / 100
    })
    return array
  })

export default arrayOfSumOfPaymentsForClosedEventsProductsAndServicesByDateSelector
