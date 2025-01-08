import { atom } from 'jotai'

import allPaymentsOfInternalSelector from './allPaymentsOfInternalSelector'

export const arrayOfSumOfPaymentsForInternalByDateSelector = atom((get) => {
  const array = {}
  get(allPaymentsOfInternalSelector).forEach(({ payAt, sum, payDirection }) => {
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

export default arrayOfSumOfPaymentsForInternalByDateSelector
