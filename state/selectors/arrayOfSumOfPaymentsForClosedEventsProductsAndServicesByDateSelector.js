// import isEventClosed from '@helpers/isEventClosed'
// import isProductUserClosed from '@helpers/isProductUserClosed'
// import eventsAtom from '@state/atoms/eventsAtom'
// import productsUsersAtom from '@state/atoms/productsUsersAtom'
import { selector } from 'recoil'
import allClosedEventsSelector from './allClosedEventsSelector'
import allPaymentsOfInternalSelector from './allPaymentsOfInternalSelector '
import totalIncomeOfEventSelector from './totalIncomeOfEventSelector'
// import totalIncomeOfProductUserSelector from './totalIncomeOfProductUserSelector'
// import totalIncomeOfServiceUserSelector from './totalIncomeOfServiceUserSelector'

export const arrayOfSumOfPaymentsForClosedEventsProductsAndServicesByDateSelector =
  selector({
    key: 'arrayOfSumOfPaymentsForClosedEventsProductsAndServicesByDateSelector',
    get: ({ get }) => {
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
      // get(productsUsersAtom).forEach((productUser) => {
      //   if (isProductUserClosed(productUser)) {
      //     const incomeOfProductUser = get(
      //       totalIncomeOfProductUserSelector(productUser._id)
      //     )
      //     const closeDate = productUser.closeDate
      //     const yearOfDeal = new Date(closeDate).getFullYear()
      //     const monthOfDeal = new Date(closeDate).getMonth()
      //     if (!array[yearOfDeal])
      //       array[yearOfDeal] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      //     array[yearOfDeal][monthOfDeal] += incomeOfProductUser
      //   }
      // })
      // get(servicesUsersAtom).forEach((serviceUser) => {
      //   if (isServiceUserClosed(serviceUser)) {
      //     const incomeOfServiceUser = get(
      //       totalIncomeOfServiceUserSelector(serviceUser._id)
      //     )
      //     const closeDate = serviceUser.closeDate
      //     const yearOfDeal = new Date(closeDate).getFullYear()
      //     const monthOfDeal = new Date(closeDate).getMonth()
      //     if (!array[yearOfDeal])
      //       array[yearOfDeal] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      //     array[yearOfDeal][monthOfDeal] += incomeOfServiceUser
      //   }
      // })
      return array
    },
    // set:
    //   (id) =>
    //   ({ set }, event) => {
    //     set(eventsSelector, event)
    //   },
  })

export default arrayOfSumOfPaymentsForClosedEventsProductsAndServicesByDateSelector
