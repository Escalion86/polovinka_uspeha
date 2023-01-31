import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import eventSelector from '@state/selectors/eventSelector'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import userSelector from '@state/selectors/userSelector'
import eventsUsersSelector from '@state/selectors/eventsUsersSelector'

import useErrors from '@helpers/useErrors'
import ErrorsList from '@components/ErrorsList'
import UserStatusPicker from '@components/ValuePicker/UserStatusPicker'

const eventUserStatusChangeFunc = (eventUserId) => {
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
    const eventUser = useRecoilValue(eventsUsersSelector(eventUserId))
    const event = useRecoilValue(eventSelector(eventUser.eventId))
    const user = useRecoilValue(userSelector(eventUser.userId))
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
