import React, { useEffect, useState } from 'react'
import useErrors from '@helpers/useErrors'
import { useRecoilValue } from 'recoil'
import loggedUserAtom from '@state/atoms/loggedUserAtom'

import Input from '@components/Input'
import FormWrapper from '@components/FormWrapper'
import ErrorsList from '@components/ErrorsList'
import useSnackbar from '@helpers/useSnackbar'
import { putData } from '@helpers/CRUD'

const notificationsTelegramFunc = () => {
  const NotificationsTelegramModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const loggedUser = useRecoilValue(loggedUserAtom)
    const [userName, setUserName] = useState(
      loggedUser?.notifications?.telegram?.userName ?? ''
    )

    const [errors, checkErrors, addError, removeError, clearErrors] =
      useErrors()

    const { success, error } = useSnackbar()

    const onClickConfirm = async () => {
      if (!checkErrors({ notificationTelegramUserName: userName })) {
        await putData(
          `/api/users/${loggedUser._id}`,
          {
            notifications: {
              ...loggedUser.notifications,
              telegram: { ...loggedUser.notifications.telegram, userName },
            },
          },
          (data) => {
            window.open('https://t.me/polovinka_uspeha_bot')
            // setLoggedUser(data)
            // setUserInUsersState(data)
            // success('Данные анкеты обновлены успешно')
          },
          () => {
            error(
              'Ошибка сохранения имени пользователя для оповещения в Telegram'
            )
            addError({ response: 'Ошибка обновления данных' })
          },
          false,
          loggedUser._id
        )
        closeModal()
        // setDirection(
        //   {
        //     _id: direction?._id,
        //     title,
        //     description,
        //     showOnSite,
        //     image,
        //   },
        //   clone
        // )
      }
    }

    useEffect(() => {
      setOnConfirmFunc(onClickConfirm)
      // setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!userName)
    }, [userName])

    return (
      <FormWrapper>
        <Input
          prefix="@"
          label="Имя пользователя Telegram"
          type="text"
          value={userName}
          onChange={(value) => {
            removeError('notificationTelegramUserName')
            setUserName(value)
          }}
          copyPasteButtons
          required
          // labelClassName="w-40"
          error={errors.notificationTelegramUserName}
        />
        {/* <div className="flex gap-x-1">
                  <span>Статус подключения Telegram:</span>
                  {notifications?.telegram?.id ? (
                    <>
                      <span className="text-success">АКТИВНО</span>
                      <span className="">{`id: ${notifications?.telegram?.id}`}</span>
                    </>
                  ) : (
                    <span className="text-danger">НЕ АКТИВНО</span>
                  )}
                </div> */}
        <div className="flex flex-col ">
          <span>
            После нажатия кнопки "Активировать" вас перенаправит на телеграм
            бота. В меню бота необходимо выбрать пункт "Активация оповещений"
            или отправить сообщение "/activate". После чего вернуться на сайт и
            обновить страницу!
            {/* Для активации сначала сохраните введенное имя пользователя нажав
            кнопку "Применить" внизу, затем необходимо пройти по ссылке на чат
            бота Telegram. Далее в меню выбрать пункт "Активация оповещений" или
            отправить сообщение "/activate" */}
          </span>
          {/* <a
            target="_blank"
            className="text-general"
            href="https://t.me/polovinka_uspeha_bot"
          >
            Перейти в чат бота
          </a> */}
        </div>
        <ErrorsList errors={errors} />
      </FormWrapper>
    )
  }

  return {
    title: `Активация уведомлений Telegram`,
    confirmButtonName: 'Активаровать',
    Children: NotificationsTelegramModal,
  }
}

export default notificationsTelegramFunc
