import goToUrlForAddEventToCalendar from '@helpers/goToUrlForAddEventToCalendar'
import { asyncEventsUsersByEventIdSelector } from '@state/asyncSelectors/asyncEventsUsersByEventIdAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import { useEffect } from 'react'
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from 'recoil'

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
    const loggedUser = useRecoilValue(loggedUserAtom)
    const itemsFunc = useRecoilValue(itemsFuncAtom)

    const eventId = event._id

    const refreshEventState = useRecoilRefresher_UNSTABLE(
      asyncEventsUsersByEventIdSelector(eventId)
    )

    const onClickConfirm = async (onSuccess) => {
      closeModal()
      itemsFunc.event.signUp(
        {
          eventId,
          userId: loggedUser?._id,
          status: 'reserve',
          userStatus: loggedUser.status,
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
          if (typeof onSuccess === 'function') onSuccess()
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

    return <></>
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
