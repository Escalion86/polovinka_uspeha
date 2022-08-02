import React, { useEffect, useState } from 'react'
import useErrors from '@helpers/useErrors'

import { useRecoilValue } from 'recoil'
import userSelector from '@state/selectors/userSelector'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import { GENDERS, ORIENTATIONS } from '@helpers/constants'

import Input from '@components/Input'
import FormWrapper from '@components/FormWrapper'
import InputImage from '@components/InputImage'
import Textarea from '@components/Textarea'
import DatePicker from '@components/DatePicker'
import PhoneInput from '@components/PhoneInput'
import OrientationPicker from '@components/ValuePicker/OrientationPicker'
import GenderPicker from '@components/ValuePicker/GenderPicker'
import ErrorsList from '@components/ErrorsList'
import ContactsIconsButtons from '@components/ContactsIconsButtons'
import birthDateToAge from '@helpers/birthDateToAge'
import UserName from '@components/UserName'

const userViewFunc = (userId, clone = false) => {
  const UserModal = ({ closeModal, setOnConfirmFunc, setOnDeclineFunc }) => {
    const user = useRecoilValue(userSelector(userId))

    return (
      <FormWrapper flex className="flex-col">
        <div className="flex flex-1 gap-x-2">
          <img
            className="object-cover w-20 h-20 tablet:w-24 tablet:h-24"
            src={user.image}
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
            <div className="flex gap-x-2">
              <span className="font-bold">Ориентация:</span>
              <span>
                {
                  ORIENTATIONS.find((item) => item.value === user.orientation)
                    ?.name
                }
              </span>
            </div>
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
