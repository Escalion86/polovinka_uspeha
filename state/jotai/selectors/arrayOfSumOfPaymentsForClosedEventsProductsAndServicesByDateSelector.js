import { atom } from 'jotai'

import allClosedEventsSelector from './allClosedEventsSelector'
import allPaymentsOfInternalSelector from './allPaymentsOfInternalSelector'
import totalIncomeOfEventSelector from './totalIncomeOfEventSelector'

export const arrayOfSumOfPaymentsForClosedEventsProductsAndServicesByDateSelector =
  atom((get) => {
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
    get(allPaymentsOfInternalSelector).forEach(
      ({ payAt, sum, payDirection }) => {
        const yearOfPayment = new Date(payAt).getFullYear()
        const monthOfPayment = new Date(payAt).getMonth()
        if (!array[yearOfPayment])
          array[yearOfPayment] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        if (payDirection === 'fromInternal')
          array[yearOfPayment][monthOfPayment] += sum / 100
        else array[yearOfPayment][monthOfPayment] -= sum / 100
      }
    )
    return array
  })

export default arrayOfSumOfPaymentsForClosedEventsProductsAndServicesByDateSelector
