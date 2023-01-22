import { selectorFamily } from 'recoil'
import sumOfExpectingPaymentsFromParticipantsSelector from './sumOfExpectingPaymentsFromParticipantsSelector'
import sumOfPaymentsToAssistantsSelector from './sumOfPaymentsToAssistantsSelector'
import sumOfPaymentsToEventSelector from './sumOfPaymentsToEventSelector'

export const expectedIncomeOfEventSelector = selectorFamily({
  key: 'expectedIncomeOfEventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return (
        get(sumOfExpectingPaymentsFromParticipantsSelector(id)) +
        get(sumOfPaymentsToAssistantsSelector(id)) +
        get(sumOfPaymentsToEventSelector(id))
      )
    },
})

export default expectedIncomeOfEventSelector
