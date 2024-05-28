import DateTimeEvent from '@components/DateTimeEvent'
import HistoryItem from '@components/HistoryItem'
import LoadingSpinner from '@components/LoadingSpinner'
import { getData } from '@helpers/CRUD'
import compareObjectsWithDif from '@helpers/compareObjectsWithDif'
// import eventFullAtomAsync from '@state/async/eventFullAtomAsync'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import EventKeyValueItem from './historyKeyValuesItems/EventKeyValueItem'
import { eventKeys } from './historyKeyValuesItems/keys'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import { modalsFuncAtom } from '@state/atoms'
import dateToDateTimeStr from '@helpers/dateToDateTimeStr'
import eventSelector from '@state/selectors/eventSelector'

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
    const modalsFunc = useRecoilValue(modalsFuncAtom)
    const event = useRecoilValue(eventSelector(eventId))
    const [eventHistory, setEventHistory] = useState()
    const setEvent = useRecoilValue(itemsFuncAtom).event.set

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
                    // console.log('index :>> ', index)
                    // console.log('data[0] :>> ', data[0])
                    const redoChanges = {}
                    for (let i = eventHistory.length - 1; i >= index; i--) {
                      // console.log('i :>> ', i)
                      const { data, difference } = eventHistory[i]
                      const changes = difference
                        ? data[0]
                        : compareObjectsWithDif(
                            index > 0 ? eventHistory[index - 1].data[0] : {},
                            data[0]
                          )
                      Object.keys(changes).forEach((key) => {
                        redoChanges[key] =
                          i === index ? changes[key].new : changes[key].old
                      })
                    }

                    return (
                      <HistoryItem
                        key={_id}
                        action={action}
                        changes={changes}
                        createdAt={createdAt}
                        userId={userId}
                        keys={eventKeys}
                        KeyValueItem={EventKeyValueItem}
                        onClickRedo={
                          // () => console.log('redoChanges :>> ', redoChanges)
                          () =>
                            modalsFunc.confirm({
                              title: 'Откат изменений мероприятия',
                              text:
                                'Подтверждение отката внесет изменения в мероприятие, преведя его к виду на момент последнего изменения от ' +
                                dateToDateTimeStr(createdAt, true, false),
                              onConfirm: () =>
                                setEvent({ ...redoChanges, _id: event._id }),
                            })
                        }
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
