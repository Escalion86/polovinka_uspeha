import React from 'react'

import { useRecoilValue } from 'recoil'
import userSelector from '@state/selectors/userSelector'
import { GENDERS } from '@helpers/constants'

import FormWrapper from '@components/FormWrapper'
import ContactsIconsButtons from '@components/ContactsIconsButtons'
import birthDateToAge from '@helpers/birthDateToAge'
import UserName from '@components/UserName'
import Tooltip from '@components/Tooltip'
import Image from 'next/image'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import ImageGallery from '@components/ImageGallery'
import CardButtons from '@components/CardButtons'
import eventsUsersByUserIdSelector from '@state/selectors/eventsUsersByUserIdSelector'
import eventsUsersVisitedByUserIdSelector from '@state/selectors/eventsUsersVisitedByUserIdSelector'
import { SelectEventList } from '@components/SelectItemList'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import ValueItem from '@components/ValuePicker/ValueItem'
import { modalsFuncAtom } from '@state/atoms'
import ZodiacIcon from '@components/ZodiacIcon'
import formatDate from '@helpers/formatDate'
import TextLine from '@components/TextLine'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'

const userViewFunc = (userId, clone = false) => {
  const UserModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const modalsFunc = useRecoilValue(modalsFuncAtom)
    const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)
    const isLoggedUserDev = useRecoilValue(isLoggedUserDevSelector)

    const user = useRecoilValue(userSelector(userId))

    const eventUsers = useRecoilValue(
      eventsUsersVisitedByUserIdSelector(userId)
    )

    return (
      <FormWrapper flex className="flex-col">
        <ImageGallery images={user?.images} />
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-x-2 min-h-6">
            {user.status === 'member' && (
              <Tooltip title="Участник клуба">
                <div className="w-6 h-6">
                  <Image
                    src="/img/svg_icons/medal.svg"
                    width="24"
                    height="24"
                  />
                </div>
              </Tooltip>
            )}
            <UserName user={user} className="text-lg font-bold" />
          </div>
          {/* <div className="flex text-lg font-bold">{`${user.secondName} ${user.name} ${user.thirdName}`}</div> */}
          {isLoggedUserDev && <TextLine label="ID">{user?._id}</TextLine>}
          <TextLine label="Пол">
            {GENDERS.find((item) => item.value === user.gender)?.name}
          </TextLine>
          {/* <div className="flex gap-x-2">
              <span className="font-bold">Ориентация:</span>
              <span>
                {
                  ORIENTATIONS.find((item) => item.value === user.orientation)
                    ?.name
                }
              </span>
            </div> */}
          {user.birthday &&
            (isLoggedUserAdmin ||
              user.security?.showBirthday ||
              user.security?.showAge) && (
              <div className="flex items-center gap-x-1">
                <span className="font-bold">Дата рождения:</span>
                <span>
                  {birthDateToAge(
                    user.birthday,
                    true,
                    isLoggedUserAdmin || user.security?.showBirthday,
                    isLoggedUserAdmin || user.security?.showAge
                  )}
                </span>
                <ZodiacIcon date={user.birthday} />
              </div>
            )}
          <TextLine label="Дети">
            {user?.haveKids === true
              ? 'Есть'
              : user?.haveKids === false
              ? 'Нет'
              : 'Не указано'}
          </TextLine>
          {(isLoggedUserAdmin || user.security?.showContacts) && (
            <ContactsIconsButtons user={user} withTitle grid />
          )}
          <TextLine label="Дата регистрации">
            {formatDate(user.createdAt)}
          </TextLine>

          <div className="flex flex-col tablet:items-center tablet:flex-row gap-y-1 gap-x-2">
            <TextLine label="Посещено мероприятий">
              {eventUsers.length}
            </TextLine>

            {isLoggedUserAdmin && eventUsers.length > 0 && (
              <ValueItem
                name="Посмотреть посещенные мероприятия"
                color="general"
                icon={faCalendarAlt}
                hoverable
                onClick={() => modalsFunc.user.events(userId)}
              />
            )}
          </div>
        </div>

        {/* <SelectEventList
          eventsId={eventUsers.map((eventUser) => eventUser.eventId)}
          readOnly
        /> */}
      </FormWrapper>
    )
  }

  return {
    title: `Анкета пользователя`,
    declineButtonName: 'Закрыть',
    closeButtonShow: true,
    Children: UserModal,
    TopLeftComponent: () => (
      <CardButtons
        item={{ _id: userId }}
        typeOfItem="user"
        forForm
        direction="right"
      />
    ),
  }
}

export default userViewFunc
