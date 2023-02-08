import BlockContainer from '@components/BlockContainer'
import { P } from '@components/tags'
import isEventCanceledFunc from '@helpers/isEventCanceled'
import isEventExpiredFunc from '@helpers/isEventExpired'
import EventCard from '@layouts/cards/EventCard'
import filteredEventsSelector from '@state/selectors/filteredEventsSelector'
import cn from 'classnames'
import Link from 'next/link'
import { useState } from 'react'
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
    <Link href={href} shallow>
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
  maxEvents = null,
  hideBlockOnZeroEvents = false,
  title = 'Ближайшие мероприятия',
}) => {
  const [maxShowedEvents, setMaxShowedEvents] = useState(maxEvents ?? 10)

  const events = useRecoilValue(filteredEventsSelector)

  const filteredEvents = events.filter(
    (event) => !isEventExpiredFunc(event) && !isEventCanceledFunc(event)
  )

  if (hideBlockOnZeroEvents && filteredEvents?.length === 0) return null

  return (
    <BlockContainer id="events" title={title} altBg>
      {/* <H2>{title}</H2> */}
      {/* <div className="grid gap-6 tablet:grid-cols-2 laptop:grid-cols-4"> */}
      {filteredEvents.length > 0 ? (
        <div className="flex flex-col items-center w-full gap-4">
          {
            // filteredEvents?.length ? (
            [...filteredEvents]
              .sort((a, b) => (a.dateStart < b.dateStart ? -1 : 1))
              .slice(0, maxShowedEvents)
              .map((event, index) => (
                <EventCard key={event._id} eventId={event._id} />
              ))
            // )
            //  : (
            //   <P>Будущих мероприятий не запланировано</P>
            // )
          }
          {maxEvents && filteredEvents?.length > maxShowedEvents && (
            <Button title="Посмотреть все" href="/events#events" />
          )}
          {!maxEvents && filteredEvents?.length > maxShowedEvents && (
            <Button
              title="Посмотреть ещё"
              onClick={() => setMaxShowedEvents((state) => state + 10)}
            />
          )}
        </div>
      ) : (
        <P className="flex justify-center w-full">
          {'Мероприятий не запланировано'}
        </P>
      )}
    </BlockContainer>
  )
}

export default EventsBlock
