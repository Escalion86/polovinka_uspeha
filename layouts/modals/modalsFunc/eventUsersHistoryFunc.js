import DateTimeEvent from '@components/DateTimeEvent'
import LoadingSpinner from '@components/LoadingSpinner'
import { getData } from '@helpers/CRUD'
import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import eventSelector from '@state/selectors/eventSelector'
import HistoriesOfEvent from '@layouts/content/HistoriesComponents/HistoriesOfEvent'
import locationAtom from '@state/atoms/locationAtom'

const eventUsersHistoryFunc = (eventId) => {
  const EventUsersHistoryFuncModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const location = useAtomValue(locationAtom)
    const event = useAtomValue(eventSelector(eventId))
    const [eventUsersHistory, setEventUsersHistory] = useState()

    if (!event || !eventId)
      return (
        <div className="flex justify-center w-full text-lg ">
          ОШИБКА! Мероприятие не найдено!
        </div>
      )

    useEffect(() => {
      const fetchData = async () => {
        const result = await getData(`/api/${location}/histories`, {
          schema: 'eventsusers',
          // data: { $in: [{ eventId }] },
          'data.eventId': eventId,
        })
        setEventUsersHistory(result)
      }
      fetchData().catch(console.error)
    }, [])

    return (
      <div className="flex flex-col items-center flex-1 gap-y-2">
        <div className="text-lg font-bold">{event.title}</div>
        <DateTimeEvent
          wrapperClassName="text-base laptop:text-lg font-bold leading-4 laptop:leading-5 justify-center laptop:justify-start"
          dateClassName="text-general"
          timeClassName="italic"
          durationClassName="italic text-base font-normal"
          event={event}
          showDayOfWeek
          fullMonth
        />
        {eventUsersHistory ? (
          <HistoriesOfEvent histories={eventUsersHistory} className="w-full" />
        ) : (
          <LoadingSpinner />
        )}
      </div>
    )
  }

  return {
    title: `История записей на мероприятие`,
    Children: EventUsersHistoryFuncModal,
    declineButtonName: 'Закрыть',
    showDecline: true,
  }
}

export default eventUsersHistoryFunc
