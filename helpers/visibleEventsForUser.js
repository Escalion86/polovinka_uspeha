import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
import birthDateToAge from './birthDateToAge'
import { getRecoil } from 'recoil-nexus'
import isUserRelationshipCorrectForEvent from '@components/isUserRelationshipCorrectForEvent'
import subEventsSummator from './subEventsSummator'
import directionSelector from '@state/selectors/directionSelector'

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
      if (event.blank) return true
      const subEventsSum = subEventsSummator(event.subEvents)
      const direction = getRecoil(directionSelector(event.directionId))
      const rules = direction?.rules

      if (
        !event.showOnSite ||
        (onlyNew && new Date(event.dateStart) < new Date())
      )
        return false

      const eventUser = eventsUser.find(
        (eventUser) => eventUser.eventId === event._id
      )

      if (eventUser?.status === 'ban') return false

      // Если пользователь записан, то показываем
      if (eventUser) return true

      // Если пользователь не записан
      // if (
      //   !['participant', 'assistant', 'reserve'].includes(eventUser?.status)
      // ) {
      // Подходит ли по статусу отношений
      if (!isUserRelationshipCorrectForEvent(user, subEventsSum, rules))
        return false

      // Подходит ли по возрасту
      if (
        userAge &&
        ((user.gender === 'male' &&
          typeof subEventsSum.maxMansAge === 'number' &&
          (subEventsSum.maxMansAge < userAge ||
            subEventsSum.minMansAge > userAge)) ||
          (user.gender === 'famale' &&
            typeof subEventsSum.maxWomansAge === 'number' &&
            (subEventsSum.maxWomansAge < userAge ||
              subEventsSum.minWomansAge > userAge)))
      )
        return false
      // }

      // Подходит ли по статусу
      if (
        !subEventsSum.usersStatusAccess ||
        !subEventsSum.usersStatusAccess[userStatusName ?? 'novice']
      )
        return false

      // Нет ли ограничений по статусу
      if (
        userStatusName === 'member'
          ? user.gender === 'male'
            ? subEventsSum.maxMansMember === 0
            : subEventsSum.maxWomansMember === 0
          : user.gender === 'male'
            ? subEventsSum.maxMansNovice === 0
            : subEventsSum.maxWomansNovice === 0
      )
        return false

      return true
    })
  }
}

export default visibleEventsForUser
