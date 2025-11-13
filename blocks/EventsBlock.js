import { useState } from 'react'
import { useAtomValue } from 'jotai'

import BlockContainer from '@components/BlockContainer'
import { P } from '@components/tags'
import isEventCanceledFunc from '@helpers/isEventCanceled'
import isEventExpiredFunc from '@helpers/isEventExpired'
import filteredEventsSelector from '@state/selectors/filteredEventsSelector'
import cn from 'classnames'
import Link from 'next/link'
import CountDown from './components/CountDown'
import dynamic from 'next/dynamic'
import locationAtom from '@state/atoms/locationAtom'
import useEnsureEventsLoaded from '@hooks/useEnsureEventsLoaded'
const EventCardLight = dynamic(() => import('@layouts/cards/EventCardLight'))

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
    <Link
      prefetch={false}
      href={href}
      shallow
      className={cn(
        'px-4 py-2 text-xl text-white duration-300 border rounded-lg bg-general border-general tablet:w-auto hover:text-general hover:bg-white hover:border-general',
        className
      )}
    >
      {title}
    </Link>
  )
}

const EventsBlock = ({
  maxEvents = null,
  hideBlockOnZeroEvents = false,
  title = 'Ближайшие мероприятия',
}) => {
  useEnsureEventsLoaded('upcoming')

  const location = useAtomValue(locationAtom)

  const [maxShowedEvents, setMaxShowedEvents] = useState(maxEvents ?? 10)

  const events = useAtomValue(filteredEventsSelector)

  const filteredEvents = events.filter(
    (event) =>
      !isEventExpiredFunc(event) && !isEventCanceledFunc(event) && !event.blank
  )

  if (hideBlockOnZeroEvents && filteredEvents?.length === 0) return null

  return (
    <BlockContainer id="events" title={title} altBg className="items-center">
      {filteredEvents.length > 0 ? (
        <div className="flex flex-col items-center w-full gap-4">
          {[...filteredEvents]
            .sort((a, b) => (a.dateStart < b.dateStart ? -1 : 1))
            .slice(0, maxShowedEvents)
            .map((event, index) => (
              <EventCardLight key={event._id} eventId={event._id} />
            ))}
          {maxEvents && filteredEvents?.length > maxShowedEvents && (
            <Button title="Посмотреть все" href={`/${location}/events`} />
          )}
          {!maxEvents && filteredEvents?.length > maxShowedEvents && (
            <Button
              title="Посмотреть ещё"
              onClick={() => setMaxShowedEvents((state) => state + 10)}
            />
          )}
        </div>
      ) : (
        <CountDown>
          <P className="flex justify-center w-full">
            {'Мероприятий не запланировано'}
          </P>
        </CountDown>
      )}
    </BlockContainer>
  )
}

export default EventsBlock
