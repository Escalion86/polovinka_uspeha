import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import { putData } from '@helpers/CRUD'
import useErrors from '@helpers/useErrors'
import useSnackbar from '@helpers/useSnackbar'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

const notificationsTelegramFunc = (onStartActivate, onCancel) => {
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
            if (typeof onStartActivate === 'function') onStartActivate()
            window.open('https://t.me/polovinka_uspeha_bot')
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
            бота. В чате с ботом просто нажмите на кнопку "Старт" внизу
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
    onDecline: onCancel,
    Children: NotificationsTelegramModal,
  }
}

export default notificationsTelegramFunc
