import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'

import useErrors from '@helpers/useErrors'
import ErrorsList from '@components/ErrorsList'
import UserStatusPicker from '@components/ValuePicker/UserStatusPicker'
import asyncEventsUsersByEventIdAtom from '@state/asyncSelectors/asyncEventsUsersByEventIdAtom'

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
    ) // const event = useRecoilValue(eventSelector(eventId))
    // const user = useRecoilValue(userSelector(userId))
    const setEventUser = useRecoilValue(itemsFuncAtom).eventsUser.set
    console.log('eventUser :>> ', eventUser)

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
