import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import Fab from '@components/Fab'
import eventsAtom from '@state/atoms/eventsAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import EventCard from '@layouts/cards/EventCard'

const EventsContent = () => {
  const events = useRecoilValue(eventsAtom)
  const loggedUser = useRecoilValue(loggedUserAtom)
  const visibleEvents =
    loggedUser?.role === 'admin' || loggedUser?.role === 'dev'
      ? events
      : events.filter(
          (event) =>
            !event.usersStatusAccess ||
            event.usersStatusAccess[loggedUser?.status ?? 'novice']
        )
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  return (
    <>
      {visibleEvents?.length > 0 ? (
        visibleEvents.map((event) => (
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
