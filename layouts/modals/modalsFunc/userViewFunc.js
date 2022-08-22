import React from 'react'

import { useRecoilValue } from 'recoil'
import userSelector from '@state/selectors/userSelector'
import { GENDERS, ORIENTATIONS } from '@helpers/constants'

import FormWrapper from '@components/FormWrapper'
import ContactsIconsButtons from '@components/ContactsIconsButtons'
import birthDateToAge from '@helpers/birthDateToAge'
import UserName from '@components/UserName'
import getUserAvatarSrc from '@helpers/getUserAvatarSrc'

const userViewFunc = (userId, clone = false) => {
  const UserModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const user = useRecoilValue(userSelector(userId))

    return (
      <FormWrapper flex className="flex-col">
        <div className="flex flex-1 gap-x-2">
          <img
            className="object-cover w-20 h-20 tablet:w-24 tablet:h-24"
            src={getUserAvatarSrc(user)}
            alt="user"
            // width={48}
            // height={48}
          />
          <div className="flex flex-col flex-1">
            <UserName user={user} className="text-lg font-bold" />
            {/* <div className="flex text-lg font-bold">{`${user.secondName} ${user.name} ${user.thirdName}`}</div> */}
            <div className="flex gap-x-2">
              <span className="font-bold">Пол:</span>
              <span>
                {GENDERS.find((item) => item.value === user.gender)?.name}
              </span>
            </div>
            {/* <div className="flex gap-x-2">
              <span className="font-bold">Ориентация:</span>
              <span>
                {
                  ORIENTATIONS.find((item) => item.value === user.orientation)
                    ?.name
                }
              </span>
            </div> */}
            {user.birthday && (
              <div className="flex gap-x-2">
                <span className="font-bold">Дата рождения:</span>
                <span>{birthDateToAge(user.birthday, true, true)}</span>
              </div>
            )}
          </div>
        </div>
        <ContactsIconsButtons user={user} withTitle vertical />
      </FormWrapper>
    )
  }

  return {
    title: `Анкета пользователя`,
    declineButtonName: 'Закрыть',
    Children: UserModal,
  }
}

export default userViewFunc
