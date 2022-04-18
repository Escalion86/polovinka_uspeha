import BlockContainer from '@components/BlockContainer'
import { H3, H4, P } from '@components/tags'
import formatDateTime from '@helpers/formatDateTime'
import cn from 'classnames'

const Button = ({ title, className, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      'px-4 py-2 text-xl text-white duration-300 border rounded-lg bg-general border-general tablet:w-auto hover:text-general hover:bg-white hover:border-general',
      className
    )}
  >
    {title}
  </button>
)

const CardEvent = ({ event }) => (
  <div className="flex flex-col flex-1 w-full overflow-hidden bg-white border border-gray-600 rounded-lg max-w-100 tablet:max-w-none tablet:flex-row gap-y-2">
    {event.image && (
      <div className="flex justify-center w-full tablet:w-auto">
        <img
          className="object-cover w-full tablet:w-40 h-70 phoneH:h-80 tablet:h-40"
          src={event.image}
          alt="event"
          // width={48}
          // height={48}
        />
      </div>
    )}
    <div className="flex flex-col flex-1">
      <div className="flex flex-col flex-1 px-4 py-2">
        <div className="flex justify-center w-full">
          <H4>{event.title}</H4>
        </div>
        <P className="flex-1">{event.description}</P>
        {event.address && <div className="">Адрес: {event.address}</div>}
      </div>
      <div className="flex items-center">
        <div className="flex-1 px-4 text-lg font-bold text-general">
          {formatDateTime(event.date)}
        </div>
        <button className="px-4 py-1 text-white duration-300 border-t border-l rounded-tl-lg bg-general hover:text-general hover:bg-white border-general">
          Записаться
        </button>
      </div>
    </div>
  </div>
)

const TimeTableBlock = ({ events }) => {
  if (!events) return null
  return (
    <BlockContainer id="timetable" className="bg-gray-200">
      <H3>Ближайшие мероприятия</H3>
      {/* <div className="grid gap-6 tablet:grid-cols-2 laptop:grid-cols-4"> */}
      <div className="flex flex-col items-center w-full gap-4">
        {events &&
          events
            .slice(0, 4)
            .sort((a, b) => (a.date < b.date ? -1 : 1))
            .map((event, index) => (
              <CardEvent key={'event' + index} event={event} />
            ))}
        <Button title="Посмотреть все" />
      </div>
    </BlockContainer>
  )
}

export default TimeTableBlock
