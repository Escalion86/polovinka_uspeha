import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import sumOfExpectingPaymentsFromParticipantsToEventSelector from './sumOfExpectingPaymentsFromParticipantsToEventSelector'
import sumOfPaymentsFromEventToAssistantsSelector from './sumOfPaymentsFromEventToAssistantsSelector'
import sumOfPaymentsToEventSelector from './sumOfPaymentsToEventSelector'

export const expectedIncomeOfEventSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []

    const sumOfExpectingPayments = await get(
      sumOfExpectingPaymentsFromParticipantsToEventSelector(id)
    )
    const sumOfPaymentsFromEventToAssistants = await get(
      sumOfPaymentsFromEventToAssistantsSelector(id)
    )
    const sumOfPaymentsToEvent = await get(sumOfPaymentsToEventSelector(id))
    return (
      sumOfExpectingPayments +
      sumOfPaymentsFromEventToAssistants +
      sumOfPaymentsToEvent
    )
  })
)

export default expectedIncomeOfEventSelector
