import { selectorFamily } from 'recoil'

export const totalIncomeOfProductUserSelector = selectorFamily({
  key: 'totalIncomeOfProductUserSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return (
        // get(sumOfPaymentsFromParticipantsSelector(id)) +
        // get(sumOfPaymentsFromEventToAssistantsSelector(id)) +
        // get(sumOfPaymentsToEventSelector(id)) +
        // get(sumOfPaymentsFromEventSelector(id)) +
        // get(sumOfPaymentsFromNotParticipantsToEventSelector(id))
        0
      )
    },
})

export default totalIncomeOfProductUserSelector
