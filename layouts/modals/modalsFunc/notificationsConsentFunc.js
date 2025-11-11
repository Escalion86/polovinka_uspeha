import CheckBox from '@components/CheckBox'
import { putData } from '@helpers/CRUD'
import useSnackbar from '@helpers/useSnackbar'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useRouter from '@utils/useRouter'

const notificationsConsentFunc = ({ location, user, onUpdateUser }) => {
  const NotificationsConsentModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const router = useRouter()
    const { error: showError } = useSnackbar()
    const [checked, setChecked] = useState(
      Boolean(user?.notifications?.settings?.newEvents)
    )
    const [isSaving, setIsSaving] = useState(false)

    const targetPaths = useMemo(
      () => ({
        confirm: `/${location}/cabinet/notifications`,
        decline: `/${location}/cabinet/eventsUpcoming`,
      }),
      [location]
    )

    useEffect(() => {
      setDisableConfirm(!checked || isSaving)
    }, [checked, isSaving, setDisableConfirm])

    useEffect(() => {
      setDisableDecline(isSaving)
    }, [isSaving, setDisableDecline])

    const saveConsent = useCallback(
      async (value, redirectPath) => {
        if (isSaving) return
        setIsSaving(true)
        const notificationsSource = user?.notifications
        const baseNotifications =
          typeof notificationsSource?.toJSON === 'function'
            ? notificationsSource.toJSON()
            : { ...(notificationsSource ?? {}) }
        const settingsSource = baseNotifications?.settings
        const baseSettings =
          typeof settingsSource?.toJSON === 'function'
            ? settingsSource.toJSON()
            : { ...(settingsSource ?? {}) }

        const updatedNotifications = {
          ...baseNotifications,
          settings: {
            ...baseSettings,
            newEvents: value,
          },
        }

        const onError = () => {
          showError('Не удалось сохранить настройку уведомлений')
        }

        const updatedUser = await putData(
          `/api/${location}/users/${user?._id}`,
          { notifications: updatedNotifications },
          (data) => {
            onUpdateUser?.(data)
          },
          onError,
          false,
          user?._id
        )

        if (!updatedUser) {
          setIsSaving(false)
          return
        }

        setIsSaving(false)
        closeModal(false)
        router.push(redirectPath)
      },
      [closeModal, isSaving, location, onUpdateUser, router, showError, user]
    )

    useEffect(() => {
      setOnConfirmFunc(async () => {
        if (!checked) return
        await saveConsent(true, targetPaths.confirm)
      })
    }, [checked, saveConsent, setOnConfirmFunc, targetPaths])

    useEffect(() => {
      setOnDeclineFunc(async () => {
        await saveConsent(false, targetPaths.decline)
      })
    }, [saveConsent, setOnDeclineFunc, targetPaths])

    return (
      <div className="flex flex-col text-lg gap-y-4 ">
        <p className="leading-5">
          Мы можем присылать вам уведомления о новых мероприятиях. Вы можете
          изменить решение в любой момент в настройках уведомлений.
        </p>
        <CheckBox
          big
          checked={checked}
          onChange={() => setChecked((state) => !state)}
          label="Согласен на получение уведомлений о новых мероприятиях"
        />
      </div>
    )
  }

  return {
    title: 'Настройка уведомлений',
    Children: NotificationsConsentModal,
    confirmButtonName: 'Настроить уведомления',
    declineButtonName: 'Отмена',
    closeButtonShow: false,
  }
}

export default notificationsConsentFunc
