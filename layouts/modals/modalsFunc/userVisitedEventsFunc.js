import React from 'react'

import { useRecoilValue } from 'recoil'
// import userSelector from '@state/selectors/userSelector'
// import { GENDERS } from '@helpers/constants'

import FormWrapper from '@components/FormWrapper'
// import ContactsIconsButtons from '@components/ContactsIconsButtons'
// import birthDateToAge from '@helpers/birthDateToAge'
// import UserName from '@components/UserName'
// import Tooltip from '@components/Tooltip'
// import Image from 'next/image'
// import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
// import ImageGallery from '@components/ImageGallery'
// import CardButtons from '@components/CardButtons'
// import eventsUsersByUserIdSelector from '@state/selectors/eventsUsersByUserIdSelector'
import eventsUsersVisitedByUserIdSelector from '@state/selectors/eventsUsersVisitedByUserIdSelector'
import { SelectEventList } from '@components/SelectItemList'
// import ValueItem from '@components/ValuePicker/ValueItem'
import UserNameById from '@components/UserNameById'

const userVisitedEventsFunc = (userId, clone = false) => {
  const UserVisitedEventsModal = ({
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
      eventsUsersVisitedByUserIdSelector(userId)
    )

    const eventsAsParticipant = eventUsers.filter(
      (eventUser) => eventUser.status === 'participant'
    )
    const eventsAsAssistant = eventUsers.filter(
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
    Children: UserVisitedEventsModal,
  }
}

export default userVisitedEventsFunc
