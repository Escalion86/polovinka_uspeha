import DateTimeEvent from '@components/DateTimeEvent'
import HistoryItem from '@components/HistoryItem'
import LoadingSpinner from '@components/LoadingSpinner'
import { getData } from '@helpers/CRUD'
import compareObjectsWithDif from '@helpers/compareObjectsWithDif'
import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import EventKeyValueItem from './historyKeyValuesItems/EventKeyValueItem'
import { eventKeys } from './historyKeyValuesItems/keys'
import itemsFuncAtom from '@state/itemsFuncAtom'
import modalsFuncAtom from '@state/modalsFuncAtom'
import dateToDateTimeStr from '@helpers/dateToDateTimeStr'
import eventSelector from '@state/selectors/eventSelector'
import locationAtom from '@state/atoms/locationAtom'

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
    const location = useAtomValue(locationAtom)
    const modalsFunc = useAtomValue(modalsFuncAtom)
    const event = useAtomValue(eventSelector(eventId))
    const [eventHistory, setEventHistory] = useState()
    const setEvent = useAtomValue(itemsFuncAtom).event.set

    if (!event || !eventId)
      return (
        <div className="flex justify-center w-full text-lg ">
          ОШИБКА! Мероприятие не найдено!
        </div>
      )

    useEffect(() => {
      const fetchData = async () => {
        const result = await getData(`/api/${location}/histories`, {
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
                      const { data, difference } = eventHistory[i]
                      const changes = difference
                        ? data[0]
                        : compareObjectsWithDif(
                            index > 0 ? eventHistory[index - 1].data[0] : {},
                            data[0]
                          )
                      Object.keys(changes).forEach((key) => {
                        redoChanges[key] =
                          i === index ? changes[key].old : changes[key].new
                      })
                    }
                    // console.log('eventHistory :>> ', eventHistory)

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
                          action !== 'add'
                            ? () => {
                                modalsFunc.confirm({
                                  title: 'Откат изменений мероприятия',
                                  text: (
                                    <div className="flex flex-col gap-y-1">
                                      <div>
                                        Подтверждение отката внесет изменения в
                                        мероприятие, создав новое действие в
                                        истории (тоесть действие обратимо).
                                      </div>
                                      <div>{`Мероприятие будет преведено к виду на момент ДО изменения от ${dateToDateTimeStr(createdAt, true, false)}, тоесть все изменения сделанные в это время, а также все последующие будут отменены (но НЕ удалены)!`}</div>
                                      <div className="flex justify-center pt-1 pb-1 mt-2 text-lg font-bold border-t border-gray-400">
                                        Будут применены следующие изменения:
                                      </div>
                                      {Object.entries(redoChanges)
                                        .filter(
                                          ([key, value]) =>
                                            ![
                                              '_id',
                                              'createdAt',
                                              'updatedAt',
                                              '__v',
                                              'lastActivityAt',
                                              'prevActivityAt',
                                            ].includes(key)
                                        )
                                        .map(([key, value]) => {
                                          return (
                                            <div className="flex flex-wrap justify-start gap-x-1">
                                              <div className="font-bold">
                                                {eventKeys[key] ?? key}:
                                              </div>
                                              <EventKeyValueItem
                                                objKey={key}
                                                value={value}
                                              />
                                            </div>
                                          )
                                        })}
                                    </div>
                                  ),
                                  onConfirm: () =>
                                    setEvent({
                                      ...redoChanges,
                                      _id: event._id,
                                    }),
                                })
                              }
                            : undefined
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
