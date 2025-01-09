import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

export const totalIncomeOfServiceUserSelector = atomFamily((id) =>
  atom((get) => {
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
  })
)

export default totalIncomeOfServiceUserSelector
