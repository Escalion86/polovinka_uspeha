import BlockContainer from '@components/BlockContainer'
import { H2, H3, H4, P } from '@components/tags'
import formatAddress from '@helpers/formatAddress'
import formatDateTime from '@helpers/formatDateTime'
import EventCard from '@layouts/cards/EventCard'
import { modalsFuncAtom } from '@state/atoms'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import eventsUsersSelectorByEventId from '@state/selectors/eventsUsersByEventIdSelector'
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

// const CardEvent = ({ event }) => {
//   const modalsFunc = useRecoilValue(modalsFuncAtom)
//   const loggedUser = useRecoilValue(loggedUserAtom)
//   const eventUsers = useRecoilValue(eventsUsersSelectorByEventId(event._id))
//   const eventUser = loggedUser?._id
//     ? eventUsers.find((item) => item.userId === loggedUser._id)
//     : null

//   return (
//     <div
//       onClick={() => modalsFunc.event.view(event._id)}
//       className="flex flex-col flex-1 w-full overflow-hidden duration-300 bg-white border border-gray-600 rounded-lg cursor-pointer hover:shadow-active max-w-100 tablet:max-w-none tablet:flex-row gap-y-2"
//     >
//       {event?.images && event.images.length > 0 && (
//         <div className="flex justify-center w-full tablet:w-auto">
//           <img
//             className="object-cover w-full tablet:w-40 h-70 phoneH:h-80 tablet:h-40"
//             src={event.images[0]}
//             alt="event"
//             // width={48}
//             // height={48}
//           />
//         </div>
//       )}
//       <div className="flex flex-col flex-1">
//         <div className="flex flex-col flex-1 px-4 py-2">
//           <div className="flex justify-center w-full">
//             <H4>{event.title}</H4>
//           </div>
//           <P className="flex-1">{event.description}</P>
//           {event.address && (
//             <div className="">Адрес: {formatAddress(event.address)}</div>
//           )}
//         </div>
//         <div className="flex items-center">
//           <div className="flex-1 px-4 text-lg font-bold text-general">
//             {formatDateTime(event.date)}
//           </div>
//           <button
//             onClick={(e) => {
//               e.stopPropagation()
//               if (eventUser) modalsFunc.event.signOut(event._id)
//               else modalsFunc.event.signUp(event._id)
//             }}
//             className={cn(
//               'px-4 py-1 text-white duration-300 border-t border-l rounded-tl-lg hover:bg-white',
//               eventUser
//                 ? 'bg-success hover:text-success border-success'
//                 : 'bg-general hover:text-general border-general'
//             )}
//           >
//             {eventUser ? 'Записан' : 'Записаться'}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

const EventsBlock = ({
  events,
  maxEvents = null,
  hideBlockOnZeroEvents = false,
  title,
}) => {
  const [maxShowedEvents, setMaxShowedEvents] = useState(maxEvents ?? 10)

  const loggedUser = useRecoilValue(loggedUserAtom)

  const visibleEvents =
    loggedUser?.role === 'admin' || loggedUser?.role === 'dev'
      ? events
      : events.filter(
          (event) =>
            event.status !== 'canceled' &&
            (!event.usersStatusAccess ||
              event.usersStatusAccess[loggedUser?.status ?? 'novice'])
        )

  const filteredEvents = visibleEvents.slice(0, maxShowedEvents)

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
                key={'event' + index}
                eventId={event._id}
                noButtons={
                  loggedUser?.role !== 'admin' && loggedUser?.role !== 'dev'
                }
              />
              // <CardEvent key={'event' + index} event={event} />
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
