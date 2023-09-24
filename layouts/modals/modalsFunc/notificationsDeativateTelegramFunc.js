import FormWrapper from '@components/FormWrapper'
import { putData } from '@helpers/CRUD'
import useSnackbar from '@helpers/useSnackbar'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'

const notificationsDeativateTelegramFunc = (onSuccess) => {
  const NotificationsDeativateTelegramModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const loggedUser = useRecoilValue(loggedUserAtom)

    const { success, error } = useSnackbar()

    const onClickConfirm = async () => {
      await putData(
        `/api/users/${loggedUser._id}`,
        {
          notifications: {
            ...loggedUser.notifications,
            telegram: { active: false, id: undefined, userName: undefined },
          },
        },
        () => {
          success('Аккаунт Telegram отключен')
          if (typeof onSuccess === 'function') onSuccess()
        },
        () => {
          error('Ошибка отключения аккаунта Telegram')
        },
        false,
        loggedUser._id
      )
      closeModal()
    }

    useEffect(() => {
      setOnConfirmFunc(onClickConfirm)
    }, [])

    return (
      <FormWrapper>
        <div className="flex flex-col ">
          <span>
            После нажатия кнопки "Отключить" ваш аккаунт телеграм будет отвязан!
            После отвязки аккаунта, можно будет привязать другой аккаунт (или
            тот же)
          </span>
        </div>
      </FormWrapper>
    )
  }

  return {
    title: `Отключение уведомлений Telegram`,
    confirmButtonName: 'Отключить',
    Children: NotificationsDeativateTelegramModal,
  }
}

export default notificationsDeativateTelegramFunc
