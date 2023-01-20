import { selectorFamily } from 'recoil'
import sumOfPaymentsOfEventFromParticipantsSelector from './sumOfPaymentsOfEventFromParticipantsSelector'
import sumOfPaymentsOfEventToAssistantsSelector from './sumOfPaymentsOfEventToAssistantsSelector'
import sumOfPaymentsToEventSelector from './sumOfPaymentsToEventSelector'

export const totalIncomeOfEventSelector = selectorFamily({
  key: 'totalIncomeOfEventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return (
        get(sumOfPaymentsOfEventFromParticipantsSelector(id)) +
        get(sumOfPaymentsOfEventToAssistantsSelector(id)) +
        get(sumOfPaymentsToEventSelector(id))
      )
    },
})

export default totalIncomeOfEventSelector
