import Button from '@components/Button'
import CheckBox from '@components/CheckBox'
import EventTagsChipsSelector from '@components/Chips/EventTagsChipsSelector'
import ComboBox from '@components/ComboBox'
import Input from '@components/Input'
import InputWrapper from '@components/InputWrapper'
import YesNoPicker from '@components/ValuePicker/YesNoPicker'
import { putData } from '@helpers/CRUD'
import compareObjects from '@helpers/compareObjects'
import { DEFAULT_USER } from '@helpers/constants'
import useSnackbar from '@helpers/useSnackbar'
import { modalsFuncAtom } from '@state/atoms'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import userEditSelector from '@state/selectors/userEditSelector'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

const LoggedUserNotificationsContent = (props) => {
  const [loggedUser, setLoggedUser] = useRecoilState(loggedUserAtom)
  const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleSelector)

  const birthdays = loggedUserActiveRole?.notifications?.birthdays
  const newUserRegistred = loggedUserActiveRole?.notifications?.newUserRegistred
  const eventRegistration =
    loggedUserActiveRole?.notifications?.eventRegistration
  const serviceRegistration =
    loggedUserActiveRole?.notifications?.serviceRegistration
  const newEventsByTags = loggedUserActiveRole?.notifications?.newEventsByTags
  const isLoggedUserDev = loggedUserActiveRole?.dev
  const setUserInUsersState = useSetRecoilState(userEditSelector)

  const [notifications, setNotifications] = useState(
    loggedUser?.notifications ?? DEFAULT_USER.notifications
  )

  const toggleNotificationsSettings = (key) =>
    setNotifications((state) => ({
      ...state,
      settings: {
        ...notifications?.settings,
        [key]: notifications?.settings ? !notifications?.settings[key] : true,
      },
    }))

  const modalsFunc = useRecoilValue(modalsFuncAtom)

  const [isWaitingToResponse, setIsWaitingToResponse] = useState(false)

  const { success, error } = useSnackbar()

  const isNotificationActivated = !!(
    notifications?.telegram?.id && notifications?.telegram?.active
  )

  const onClickConfirm = async () => {
    setIsWaitingToResponse(true)
    await putData(
      `/api/users/${loggedUser._id}`,
      {
        notifications,
      },
      (data) => {
        setLoggedUser(data)
        setUserInUsersState(data)
        success('Данные уведомлений обновлены успешно')
        setIsWaitingToResponse(false)
      },
      () => {
        error('Ошибка обновления данных уведомлений')
        setIsWaitingToResponse(false)
      },
      false,
      loggedUser._id
    )
  }

  useEffect(() => {
    if (isWaitingToResponse) {
      setIsWaitingToResponse(false)
    }
  }, [props])

  const formChanged = !compareObjects(loggedUser?.notifications, notifications)

  const buttonDisabled = !formChanged

  return (
    <div className="flex flex-col flex-1 h-full max-w-full max-h-full min-h-full">
      <div className="flex items-center w-full p-1 gap-x-1">
        <div className="flex flex-row-reverse flex-1">
          {!buttonDisabled && (
            <span className="leading-4 text-right tablet:text-lg">
              Чтобы изменения вступили в силу нажмите:
            </span>
          )}
        </div>
        <Button
          name="Применить"
          disabled={buttonDisabled}
          onClick={onClickConfirm}
          loading={isWaitingToResponse}
        />
      </div>
      <div className="p-2">
        <div className="flex flex-wrap items-center gap-x-2">
          <YesNoPicker
            label="Оповещения в Telegram"
            value={!!notifications?.telegram?.active}
            onChange={() => {
              if (!notifications?.telegram?.active) {
                modalsFunc.notifications.telegram.activate()
              }
              setNotifications((state) => ({
                ...state,
                telegram: {
                  ...state?.telegram,
                  active: !state?.telegram?.active,
                },
              }))
            }}
          />
          <Input
            type="number"
            label="Telegram ID"
            value={notifications?.telegram?.id ?? ''}
            onChange={(value) => {
              setNotifications((state) => ({
                ...state,
                telegram: {
                  ...notifications?.telegram,
                  id: value,
                },
              }))
            }}
            copyPasteButtons
            showArrows={false}
          />
        </div>

        {isNotificationActivated && (
          <>
            {birthdays && (
              <InputWrapper label="Ежедневные уведомления" className="">
                <div className="w-full">
                  <ComboBox
                    label="Время уведомлений"
                    items={[
                      '00:00',
                      '00:30',
                      '01:00',
                      '01:30',
                      '02:00',
                      '02:30',
                      '03:00',
                      '03:30',
                      '04:00',
                      '04:30',
                      '05:00',
                      '05:30',
                      '06:00',
                      '06:30',
                      '07:00',
                      '07:30',
                      '08:00',
                      '08:30',
                      '09:00',
                      '09:30',
                      '10:00',
                      '10:30',
                      '11:00',
                      '11:30',
                      '12:00',
                      '12:30',
                      '13:00',
                      '13:30',
                      '14:00',
                      '14:30',
                      '15:00',
                      '15:30',
                      '16:00',
                      '16:30',
                      '17:00',
                      '17:30',
                      '18:00',
                      '18:30',
                      '19:00',
                      '19:30',
                      '20:00',
                      '20:30',
                      '21:00',
                      '21:30',
                      '22:00',
                      '22:30',
                      '23:00',
                      '23:30',
                    ].map((time) => ({ value: time, name: time }))}
                    value={notifications.settings?.time}
                    onChange={(time) =>
                      setNotifications((state) => ({
                        ...state,
                        settings: {
                          ...notifications?.settings,
                          time,
                        },
                      }))
                    }
                    className="w-40 mt-2"
                    required={notifications.settings?.birthdays}
                    noMargin
                    placeholder="Не выбрано"
                  />

                  {birthdays && (
                    <CheckBox
                      checked={notifications.settings?.birthdays}
                      onClick={() => toggleNotificationsSettings('birthdays')}
                      label="Напоминания о днях рождениях пользователей (модер/админ)"
                    />
                  )}
                </div>
              </InputWrapper>
            )}
            <InputWrapper label="Уведомления по событиям" className="">
              <div className="w-full">
                {newUserRegistred && (
                  <CheckBox
                    checked={notifications.settings?.newUserRegistred}
                    onClick={() => {
                      toggleNotificationsSettings('newUserRegistred')
                    }}
                    label="Регистрации нового пользователя (модер/админ)"
                  />
                )}
                {eventRegistration && (
                  <CheckBox
                    checked={notifications.settings?.eventRegistration}
                    onClick={() =>
                      toggleNotificationsSettings('eventRegistration')
                    }
                    label="Запись/отписка пользователей на мероприитиях (модер/админ)"
                  />
                )}
                {serviceRegistration && (
                  <CheckBox
                    checked={notifications.settings?.serviceRegistration}
                    onClick={() =>
                      toggleNotificationsSettings('serviceRegistration')
                    }
                    label="Подача заявок пользователей на услуги (модер/админ)"
                  />
                )}
                <CheckBox
                  checked={notifications.settings?.newEventsByTags}
                  onClick={() => toggleNotificationsSettings('newEventsByTags')}
                  label="Новые мероприятия (по тэгам мероприятий)"
                />
                {newEventsByTags && notifications.settings?.newEventsByTags && (
                  <EventTagsChipsSelector
                    placeholder="Мне интересно всё!"
                    label="Тэги мероприятий которые мне интересны"
                    onChange={(value) =>
                      setNotifications((state) => ({
                        ...state,
                        settings: {
                          ...notifications?.settings,
                          eventsTags: value,
                        },
                      }))
                    }
                    tags={notifications.settings?.eventsTags}
                  />
                )}
                {isLoggedUserDev && (
                  <CheckBox
                    checked={notifications.settings?.eventUserMoves}
                    onClick={() =>
                      toggleNotificationsSettings('eventUserMoves')
                    }
                    label="Перемещение моей записи на мероприятие из резерва в основной состав и наоборот"
                  />
                )}
                {isLoggedUserDev && (
                  <CheckBox
                    checked={notifications.settings?.eventCancel}
                    onClick={() => toggleNotificationsSettings('eventCancel')}
                    label="Отмена мероприятия на которое я записан"
                  />
                )}
              </div>
            </InputWrapper>
          </>
        )}
      </div>
    </div>
  )
}

export default LoggedUserNotificationsContent
