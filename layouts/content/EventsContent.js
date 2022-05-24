import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import formatDateTime from '@helpers/formatDateTime'
import Fab from '@components/Fab'
import CardButtons from '@components/CardButtons'
import formatAddress from '@helpers/formatAddress'
import loadingAtom from '@state/atoms/loadingAtom'
import eventsAtom from '@state/atoms/eventsAtom'
import eventSelector from '@state/selectors/eventSelector'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import { CardWrapper } from '@components/CardWrapper'

const EventCard = ({ eventId }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const event = useRecoilValue(eventSelector(eventId))
  const loading = useRecoilValue(loadingAtom('event' + eventId))
  const itemFunc = useRecoilValue(itemsFuncAtom)

  return (
    <CardWrapper
      loading={loading}
      onClick={() => !loading && modalsFunc.event.signUp(event._id)}
      showOnSite={event.showOnSite}
    >
      {event?.images && event.images.length > 0 && (
        // <div className="flex justify-center w-full tablet:w-auto">
        <img
          className="object-cover w-32 h-32 min-w-32 min-h-32 tablet:w-40 tablet:h-40"
          src={event.images[0]}
          alt="event"
          // width={48}
          // height={48}
        />
        // </div>
      )}
      <div className="flex flex-col flex-1">
        <div className="flex">
          <div className="flex-1 text-xl font-bold">{event.title}</div>
          <CardButtons
            item={event}
            typeOfItem="event"
            showOnSiteOnClick={() => {
              itemFunc.event.set({
                _id: event._id,
                showOnSite: !event.showOnSite,
              })
            }}
          />
        </div>
        <div className="flex-1">{event.description}</div>
        <div className="flex flex-col-reverse justify-between tablet:flex-row-reverse">
          <div className="text-lg font-bold leading-5 text-right whitespace-normal min-w-32 tablet:whitespace-pre-wrap text-general">
            {formatDateTime(event.date, false, false, true, true)}
          </div>
          {event.address && (
            <div className="flex leading-5 gap-x-1">
              <span className="italic font-bold">Адрес:</span>{' '}
              {formatAddress(event.address)}
            </div>
          )}
        </div>
      </div>
    </CardWrapper>
  )
}

const EventsContent = () => {
  const events = useRecoilValue(eventsAtom)
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  return (
    <>
      {events?.length > 0 ? (
        events.map((event) => <EventCard key={event._id} eventId={event._id} />)
      ) : (
        <div className="flex justify-center p-2">Нет мероприятий</div>
      )}
      <Fab onClick={() => modalsFunc.event.add()} show />
    </>
  )
}

export default EventsContent
