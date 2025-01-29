import isEventClosedFunc from '@helpers/isEventClosed'
import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import eventSelector from '@state/selectors/eventSelector'
import paymentsByEventIdSelector from '@state/selectors/paymentsByEventIdSelector'
import asyncEventsUsersByEventIdAtom from '@state/async/asyncEventsUsersByEventIdAtom'
import itemsFuncAtom from '@state/itemsFuncAtom'

const eventDeleteFunc = (eventId) => {
  const EventDeleteModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const event = useAtomValue(eventSelector(eventId))
    const isEventClosed = isEventClosedFunc(event)
    const payments = useAtomValue(paymentsByEventIdSelector(eventId))
    const eventUsers = useAtomValue(asyncEventsUsersByEventIdAtom(eventId))
    const deleteEvent = useAtomValue(itemsFuncAtom).event.delete
    const [isEventDeleting, setIsEventDeleting] = useState(false)

    if (!isEventDeleting && (!event || !eventId))
      return (
        <div className="flex justify-center w-full text-lg ">
          ОШИБКА! Мероприятие не найдено!
        </div>
      )

    const onClickConfirm = async () => {
      setIsEventDeleting(true)
      closeModal()
      deleteEvent(event?._id)
    }

    const canDelete = !(
      payments?.length > 0 ||
      eventUsers?.length > 0 ||
      isEventClosed
    )

    useEffect(() => {
      setDisableConfirm(!canDelete)
      setOnConfirmFunc(canDelete ? onClickConfirm : undefined)
    }, [canDelete])

    if (isEventDeleting) return <div>Удаление мероприятия...</div>

    return (
      <div className="flex flex-col gap-y-2">
        {canDelete ? (
          'Вы уверены, что хотите удалить мероприятие?'
        ) : (
          <div className="flex flex-col gap-y-2">
            <div className="text-red-500">
              Удаление мероприятия не доступно так как:
            </div>
            <ul className="ml-4 -mt-2 list-disc">
              {payments?.length > 0 && (
                <li className="text-red-500">мероприятие имеет платежи</li>
              )}
              {eventUsers?.length > 0 && (
                <li className="text-red-500">мероприятие имеет участников</li>
              )}
              {isEventClosed && (
                <li className="text-red-500">мероприятие закрыто</li>
              )}
            </ul>
          </div>
        )}
      </div>
    )
  }

  return {
    title: `Удаление мероприятия`,
    confirmButtonName: 'Удалить мероприятие',
    Children: EventDeleteModal,
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

export default eventDeleteFunc
