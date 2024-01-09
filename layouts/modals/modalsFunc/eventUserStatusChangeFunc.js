import ErrorsList from '@components/ErrorsList'
import UserStatusPicker from '@components/ValuePicker/UserStatusPicker'
import useErrors from '@helpers/useErrors'
import asyncEventsUsersByEventIdAtom from '@state/asyncSelectors/asyncEventsUsersByEventIdAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

const eventUserStatusChangeFunc = ({ eventId, userId }) => {
  const EventUserStatusChangeModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setOnlyCloseButtonShow,
    setBottomLeftButtonProps,
  }) => {
    const eventUsers = useRecoilValue(asyncEventsUsersByEventIdAtom(eventId))
    const eventUser = eventUsers.find(
      (eventUser) => eventUser.userId === userId
    )

    const setEventUser = useRecoilValue(itemsFuncAtom).eventsUser.set

    const defaultStatus = eventUser.userStatus //  ?? user.status ?? 'novice'
    const [status, setStatus] = useState(defaultStatus)

    const [errors, checkErrors, addError, removeError, clearErrors] =
      useErrors()

    const isFormChanged = status !== defaultStatus

    const onClickConfirm = async () => {
      let isErrorsExists = checkErrors({
        status,
      })
      if (!isErrorsExists) {
        closeModal()
        setEventUser({
          _id: eventUser?._id,
          userStatus: status,
        })
      }
    }

    useEffect(() => {
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
      setOnConfirmFunc(onClickConfirm)
    }, [isFormChanged])

    return (
      <div className="flex flex-col gap-y-2">
        <UserStatusPicker
          required
          status={status}
          onChange={(value) => {
            removeError('status')
            setStatus(value)
          }}
          error={errors.status}
        />
        <ErrorsList errors={errors} />
      </div>
    )
  }

  return {
    title: `Изменение статуса участника на мероприятии`,
    confirmButtonName: 'Применить',
    Children: EventUserStatusChangeModal,
  }
}

export default eventUserStatusChangeFunc
