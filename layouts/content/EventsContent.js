import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import getNoun from '@helpers/getNoun'
import formatDateTime from '@helpers/formatDateTime'
import Fab from '@components/Fab'
import CardButtons from '@components/CardButtons'
import formatAddress from '@helpers/formatAddress'
import loadingEventsAtom from '@state/atoms/loadingEventsAtom'

const EventsContent = (props) => {
  const { events } = props
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  return (
    <>
      {events?.length > 0 ? (
        events.map((event) => {
          const loading = useRecoilValue(loadingEventsAtom(event._id))

          return (
            <div
              key={event._id}
              className="flex duration-300 bg-white border-t border-b border-gray-400 shadow-sm cursor-pointer gap-x-2 hover:shadow-medium-active"
              onClick={() => modalsFunc.event.signUp(event)}
            >
              {event.image && (
                // <div className="flex justify-center w-full tablet:w-auto">
                <img
                  className="object-cover w-32 h-32 min-w-32 min-h-32 tablet:w-40 tablet:h-40"
                  src={event.image}
                  alt="event"
                  // width={48}
                  // height={48}
                />
                // </div>
              )}
              <div className="flex flex-col flex-1">
                <div className="flex">
                  <div className="flex-1 text-xl font-bold">
                    {event.title}{' '}
                    {loading && (
                      <span className="text-red-700">Загружается</span>
                    )}
                  </div>
                  <CardButtons item={event} typeOfItem="event" />
                </div>
                <div className="flex-1">{event.description}</div>
                <div className="flex flex-col flex-wrap justify-between tablet:flex-row">
                  {event.address && (
                    <div className="">
                      Адрес: {formatAddress(event.address)}
                    </div>
                  )}
                  <div className="text-lg font-bold text-general">
                    {formatDateTime(event.date)}
                  </div>
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <div className="flex justify-center p-2">Нет мероприятий</div>
      )}
      <Fab onClick={() => modalsFunc.event.edit()} show />
    </>
  )
}

export default EventsContent
