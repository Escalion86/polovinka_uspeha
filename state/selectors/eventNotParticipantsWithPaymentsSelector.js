import compareArrays from '@helpers/compareArraysWithDif'
import { selectorFamily } from 'recoil'
import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'
import paymentsFromAndToUsersSelector from './paymentsFromAndToUsersSelector'

export const eventNotParticipantsWithPaymentsSelector = selectorFamily({
  key: 'eventNotParticipantsWithPaymentsSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      const usersOfEvent = get(eventsUsersFullByEventIdSelector(id))
      const paymentsOfEvent = get(paymentsFromAndToUsersSelector(id))
      const usersIdsOfEvent = usersOfEvent
        .filter(({ status }) => status === 'participant')
        .map(({ user }) => user._id)
      const paymentsUsersIds = paymentsOfEvent.map(({ userId }) => userId)

      const notParticipantsIdsWithPayments = compareArrays(
        usersIdsOfEvent,
        paymentsUsersIds
      ).added

      return [...new Set(notParticipantsIdsWithPayments)]
    },
})

export default eventNotParticipantsWithPaymentsSelector
