import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import compareArrays from '@helpers/compareArraysWithDif'
import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'
import paymentsOfEventFromAndToUsersSelector from './paymentsOfEventFromAndToUsersSelector'

export const eventNotParticipantsWithPaymentsSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return []

    const usersOfEvent = get(eventsUsersFullByEventIdSelector(id))
    const paymentsOfEvent = get(paymentsOfEventFromAndToUsersSelector(id))
    const usersIdsOfEvent = usersOfEvent
      .filter(
        ({ status }) => status === 'participant' || status === 'assistant'
      )
      .map(({ user }) => user._id)
    const paymentsUsersIds = paymentsOfEvent.map(({ userId }) => userId)

    const notParticipantsIdsWithPayments = compareArrays(
      usersIdsOfEvent,
      paymentsUsersIds
    ).added

    return [...new Set(notParticipantsIdsWithPayments)]
  })
)

export default eventNotParticipantsWithPaymentsSelector
