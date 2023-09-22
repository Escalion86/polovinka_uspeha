import isEventExpired from '@helpers/isEventExpired'
import eventsAtom from '@state/atoms/eventsAtom'
import eventsUsersAtom from '@state/atoms/eventsUsersAtom'
import { selector } from 'recoil'

export const eventsUsersNotCanceledAndFinishedSelector = selector({
  key: 'eventsUsersNotCanceledAndFinishedSelector',
  get: ({ get }) => {
    const eventsIds = get(eventsAtom)
      .filter((event) => event.status !== 'canceled' && isEventExpired(event))
      .map((event) => event._id)
    const eventsUsers = get(eventsUsersAtom)

    const filteredEventsUsers = eventsUsers.filter(
      (eventUser) =>
        !['ban', 'reserve'].includes(eventUser.status) &&
        eventsIds.includes(eventUser.eventId)
    )

    return filteredEventsUsers
  },
})

export default eventsUsersNotCanceledAndFinishedSelector
