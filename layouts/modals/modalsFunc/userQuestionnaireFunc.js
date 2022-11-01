import React, { useEffect, useState } from 'react'
import useErrors from '@helpers/useErrors'

import { useRecoilState, useRecoilValue } from 'recoil'
import userSelector from '@state/selectors/userSelector'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'

import Input from '@components/Input'
import FormWrapper from '@components/FormWrapper'
// import InputImage from '@components/InputImage'
import DatePicker from '@components/DatePicker'
import PhoneInput from '@components/PhoneInput'
// import OrientationPicker from '@components/ValuePicker/OrientationPicker'
import GenderPicker from '@components/ValuePicker/GenderPicker'
import ErrorsList from '@components/ErrorsList'
import UserStatusPicker from '@components/ValuePicker/UserStatusPicker'
// import validateEmail from '@helpers/validateEmail'
import InputImages from '@components/InputImages'
// import CheckBox from '@components/CheckBox'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import compareArrays from '@helpers/compareArrays'
import { DEFAULT_USER } from '@helpers/constants'
// import ValuePicker from '@components/ValuePicker/ValuePicker'
import HaveKidsPicker from '@components/ValuePicker/HaveKidsPicker'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import UserRolePicker from '@components/ValuePicker/UserRolePicker'
import usersAtom from '@state/atoms/usersAtom'
import { text } from '@fortawesome/fontawesome-svg-core'

const userQuestionnaireFunc = (userId) => {
  const data = [
    { type: 'text', label: 'Профессия', key: 'profession', defaultValue: '' },
    { type: 'number', label: 'Возраст', key: 'age', defaultValue: 0 },
    { type: 'valuePicker', label: 'Пол', key: 'gender', defaultValue: 'male' },
  ]
  const stateDefault = {}
  data.forEach((item) => (stateDefault[item.key] = item.defaultValue))

  const Q = ({ onChange }) => (
    <>
      {data.map((item) => {
        if (item.type === 'text')
          return (
            <Input
              key={item.key}
              label={item.label}
              defaultValue={item.defaultValue}
              type="text"
              // value={firstName}
              onChange={(value) => {
                onChange({ [item.key]: value })
              }}
              // labelClassName="w-40"
              // error={errors.firstName}
              // required
            />
          )
        return null
      })}
    </>
  )

  const UserQuestionnaireFuncModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    // const [loggedUser, setLoggedUser] = useRecoilState(loggedUserAtom)
    // const isLoggedUserDev = useRecoilValue(isLoggedUserDevSelector)
    // const user = useRecoilValue(userSelector(userId))
    // const setUser = useRecoilValue(itemsFuncAtom).user.set
    // const users = useRecoilValue(usersAtom)

    const [state, setState] = useState(stateDefault)

    const [errors, checkErrors, addError, removeError, clearErrors] =
      useErrors()

    console.log('state', state)

    // const router = useRouter()

    // const refreshPage = () => {
    //   router.replace(router.asPath)
    // }

    const onClickConfirm = async () => {}

    return (
      <FormWrapper>
        <Q onChange={(e) => console.log('e', e)} />
        <ErrorsList errors={errors} />
      </FormWrapper>
    )
  }

  return {
    title: `${userId && !clone ? 'Редактирование' : 'Создание'} пользователя`,
    confirmButtonName: userId && !clone ? 'Применить' : 'Создать',
    Children: UserQuestionnaireFuncModal,
  }
}

export default userQuestionnaireFunc
