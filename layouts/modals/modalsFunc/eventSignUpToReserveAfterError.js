import goToUrlForAddEventToCalendar from '@helpers/goToUrlForAddEventToCalendar'
import asyncEventsUsersByEventIdAtom from '@state/async/asyncEventsUsersByEventIdAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import { useEffect } from 'react'
import { useAtom, useAtomValue } from 'jotai'

const eventSignUpToReserveAfterError = (event, error, comment, subEventId) => {
  const EventSignUpToReserveAfterErrorModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnConfirm2Func,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const loggedUserActive = useAtomValue(loggedUserActiveAtom)
    const itemsFunc = useAtomValue(itemsFuncAtom)

    const eventId = event._id

    const [, refreshEventState] = useAtom(
      asyncEventsUsersByEventIdAtom(eventId)
    )

    const onClickConfirm = async (onSuccess) => {
      closeModal()
      itemsFunc.event.signUp(
        {
          eventId,
          userId: loggedUserActive?._id,
          status: 'reserve',
          userStatus: loggedUserActive.status,
          comment,
          subEventId,
        },
        (data) => {
          if (data.error === 'мероприятие закрыто') {
            fixEventStatus(eventId, 'closed')
          }
          if (data.error === 'мероприятие отменено') {
            fixEventStatus(eventId, 'canceled')
          }
        },
        () => {
          if (typeof onSuccess === 'function')
            onSuccess(event, 'reserve', comment, subEventId)
        }
      )
    }

    useEffect(() => {
      setOnConfirmFunc(onClickConfirm)
      setOnConfirm2Func(() =>
        onClickConfirm(() => goToUrlForAddEventToCalendar(event))
      )
    }, [])

    useEffect(() => refreshEventState(), [])

    const subEvent =
      event?.subEvents?.length > 1 && subEventId
        ? event?.subEvents.find(({ id }) => id === subEventId)
        : undefined

    return (
      <>
        {subEvent && (
          <div>
            Выбран вариант записи на мероприятие:{' '}
            <strong>{subEvent.title}</strong>
          </div>
        )}
      </>
    )
  }

  return {
    title: `Запись в резерв на мероприятие`,
    text: `К сожалению не удалось записаться на мероприятие в основной состав, так как ${error}. Однако вы можете записаться на мероприятие в резерв, и как только место освободиться вы будете приняты в основной состав. Записаться в резерв на мероприятие?`,
    confirmButtonName: `Записаться в резерв`,
    confirmButtonName2: `Записаться в резерв и добавить в календарь`,
    Children: EventSignUpToReserveAfterErrorModal,
  }
}

export default eventSignUpToReserveAfterError
