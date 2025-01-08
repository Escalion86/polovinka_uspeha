import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import sumOfExpectingPaymentsFromParticipantsToEventSelector from './sumOfExpectingPaymentsFromParticipantsToEventSelector'
import sumOfPaymentsFromEventToAssistantsSelector from './sumOfPaymentsFromEventToAssistantsSelector'
import sumOfPaymentsToEventSelector from './sumOfPaymentsToEventSelector'

export const expectedIncomeOfEventSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return []

    return (
      get(sumOfExpectingPaymentsFromParticipantsToEventSelector(id)) +
      get(sumOfPaymentsFromEventToAssistantsSelector(id)) +
      get(sumOfPaymentsToEventSelector(id))
    )
  })
)

export default expectedIncomeOfEventSelector
