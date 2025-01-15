import FormWrapper from '@components/FormWrapper'
import { getData } from '@helpers/CRUD'
import useSnackbar from '@helpers/useSnackbar'
// import eventSelector from '@state/selectors/eventSelector'
import { useEffect } from 'react'
import { useAtomValue } from 'jotai'
import locationAtom from '@state/atoms/locationAtom'

const notificateAboutEventTelegramFunc = (eventId) => {
  const NotificationsTelegramModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const location = useAtomValue(locationAtom)
    // const event = useAtomValue(eventSelector(eventId))
    const { success, error } = useSnackbar()

    const onClickConfirm = async () => {
      await getData(
        `/api/${location}/events/notificate`,
        {
          eventId,
        },
        () => {
          success('Пользователи уведомлены о мероприятии')
        },
        () => {
          error('Ошибка отправки уведомлений о мероприятии пользователям')
        },
        false
      )
      closeModal()
    }

    useEffect(() => {
      setOnConfirmFunc(onClickConfirm)
    }, [])

    return (
      <FormWrapper>
        Отправить уведомление о мероприятии пользователям?
      </FormWrapper>
    )
  }

  return {
    title: `Отправка уведомлений Telegram`,
    confirmButtonName: 'Отправить уведомления',
    // onDecline: onCancel,
    declineButtonName: 'Закрыть',
    // declineButtonBgClassName: 'bg-general',
    Children: NotificationsTelegramModal,
  }
}

export default notificateAboutEventTelegramFunc
