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

      return (
        eventUser?.status === 'participant' ||
        eventUser?.status === 'assistant' ||
        (eventUser?.status !== 'ban' &&
          (!event.usersStatusAccess ||
            event.usersStatusAccess[userStatus ?? 'novice']))
      )
    })
  }
}

export default visibleEventsForUser
