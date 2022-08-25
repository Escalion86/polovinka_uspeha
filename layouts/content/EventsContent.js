import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import Fab from '@components/Fab'
import eventsAtom from '@state/atoms/eventsAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import EventCard from '@layouts/cards/EventCard'
import loggedUserToEventStatusSelector from '@state/selectors/loggedUserToEventStatusSelector'
import eventsUsersByUserIdSelector from '@state/selectors/eventsUsersByUserIdSelector'
import visibleEventsForUser from '@helpers/visibleEventsForUser'

const EventsContent = () => {
  const events = useRecoilValue(eventsAtom)
  const loggedUser = useRecoilValue(loggedUserAtom)
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  const eventsLoggedUser = useRecoilValue(
    eventsUsersByUserIdSelector(loggedUser?._id)
  )

  const filteredEvents = visibleEventsForUser(
    events,
    eventsLoggedUser,
    loggedUser,
    true
  )

  // const visibleEvents =
  //   loggedUser?.role === 'admin' || loggedUser?.role === 'dev'
  //     ? events
  //     : events.filter((event) => {
  //         if (!event.showOnSite || new Date(event.date) < new Date())
  //           return false
  //         const eventUser = eventsLoggedUser.find(
  //           (eventUser) => eventUser.eventId === event._id
  //         )
  //         return (
  //           eventUser?.status !== 'ban' &&
  //           (!event.usersStatusAccess ||
  //             event.usersStatusAccess[loggedUser?.status ?? 'novice'])
  //         )
  //       })

  return (
    <>
      {filteredEvents?.length > 0 ? (
        [...filteredEvents]
          .sort((a, b) => (a.date < b.date ? -1 : 1))
          .map((event) => (
            <EventCard
              key={event._id}
              eventId={event._id}
              noButtons={
                loggedUser?.role !== 'admin' && loggedUser?.role !== 'dev'
              }
            />
          ))
      ) : (
        <div className="flex justify-center p-2">Нет мероприятий</div>
      )}
      {(loggedUser?.role === 'admin' || loggedUser?.role === 'dev') && (
        <Fab onClick={() => modalsFunc.event.add()} show />
      )}
    </>
  )
}

export default EventsContent
