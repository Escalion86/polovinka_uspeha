import { selectorFamily } from 'recoil'
// import servicesUsersSelector from './servicesUsersSelector'

export const totalIncomeOfServiceUserSelector = selectorFamily({
  key: 'totalIncomeOfServiceUserSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []
      // const serviceUser = get(servicesUsersSelector(id))

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

export default totalIncomeOfServiceUserSelector
