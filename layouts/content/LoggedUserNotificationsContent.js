'use client'

import Button from '@components/Button'
import CheckBox from '@components/CheckBox'
import EventTagsChipsSelector from '@components/Chips/EventTagsChipsSelector'
import ComboBox from '@components/ComboBox'
// import Input from '@components/Input'
import InputWrapper from '@components/InputWrapper'
import YesNoPicker from '@components/ValuePicker/YesNoPicker'
import { putData } from '@helpers/CRUD'
import compareObjects from '@helpers/compareObjects'
import { DEFAULT_USER } from '@helpers/constants'
import useSnackbar from '@helpers/useSnackbar'
// import modalsFuncAtom from '@state/modalsFuncAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import userEditSelector from '@state/selectors/userEditSelector'
import { useEffect, useState } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import TelegramLoginButton from 'react-telegram-login'
import Note from '@components/Note'
import locationAtom from '@state/atoms/locationAtom'
import telegramBotNameAtom from '@state/atoms/telegramBotNameAtom'
import PhoneInput from '@components/PhoneInput'
import useErrors from '@helpers/useErrors'

const LoggedUserNotificationsContent = (props) => {
  const location = useAtomValue(locationAtom)
  const [loggedUserActive, setLoggedUserActive] = useAtom(loggedUserActiveAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const telegramBotName = useAtomValue(telegramBotNameAtom)

  const [whatsapp, setWhatsapp] = useState(
    loggedUserActive?.whatsapp ?? DEFAULT_USER.whatsapp
  )

  const [errors, checkErrors, addError, removeError, clearErrors] = useErrors()

  const birthdays = loggedUserActiveRole?.notifications?.birthdays
  const remindDates = loggedUserActiveRole?.notifications?.remindDates
  const newUserRegistred = loggedUserActiveRole?.notifications?.newUserRegistred
  const eventRegistration =
    loggedUserActiveRole?.notifications?.eventRegistration
  const serviceRegistration =
    loggedUserActiveRole?.notifications?.serviceRegistration
  const newEventsByTags = loggedUserActiveRole?.notifications?.newEventsByTags
  const isLoggedUserDev = loggedUserActiveRole?.dev
  const setUserInUsersState = useSetAtom(userEditSelector)

  const [notifications, setNotifications] = useState(
    loggedUserActive?.notifications ?? DEFAULT_USER.notifications
  )

  const handleTelegramResponse = ({
    id,
    // first_name,
    // last_name,
    // photo_url,
    username,
  }) => {
    setNotifications((state) => ({
      ...state,
      telegram: {
        id,
        username,
        active: true,
      },
    }))
  }

  const toggleNotificationsSettings = (key) =>
    setNotifications((state) => ({
      ...state,
      settings: {
        ...notifications?.settings,
        [key]: notifications?.settings ? !notifications?.settings[key] : true,
      },
    }))

  // const modalsFunc = useAtomValue(modalsFuncAtom)

  const [isWaitingToResponse, setIsWaitingToResponse] = useState(false)

  const { success, error } = useSnackbar()

  const isNotificationActivated = !!(
    (notifications?.telegram?.id && notifications?.telegram?.active) ||
    notifications?.whatsapp?.active
  )

  const onClickConfirm = async () => {
    setIsWaitingToResponse(true)
    await putData(
      `/api/${location}/users/${loggedUserActive._id}`,
      {
        notifications,
        whatsapp,
      },
      (data) => {
        setLoggedUserActive(data)
        setUserInUsersState(data)
        success('Данные уведомлений обновлены успешно')
        setIsWaitingToResponse(false)
      },
      () => {
        error('Ошибка обновления данных уведомлений')
        setIsWaitingToResponse(false)
      },
      false,
      loggedUserActive._id
    )
  }

  useEffect(() => {
    if (isWaitingToResponse) {
      setIsWaitingToResponse(false)
    }
  }, [props])

  const formChanged =
    !compareObjects(loggedUserActive?.notifications, notifications) ||
    loggedUserActive?.whatsapp !== whatsapp

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
        {!notifications?.telegram?.id && (
          <div className="flex flex-col">
            <Note>
              Для подключения оповещений через Телеграм - нажмите на кнопку ниже
              и авторизируйтесь
            </Note>
            <TelegramLoginButton
              dataOnauth={handleTelegramResponse}
              botName={telegramBotName}
              lang="ru"
            />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-x-2">
          {notifications?.telegram?.id && (
            <YesNoPicker
              label="Оповещения в Telegram"
              value={!!notifications?.telegram?.active}
              onChange={() => {
                setNotifications((state) => ({
                  ...state,
                  telegram: {
                    ...state?.telegram,
                    active: !state?.telegram?.active,
                  },
                }))
              }}
            />
          )}
          {/* <YesNoPicker
            label="Оповещения в Whatsapp"
            value={!!notifications?.whatsapp?.active}
            onChange={() => {
              setNotifications((state) => ({
                ...state,
                whatsapp: {
                  ...state?.whatsapp,
                  active: !state?.whatsapp?.active,
                },
              }))
            }}
          /> */}
        </div>
        {/* {!!notifications?.whatsapp?.active && (
          <div className="flex flex-col">
            <Note>Убедитесь, что ваш номер Whatsapp введен верно!</Note>
            <PhoneInput
              label="Whatsapp"
              value={whatsapp}
              onChange={setWhatsapp}
              // error={errors.whatsapp}
              copyPasteButtons
              noMargin
            />
          </div>
        )} */}
        {isNotificationActivated && (
          <>
            {(birthdays || remindDates) && (
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
                  {remindDates && (
                    <CheckBox
                      checked={notifications.settings?.remindDates}
                      onClick={() => toggleNotificationsSettings('remindDates')}
                      label="Напоминания об особых днях Половинки Успеха (список дней редактируется в настройках сайта)"
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
