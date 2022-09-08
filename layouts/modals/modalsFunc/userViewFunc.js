import React from 'react'

import { useRecoilValue } from 'recoil'
import userSelector from '@state/selectors/userSelector'
import { GENDERS } from '@helpers/constants'

import FormWrapper from '@components/FormWrapper'
import ContactsIconsButtons from '@components/ContactsIconsButtons'
import birthDateToAge from '@helpers/birthDateToAge'
import UserName from '@components/UserName'
import getUserAvatarSrc from '@helpers/getUserAvatarSrc'
import Tooltip from '@components/Tooltip'
import Image from 'next/image'
import ImageGallery from 'react-image-gallery'
import loggedUserAtom from '@state/atoms/loggedUserAtom'

const userViewFunc = (userId, clone = false) => {
  const UserModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const loggedUser = useRecoilValue(loggedUserAtom)
    const isLoggedUserAdmin =
      loggedUser?.role === 'dev' || loggedUser?.role === 'admin'

    const user = useRecoilValue(userSelector(userId))

    return (
      <FormWrapper flex className="flex-col">
        {user?.images && user.images.length > 0 && (
          <div className="flex justify-center w-full border border-gray-400 h-60 laptop:h-80">
            <ImageGallery
              items={user.images.map((image) => {
                return {
                  original: image,
                  originalClass: 'object-contain max-h-60 laptop:max-h-80',
                  // sizes: '(max-width: 60px) 30px, (min-width: 60px) 60px',
                }
              })}
              showPlayButton={false}
              showFullscreenButton={false}
              additionalClass="w-full max-h-60 laptop:max-h-80 max-w-full"
            />
          </div>
        )}
        <div className="flex flex-1 gap-x-2">
          {/* <img
            className="object-cover w-20 h-20 tablet:w-24 tablet:h-24"
            src={getUserAvatarSrc(user)}
            alt="user"
            // width={48}
            // height={48}
          /> */}
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-x-2">
              {user.status === 'member' && (
                <Tooltip content="Участник клуба">
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
            {user.birthday &&
              (isLoggedUserAdmin ||
                user.security?.showBirthday ||
                user.security?.showAge) && (
                <div className="flex gap-x-2">
                  <span className="font-bold">Дата рождения:</span>
                  <span>
                    {birthDateToAge(
                      user.birthday,
                      true,
                      isLoggedUserAdmin || user.security?.showBirthday,
                      isLoggedUserAdmin || user.security?.showAge
                    )}
                  </span>
                </div>
              )}
            <div className="flex gap-x-2">
              <span className="font-bold">Дети:</span>
              <span>
                {user?.haveKids === true
                  ? 'Есть'
                  : user?.haveKids === false
                  ? 'Нет'
                  : 'Не указано'}
              </span>
            </div>
          </div>
        </div>
        {(isLoggedUserAdmin || user.security?.showContacts) && (
          <ContactsIconsButtons user={user} withTitle vertical />
        )}
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
