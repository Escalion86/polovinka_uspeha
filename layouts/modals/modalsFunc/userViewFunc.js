import React, { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import userSelector from '@state/selectors/userSelector'
import { GENDERS } from '@helpers/constants'

import FormWrapper from '@components/FormWrapper'
import ContactsIconsButtons from '@components/ContactsIconsButtons'
import birthDateToAge from '@helpers/birthDateToAge'
import UserName from '@components/UserName'
import Tooltip from '@components/Tooltip'
import Image from 'next/image'
import ImageGallery from '@components/ImageGallery'
import CardButtons from '@components/CardButtons'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import ValueItem from '@components/ValuePicker/ValueItem'
import { modalsFuncAtom } from '@state/atoms'
import ZodiacIcon from '@components/ZodiacIcon'
import formatDate from '@helpers/formatDate'
import TextLine from '@components/TextLine'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'
import eventsUsersSignedUpWithEventStatusByUserIdCountSelector from '@state/selectors/eventsUsersSignedUpWithEventStatusByUserIdCountSelector'
import isLoggedUserModerSelector from '@state/selectors/isLoggedUserModerSelector'

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
    const isLoggedUserModer = useRecoilValue(isLoggedUserModerSelector)
    const isLoggedUserDev = useRecoilValue(isLoggedUserDevSelector)
    const isLoggedUserMember = useRecoilValue(isLoggedUserMemberSelector)

    const user = useRecoilValue(userSelector(userId))

    const eventsUsersSignedUpCount = useRecoilValue(
      eventsUsersSignedUpWithEventStatusByUserIdCountSelector(userId)
    )

    useEffect(() => {
      if (!user) closeModal()
    }, [user])

    if (!user) return null

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
            {GENDERS.find((item) => item.value === user.gender)?.name ??
              '[не указан]'}
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
            (isLoggedUserModer ||
              user.security?.showBirthday === true ||
              user.security?.showBirthday === 'full' ||
              user.security?.showBirthday === 'noYear') && (
              <div className="flex items-center gap-x-1">
                <span className="font-bold">Дата рождения:</span>
                <span>
                  {birthDateToAge(
                    user.birthday,
                    true,
                    true,
                    isLoggedUserModer ||
                      user.security?.showBirthday === 'full' ||
                      user.security?.showBirthday === true
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
          <ContactsIconsButtons user={user} withTitle grid />
          <TextLine label="Дата регистрации">
            {formatDate(user.createdAt)}
          </TextLine>

          <div className="flex flex-col tablet:items-center tablet:flex-row gap-y-1 gap-x-2">
            <div className="flex flex-col">
              <TextLine label="Посетил мероприятий">
                {eventsUsersSignedUpCount.finished}
              </TextLine>
              <TextLine label="Записан на мероприятия">
                {eventsUsersSignedUpCount.signUp}
              </TextLine>
            </div>

            {(isLoggedUserModer || isLoggedUserMember) &&
              (eventsUsersSignedUpCount.finished > 0 ||
                eventsUsersSignedUpCount.signUp > 0) && (
                <ValueItem
                  name="Посмотреть мероприятия с пользователем"
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
