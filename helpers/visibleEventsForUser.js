import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
import birthDateToAge from './birthDateToAge'
import { getRecoil } from 'recoil-nexus'
import isUserRelationshipCorrectForEvent from '@components/isUserRelationshipCorrectForEvent'
import subEventsSummator from './subEventsSummator'

const visibleEventsForUser = (
  events,
  eventsUsers,
  user,
  onlyNew = false,
  seeAll,
  userStatusName
) => {
  if (!events || events?.length === 0) return []
  if (!user) {
    return events.filter((event) => {
      const subEventsSum = subEventsSummator(event.subEvents)
      if (
        // !event.usersStatusAccess?.noReg ||
        !event.showOnSite ||
        (onlyNew && new Date(event.dateStart) < new Date()) ||
        !subEventsSum?.usersStatusAccess?.noReg
      )
        return false

      return (
        !subEventsSum.usersStatusAccess || subEventsSum.usersStatusAccess.novice
      )
    })
  } else {
    if (seeAll) return events

    const serverDate = new Date(getRecoil(serverSettingsAtom)?.dateTime)
    const userAge = new Number(
      birthDateToAge(user.birthday, serverDate, false, false)
    )
    const eventsUser = eventsUsers.filter((event) => event.userId === user._id)

    return events.filter((event) => {
      const subEventsSum = subEventsSummator(event.subEvents)

      if (
        !event.showOnSite ||
        (onlyNew && new Date(event.dateStart) < new Date()) ||
        !isUserRelationshipCorrectForEvent(user, subEventsSum)
      )
        return false

      const eventUser = eventsUser.find(
        (eventUser) => eventUser.eventId === event._id
      )

      if (eventUser?.status === 'ban') return false

      // Если пользователь не записан
      if (
        eventUser?.status !== 'participant' &&
        eventUser?.status !== 'assistant' &&
        eventUser?.status !== 'reserve'
      ) {
        if (
          userAge &&
          ((user.gender === 'male' &&
            typeof subEventsSum.maxMansAge === 'number' &&
            subEventsSum.maxMansAge < userAge) ||
            (user.gender === 'famale' &&
              typeof subEventsSum.maxWomansAge === 'number' &&
              subEventsSum.maxWomansAge < userAge))
        )
          return false

        if (
          userAge &&
          ((user.gender === 'male' &&
            typeof subEventsSum.maxMansAge === 'number' &&
            subEventsSum.minMansAge > userAge) ||
            (user.gender === 'famale' &&
              typeof subEventsSum.maxWomansAge === 'number' &&
              subEventsSum.minWomansAge > userAge))
        )
          return false
      }

      return (
        // (eventUser?.status !== 'ban' &&
        !subEventsSum.usersStatusAccess ||
        (userStatusName === 'member' &&
          subEventsSum.usersStatusAccess['member']) ||
        subEventsSum.usersStatusAccess['novice']
        // )
      )
    })
  }
}

export default visibleEventsForUser
