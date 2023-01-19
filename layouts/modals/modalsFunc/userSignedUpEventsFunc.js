import React from 'react'
import { useRecoilValue } from 'recoil'

import FormWrapper from '@components/FormWrapper'
import { SelectEventList } from '@components/SelectItemList'
import UserNameById from '@components/UserNameById'
import getDiffBetweenDates from '@helpers/getDiffBetweenDates'
import eventsUsersSignedUpByUserIdSelector from '@state/selectors/eventsUsersSignedUpByUserIdSelector'

const userSignedUpEventsFunc = (userId, clone = false) => {
  const UserSignedUpEventsModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    // const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)

    // const user = useRecoilValue(userSelector(userId))

    const eventUsers = useRecoilValue(
      eventsUsersSignedUpByUserIdSelector(userId)
    )
    const sortedEventUsers = [...eventUsers]
      // .filter(
      //   (item) => item.event && item.user && item.event.status !== 'canceled'
      // )
      .sort((a, b) =>
        getDiffBetweenDates(a.event.dateStart, b.event.dateStart) > 0 ? -1 : 1
      )

    const eventsAsParticipant = sortedEventUsers.filter(
      (eventUser) => eventUser.status === 'participant'
    )
    const eventsAsAssistant = sortedEventUsers.filter(
      (eventUser) => eventUser.status === 'assistant'
    )

    return (
      <FormWrapper flex className="flex-col">
        <div className="flex justify-center text-lg">
          <UserNameById userId={userId} />
        </div>
        {eventsAsParticipant.length > 0 && (
          <div className="">
            <div>Участник:</div>
            <SelectEventList
              eventsId={eventsAsParticipant.map(
                (eventUser) => eventUser.eventId
              )}
              readOnly
            />
          </div>
        )}
        {eventsAsAssistant.length > 0 && (
          <div className="">
            <div>Ведущий:</div>
            <SelectEventList
              eventsId={eventsAsAssistant.map((eventUser) => eventUser.eventId)}
              readOnly
            />
          </div>
        )}
        {eventsAsParticipant.length + eventsAsAssistant.length === 0 && (
          <div className="text-center">
            Пользователь не посетил ни одного мероприятия
          </div>
        )}
      </FormWrapper>
    )
  }

  return {
    title: `Посещенные мероприятия`,
    declineButtonName: 'Закрыть',
    closeButtonShow: true,
    Children: UserSignedUpEventsModal,
  }
}

export default userSignedUpEventsFunc
