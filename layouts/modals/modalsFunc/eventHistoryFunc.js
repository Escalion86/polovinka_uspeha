import DateTimeEvent from '@components/DateTimeEvent'
import HistoryItem from '@components/HistoryItem'
import LoadingSpinner from '@components/LoadingSpinner'
import { getData } from '@helpers/CRUD'
import compareObjectsWithDif from '@helpers/compareObjectsWithDif'
import eventSelector from '@state/selectors/eventSelector'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import EventKeyValueItem from './historyKeyValuesItems/EventKeyValueItem'
import { eventKeys } from './historyKeyValuesItems/keys'

const eventHistoryFunc = (eventId) => {
  const EventHistoryModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const event = useRecoilValue(eventSelector(eventId))
    const [eventHistory, setEventHistory] = useState()

    if (!event || !eventId)
      return (
        <div className="flex justify-center w-full text-lg ">
          ОШИБКА! Мероприятие не найдено!
        </div>
      )

    useEffect(() => {
      const fetchData = async () => {
        const result = await getData(`/api/histories`, {
          schema: 'events',
          'data._id': eventId,
        })
        setEventHistory(result)
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
        {eventHistory ? (
          <div className="flex flex-col-reverse w-full gap-y-1">
            {eventHistory.length === 0
              ? 'Нет записей'
              : eventHistory.map(
                  (
                    { action, data, userId, createdAt, _id, difference },
                    index
                  ) => {
                    const changes = difference
                      ? data[0]
                      : compareObjectsWithDif(
                          index > 0 ? eventHistory[index - 1].data[0] : {},
                          data[0]
                        )

                    return (
                      <HistoryItem
                        key={_id}
                        action={action}
                        changes={changes}
                        createdAt={createdAt}
                        userId={userId}
                        keys={eventKeys}
                        KeyValueItem={EventKeyValueItem}
                      />
                    )
                  }
                )}
          </div>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    )
  }

  return {
    title: `История изменений мероприятия`,
    Children: EventHistoryModal,
    declineButtonName: 'Закрыть',
    showDecline: true,
  }
}

export default eventHistoryFunc
