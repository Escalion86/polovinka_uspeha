import BlockContainer from '@components/BlockContainer'
import { H2 } from '@components/tags'
import isEventExpiredFunc from '@helpers/isEventExpired'
import visibleEventsForUser from '@helpers/visibleEventsForUser'
import EventCard from '@layouts/cards/EventCard'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import eventsUsersByUserIdSelector from '@state/selectors/eventsUsersByUserIdSelector'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import cn from 'classnames'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'

const Button = ({ title, className, href, onClick }) => {
  if (onClick)
    return (
      <button
        className={cn(
          'px-4 py-2 text-xl text-white duration-300 border rounded-lg bg-general border-general tablet:w-auto hover:text-general hover:bg-white hover:border-general',
          className
        )}
        onClick={onClick}
      >
        {title}
      </button>
    )
  return (
    <Link href={href}>
      <a
        className={cn(
          'px-4 py-2 text-xl text-white duration-300 border rounded-lg bg-general border-general tablet:w-auto hover:text-general hover:bg-white hover:border-general',
          className
        )}
      >
        {title}
      </a>
    </Link>
  )
}

const EventsBlock = ({
  events,
  maxEvents = null,
  hideBlockOnZeroEvents = false,
  title,
}) => {
  const [maxShowedEvents, setMaxShowedEvents] = useState(maxEvents ?? 10)

  const loggedUser = useRecoilValue(loggedUserAtom)
  const loggedUserActiveStatus = useRecoilValue(loggedUserActiveStatusAtom)
  const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)
  const eventsLoggedUser = useRecoilValue(
    eventsUsersByUserIdSelector(loggedUser?._id)
  )

  const filteredEvents = useMemo(
    () =>
      visibleEventsForUser(
        events,
        eventsLoggedUser,
        loggedUser,
        true,
        isLoggedUserAdmin,
        loggedUserActiveStatus
      )
        .filter((event) => !isEventExpiredFunc(event))
        .slice(0, maxShowedEvents),
    [loggedUser, isLoggedUserAdmin, loggedUserActiveStatus, maxShowedEvents]
  )

  // const visibleEvents = (
  //   isLoggedUserAdmin
  //     ? events
  //     : events.filter(
  //         (event) =>
  //           event.status !== 'canceled' &&
  //           (!event.usersStatusAccess ||
  //             event.usersStatusAccess[loggedUserActiveStatus ?? 'novice'])
  //       )
  // ).filter((event) => !isEventExpiredFunc(event))

  // const filteredEvents = visibleEvents.slice(0, maxShowedEvents)

  if (hideBlockOnZeroEvents && filteredEvents?.length === 0) return null

  return (
    <BlockContainer id="events" altBg>
      <H2>{title}</H2>
      {/* <div className="grid gap-6 tablet:grid-cols-2 laptop:grid-cols-4"> */}
      <div className="flex flex-col items-center w-full gap-4">
        {
          // filteredEvents?.length ? (
          [...filteredEvents]
            .sort((a, b) => (a.date < b.date ? -1 : 1))
            .map((event, index) => (
              <EventCard
                key={event._id}
                eventId={event._id}
                // noButtons={
                //   loggedUser?.role !== 'admin' && loggedUser?.role !== 'dev'
                // }
              />
              // <CardEvent key={event._id} event={event} />
            ))
          // )
          //  : (
          //   <P>Будущих мероприятий не запланировано</P>
          // )
        }
        {maxEvents && events?.length > maxShowedEvents && (
          <Button title="Посмотреть все" href="/events#events" />
        )}
        {!maxEvents && events?.length > maxShowedEvents && (
          <Button
            title="Посмотреть ещё"
            onClick={() => setMaxShowedEvents((state) => state + 10)}
          />
        )}
      </div>
    </BlockContainer>
  )
}

export default EventsBlock
