// import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
// import locationAtom from '@state/atoms/locationAtom'
import locationPropsSelector from '@state/selectors/locationPropsSelector'
// import Input from '@components/Input'
// import { putData } from '@helpers/CRUD'
// import useErrors from '@helpers/useErrors'
// import useSnackbar from '@helpers/useSnackbar'
// import loggedUserAtom from '@state/atoms/loggedUserAtom'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
// import { useRecoilValue } from 'recoil'

const notificationsTelegramFunc = (onStartActivate, onCancel) => {
  const NotificationsTelegramModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    // const location = useRecoilValue(locationAtom)
    const { telegramLink } = useRecoilValue(locationPropsSelector)

    // const loggedUser = useRecoilValue(loggedUserAtom)
    // const [userName, setUserName] = useState(
    //   loggedUser?.notifications?.telegram?.userName ?? ''
    // )

    // const [errors, checkErrors, addError, removeError, clearErrors] =
    //   useErrors()

    // const { success, error } = useSnackbar()

    const onClickConfirm = async () => {
      // if (!checkErrors({ notificationTelegramUserName: userName })) {
      // await putData(
      //   `/api/users/${loggedUser._id}`,
      //   {
      //     notifications: {
      //       ...loggedUser.notifications,
      //       telegram: { ...loggedUser.notifications.telegram, userName },
      //     },
      //   },
      //   (data) => {
      //     if (typeof onStartActivate === 'function') onStartActivate()
      //     window.open('https://t.me/polovinka_uspeha_bot')
      //   },
      //   () => {
      //     error(
      //       'Ошибка сохранения имени пользователя для оповещения в Telegram'
      //     )
      //     addError({ response: 'Ошибка обновления данных' })
      //   },
      //   false,
      //   loggedUser._id
      // )
      // const urlTelegramBot =
      //   location === 'norilsk'
      //     ? 'https://t.me/polovinka_uspeha_nrsk_bot'
      //     : 'https://t.me/polovinka_uspeha_bot'
      window.open(telegramLink)
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
      // }
    }

    useEffect(() => {
      setOnConfirmFunc(onClickConfirm)
      // setOnShowOnCloseConfirmDialog(isFormChanged)
      // setDisableConfirm(!userName)
    }, [])

    return (
      <FormWrapper>
        {/* <Input
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
        /> */}
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
        <div className="flex flex-col gap-y-2">
          <div>Для активации уведомлений необходимо:</div>
          <div>
            1. Авторизироваться в боте оповещений. Для этого нужно открыть бота
            Telegram и нажать на кнопку "Старт" внизу
          </div>
          <div>
            2. После активации Вам придет сообщение в боте с Вашим Telegram ID,
            который нужно скопировать и внести на сайте в поле Telegram ID
          </div>
          <div>
            3. Не забудьте сохранить настройки профиля нажав на кнопку
            "Применить" справа вверху
          </div>
        </div>
        {/* <ErrorsList errors={errors} /> */}
      </FormWrapper>
    )
  }

  return {
    title: `Активация уведомлений Telegram`,
    confirmButtonName: 'Открыть бота и получить Telegram ID',
    // onDecline: onCancel,
    declineButtonName: 'Закрыть',
    declineButtonBgClassName: 'bg-general',
    Children: NotificationsTelegramModal,
  }
}

export default notificationsTelegramFunc
