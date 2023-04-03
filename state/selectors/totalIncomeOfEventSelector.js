import { selectorFamily } from 'recoil'
import sumOfPaymentsFromEventSelector from './sumOfPaymentsFromEventSelector'
import sumOfPaymentsFromNotParticipantsToEventSelector from './sumOfPaymentsFromNotParticipantsToEventSelector'
import sumOfPaymentsFromParticipantsSelector from './sumOfPaymentsFromParticipantsSelector'
import sumOfPaymentsFromEventToAssistantsSelector from './sumOfPaymentsFromEventToAssistantsSelector'
import sumOfPaymentsToEventSelector from './sumOfPaymentsToEventSelector'

export const totalIncomeOfEventSelector = selectorFamily({
  key: 'totalIncomeOfEventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return (
        get(sumOfPaymentsFromParticipantsSelector(id)) +
        get(sumOfPaymentsFromEventToAssistantsSelector(id)) +
        get(sumOfPaymentsToEventSelector(id)) +
        get(sumOfPaymentsFromEventSelector(id)) +
        get(sumOfPaymentsFromNotParticipantsToEventSelector(id))
      )
    },
})

export default totalIncomeOfEventSelector
