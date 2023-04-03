import { selectorFamily } from 'recoil'
import sumOfExpectingPaymentsFromParticipantsToEventSelector from './sumOfExpectingPaymentsFromParticipantsToEventSelector'
import sumOfPaymentsFromEventToAssistantsSelector from './sumOfPaymentsFromEventToAssistantsSelector'
import sumOfPaymentsToEventSelector from './sumOfPaymentsToEventSelector'

export const expectedIncomeOfEventSelector = selectorFamily({
  key: 'expectedIncomeOfEventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return (
        get(sumOfExpectingPaymentsFromParticipantsToEventSelector(id)) +
        get(sumOfPaymentsFromEventToAssistantsSelector(id)) +
        get(sumOfPaymentsToEventSelector(id))
      )
    },
})

export default expectedIncomeOfEventSelector
