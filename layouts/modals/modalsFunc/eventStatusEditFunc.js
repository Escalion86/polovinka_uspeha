import EventStatusPicker from '@components/ValuePicker/EventStatusPicker'
import { DEFAULT_EVENT } from '@helpers/constants'
import isEventExpiredFunc from '@helpers/isEventExpired'
import itemsFuncAtom from '@state/itemsFuncAtom'
// import eventFullAtomAsync from '@state/async/eventFullAtomAsync'
import expectedIncomeOfEventSelector from '@state/selectors/expectedIncomeOfEventSelector'
import totalIncomeOfEventSelector from '@state/selectors/totalIncomeOfEventSelector'
import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import eventSelector from '@state/selectors/eventSelector'

const eventStatusEditFunc = (eventId) => {
  const EventStatusEditModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const event = useAtomValue(eventSelector(eventId))
    const setEvent = useAtomValue(itemsFuncAtom).event.set
    const isEventExpired = isEventExpiredFunc(event)

    const totalIncome = useAtomValue(totalIncomeOfEventSelector(eventId))
    const expectedIncome = useAtomValue(expectedIncomeOfEventSelector(eventId))
    const canSetClosed = totalIncome >= expectedIncome && isEventExpired

    const [status, setStatus] = useState(event?.status ?? DEFAULT_EVENT.status)

    if (!event || !eventId)
      return (
        <div className="flex justify-center w-full text-lg ">
          ОШИБКА! Мероприятие не найдено!
        </div>
      )

    const onClickConfirm = async () => {
      closeModal()
      setEvent({
        _id: event?._id,
        status,
      })
    }

    useEffect(() => {
      const isFormChanged = event?.status !== status
      setDisableConfirm(!isFormChanged)
      setOnConfirmFunc(isFormChanged ? onClickConfirm : undefined)
    }, [status])

    return (
      <div className="flex flex-col gap-y-2">
        <EventStatusPicker
          required
          status={status}
          onChange={setStatus}
          disabledValues={canSetClosed ? [] : ['closed']}
        />
        {!canSetClosed && (
          <>
            <div className="text-red-500">
              Закрытие мероприятия не доступно так как:
            </div>
            <ul className="ml-4 -mt-2 list-disc">
              {totalIncome < expectedIncome && (
                <li className="text-red-500">
                  финансы мероприятия не полностью заполнены
                </li>
              )}
              {!isEventExpired && (
                <li className="text-red-500">мероприятие не завершено</li>
              )}
            </ul>
          </>
        )}
      </div>
    )
  }

  return {
    title: `Редактирование статуса мероприятия`,
    confirmButtonName: 'Применить',
    Children: EventStatusEditModal,
    // TopLeftComponent: () => (
    //   <CardButtons
    //     item={{ _id: eventId }}
    //     typeOfItem="event"
    //     forForm
    //     direction="right"
    //   />
    // ),
  }
}

export default eventStatusEditFunc
