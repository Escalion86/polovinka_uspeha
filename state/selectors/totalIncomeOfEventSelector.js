import { selectorFamily } from 'recoil'
import sumOfPaymentsFromEventSelector from './sumOfPaymentsFromEventSelector'
import sumOfPaymentsFromNotParticipantsSelector from './sumOfPaymentsFromNotParticipantsSelector'
import sumOfPaymentsFromParticipantsSelector from './sumOfPaymentsFromParticipantsSelector'
import sumOfPaymentsToAssistantsSelector from './sumOfPaymentsToAssistantsSelector'
import sumOfPaymentsToEventSelector from './sumOfPaymentsToEventSelector'

export const totalIncomeOfEventSelector = selectorFamily({
  key: 'totalIncomeOfEventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return (
        get(sumOfPaymentsFromParticipantsSelector(id)) +
        get(sumOfPaymentsToAssistantsSelector(id)) +
        get(sumOfPaymentsToEventSelector(id)) +
        get(sumOfPaymentsFromEventSelector(id)) +
        get(sumOfPaymentsFromNotParticipantsSelector(id))
      )
    },
})

export default totalIncomeOfEventSelector
