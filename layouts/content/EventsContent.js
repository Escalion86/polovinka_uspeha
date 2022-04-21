import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import getNoun from '@helpers/getNoun'
import formatDateTime from '@helpers/formatDateTime'

const EventsContent = ({ user, events, directions, reviews }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  return (
    // <div className="flex flex-col w-full h-full py-1 bg-opacity-15 gap-y-2 bg-general">
    events ? (
      events.map((event) => (
        <div
          key={event._id}
          className="flex duration-300 bg-white border-t border-b border-gray-400 shadow-sm cursor-pointer gap-x-2 hover:shadow-medium-active"
          onClick={() => modalsFunc.event(event)}
        >
          {event.image && (
            // <div className="flex justify-center w-full tablet:w-auto">
            <img
              className="object-cover w-32 h-32 tablet:w-40 tablet:h-40"
              src={event.image}
              alt="event"
              // width={48}
              // height={48}
            />
            // </div>
          )}
          <div className="flex flex-col">
            <div className="text-xl font-bold">{event.title}</div>
            <div className="flex-1">{event.description}</div>
            {event.address && <div className="">Адрес: {event.address}</div>}
            <div className="text-lg font-bold text-general">
              {formatDateTime(event.date)}
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="flex justify-center p-2">Нет мероприятий</div>
    )
  )
}

export default EventsContent
