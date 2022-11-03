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
import ValuePicker from '@components/ValuePicker/ValuePicker'
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons'

const userQuestionnaireFunc = (userId, questionnaireId) => {
  const data = [
    {
      type: 'text',
      label: 'Профессия',
      key: 'profession',
      defaultValue: '',
      show: true,
      required: true,
    },
    {
      type: 'number',
      label: 'Возраст',
      key: 'age',
      defaultValue: 0,
      show: true,
      required: true,
      min: 0,
      max: undefined,
    },
    {
      type: 'valuePicker',
      label: 'Пол',
      key: 'gender',
      defaultValue: 'male',
      valuesArray: [
        { value: 'male', name: 'Мужчина', color: 'blue-400', icon: faMars },
        { value: 'famale', name: 'Женщина', color: 'red-400', icon: faVenus },
      ],
      show: true,
      required: true,
    },
  ]
  const stateDefault = {}
  data.forEach((item) => {
    if (item.show) stateDefault[item.key] = item.defaultValue
  })

  const Q = ({ onChange }) => {
    return (
      <>
        {data
          .filter((item) => item.show)
          .map((item) => {
            const onItemChange = (value) => onChange({ [item.key]: value })
            if (item.type === 'text')
              return (
                <Input
                  key={item.key}
                  label={item.label}
                  defaultValue={item.defaultValue}
                  type="text"
                  // value={firstName}
                  onChange={onItemChange}
                  // labelClassName="w-40"
                  // error={errors.firstName}
                  required={item.required}
                />
              )
            if (item.type === 'number')
              return (
                <Input
                  key={item.key}
                  label={item.label}
                  defaultValue={item.defaultValue}
                  type="number"
                  // value={firstName}
                  onChange={onItemChange}
                  min={item.min}
                  max={item.max}
                  // labelClassName="w-40"
                  // error={errors.firstName}
                  // required
                />
              )
            if (item.type === 'valuePicker')
              return (
                <ValuePicker
                  key={item.key}
                  defaultValue={item.defaultValue}
                  // value={gender}
                  valuesArray={item.valuesArray}
                  label={item.label}
                  onChange={onItemChange}
                  // name="gender"
                  // required={required}
                  // error={error}
                />
              )
            return null
          })}
      </>
    )
  }

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

    const updateState = (obj) => setState((state) => ({ ...state, ...obj }))

    console.log('state', state)

    // const router = useRouter()

    // const refreshPage = () => {
    //   router.replace(router.asPath)
    // }

    const onClickConfirm = async () => {}

    useEffect(() => {
      // const isFormChanged =
      //   user?.firstName !== firstName ||
      //   user?.secondName !== secondName ||
      //   user?.thirdName !== thirdName ||
      //   // user?.about !== about ||
      //   // user?.interests !== interests ||
      //   // user?.profession !== profession ||
      //   // user?.orientation !== orientation ||
      //   user?.gender !== gender ||
      //   user?.email !== email ||
      //   user?.phone !== phone ||
      //   user?.whatsapp !== whatsapp ||
      //   user?.viber !== viber ||
      //   user?.telegram !== telegram ||
      //   user?.instagram !== instagram ||
      //   user?.vk !== vk ||
      //   !compareArrays(user?.images, images) ||
      //   user?.birthday !== birthday ||
      //   user?.haveKids !== haveKids ||
      //   user?.status !== status ||
      //   user?.role !== role

      setOnConfirmFunc(onClickConfirm)
      // setOnShowOnCloseConfirmDialog(isFormChanged)
      // setDisableConfirm(!isFormChanged)
    }, [])

    return (
      <FormWrapper>
        <Q onChange={updateState} />
        <ErrorsList errors={errors} />
      </FormWrapper>
    )
  }

  return {
    title: `Дополнительная анкета пользователя`,
    confirmButtonName: 'Применить',
    Children: UserQuestionnaireFuncModal,
  }
}

export default userQuestionnaireFunc
