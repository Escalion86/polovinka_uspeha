import { selectorFamily } from 'recoil'
import sumOfExpectingPaymentsOfEventFromParticipantsSelector from './sumOfExpectingPaymentsOfEventFromParticipantsSelector'
import sumOfPaymentsOfEventToAssistantsSelector from './sumOfPaymentsOfEventToAssistantsSelector'
import sumOfPaymentsToEventSelector from './sumOfPaymentsToEventSelector'

export const expectedIncomeOfEventSelector = selectorFamily({
  key: 'expectedIncomeOfEventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return (
        get(sumOfExpectingPaymentsOfEventFromParticipantsSelector(id)) +
        get(sumOfPaymentsOfEventToAssistantsSelector(id)) +
        get(sumOfPaymentsToEventSelector(id))
      )
    },
})

export default expectedIncomeOfEventSelector
