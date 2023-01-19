import React from 'react'
import { useRecoilValue } from 'recoil'

import FormWrapper from '@components/FormWrapper'
import UserName from '@components/UserName'
import eventSelector from '@state/selectors/eventSelector'
import userSelector from '@state/selectors/userSelector'

const userPaymentsForEventFunc = (userId, eventId) => {
  const UserPaymentsForEventModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    // const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)

    const user = useRecoilValue(userSelector(userId))
    const event = useRecoilValue(eventSelector(eventId))

    // const eventUsers = useRecoilValue(
    //   eventsUsersSignedUpByUserIdSelector(userId)
    // )
    // const sortedEventUsers = [...eventUsers]
    //   // .filter(
    //   //   (item) => item.event && item.user && item.event.status !== 'canceled'
    //   // )
    //   .sort((a, b) =>
    //     getDiffBetweenDates(a.event.dateStart, b.event.dateStart) > 0 ? -1 : 1
    //   )

    // const eventsAsParticipant = sortedEventUsers.filter(
    //   (eventUser) => eventUser.status === 'participant'
    // )
    // const eventsAsAssistant = sortedEventUsers.filter(
    //   (eventUser) => eventUser.status === 'assistant'
    // )

    return (
      <FormWrapper flex className="flex-col">
        <div className="flex flex-col items-center justify-center text-lg">
          <UserName user={user} />
          <div className="flex justify-center w-full text-lg font-bold">
            {event?.title}
          </div>
        </div>
        <div className="">
          {/* <SelectEventList
              eventsId={eventsAsParticipant.map(
                (eventUser) => eventUser.eventId
              )}
              readOnly
            /> */}
        </div>
      </FormWrapper>
    )
  }

  return {
    title: `Оплата от пользователя за мероприятие`,
    declineButtonName: 'Закрыть',
    closeButtonShow: true,
    Children: UserPaymentsForEventModal,
  }
}

export default userPaymentsForEventFunc
