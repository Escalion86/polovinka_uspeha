import React, { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import loggedUserAtom from '@state/atoms/loggedUserAtom'

import FormWrapper from '@components/FormWrapper'
import ErrorsList from '@components/ErrorsList'
import useSnackbar from '@helpers/useSnackbar'
import { putData } from '@helpers/CRUD'

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
          success('Аккаунт Telegram деактивирован')
          if (typeof onSuccess === 'function') onSuccess()
        },
        () => {
          error('Ошибка деактивации аккаунта Telegram')
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
            После нажатия кнопки "Деактивировать" ваш аккаунт телеграм будет
            отвязан! После отвязки аккаунта, можно будет привязать другой
            аккаунт (или тот же)
          </span>
        </div>
      </FormWrapper>
    )
  }

  return {
    title: `Деактивация уведомлений Telegram`,
    confirmButtonName: 'Деактивировать',
    Children: NotificationsDeativateTelegramModal,
  }
}

export default notificationsDeativateTelegramFunc
