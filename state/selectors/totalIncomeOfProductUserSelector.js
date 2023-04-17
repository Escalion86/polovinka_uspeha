import { selectorFamily } from 'recoil'
// import sumOfPaymentsFromEventSelector from './sumOfPaymentsFromEventSelector'
// import sumOfPaymentsFromNotParticipantsToEventSelector from './sumOfPaymentsFromNotParticipantsToEventSelector'
// import sumOfPaymentsFromParticipantsSelector from './sumOfPaymentsFromParticipantsSelector'
// import sumOfPaymentsFromEventToAssistantsSelector from './sumOfPaymentsFromEventToAssistantsSelector'
// import sumOfPaymentsToEventSelector from './sumOfPaymentsToEventSelector'

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
