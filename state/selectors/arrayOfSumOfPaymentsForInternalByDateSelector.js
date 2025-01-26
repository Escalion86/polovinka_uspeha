import { atom } from 'jotai'

import allPaymentsOfInternalSelector from './allPaymentsOfInternalSelector'

const arrayOfSumOfPaymentsForInternalByDateSelector = atom(async (get) => {
  const array = {}
  const allPayments = await get(allPaymentsOfInternalSelector)
  for (let i = 0; i < allPayments.length; i++) {
    const { payAt, sum, payDirection } = allPayments[i]
    const yearOfPayment = new Date(payAt).getFullYear()
    const monthOfPayment = new Date(payAt).getMonth()
    if (!array[yearOfPayment])
      array[yearOfPayment] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    if (payDirection === 'fromInternal')
      array[yearOfPayment][monthOfPayment] += sum / 100
    else array[yearOfPayment][monthOfPayment] -= sum / 100
  }
  return array
})

export default arrayOfSumOfPaymentsForInternalByDateSelector
