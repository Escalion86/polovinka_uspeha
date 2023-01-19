import birthDateToAge from './birthDateToAge'

const visibleEventsForUser = (
  events,
  eventsUsers,
  user,
  onlyNew = false,
  isUserAdmin,
  userStatus
) => {
  if (!events) return events
  if (!user) {
    return events.filter((event) => {
      if (
        !event.showOnSite ||
        (onlyNew && new Date(event.dateStart) < new Date())
      )
        return false

      return !event.usersStatusAccess || event.usersStatusAccess.novice
    })
  } else {
    if (isUserAdmin) return events

    const userAge = new Number(birthDateToAge(user.birthday, false, false))
    const eventsUser = eventsUsers.filter((event) => event.userId === user._id)

    return events.filter((event) => {
      if (
        !event.showOnSite ||
        (onlyNew && new Date(event.dateStart) < new Date())
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
            typeof event.maxMansAge === 'number' &&
            event.maxMansAge < userAge) ||
            (user.gender === 'famale' &&
              typeof event.maxWomansAge === 'number' &&
              event.maxWomansAge < userAge))
        )
          return false

        if (
          userAge &&
          ((user.gender === 'male' &&
            typeof event.maxMansAge === 'number' &&
            event.minMansAge > userAge) ||
            (user.gender === 'famale' &&
              typeof event.maxWomansAge === 'number' &&
              event.minWomansAge > userAge))
        )
          return false
      }

      return (
        // (eventUser?.status !== 'ban' &&
        !event.usersStatusAccess ||
        (userStatus === 'member' && event.usersStatusAccess['member']) ||
        event.usersStatusAccess['novice']
        // )
      )
    })
  }
}

export default visibleEventsForUser
