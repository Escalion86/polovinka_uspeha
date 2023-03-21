import React, { useEffect, useState } from 'react'
import useErrors from '@helpers/useErrors'

import Input from '@components/Input'
import FormWrapper from '@components/FormWrapper'
import ErrorsList from '@components/ErrorsList'
import ValuePicker from '@components/ValuePicker/ValuePicker'
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons'
import Textarea from '@components/Textarea'
import { DEFAULT_QUESTIONNAIRE } from '@helpers/constants'

const typesNames = {
  text: 'Текст (строка)',
  textarea: 'Текст (абзац)',
  number: 'Число',
  comboList: 'Один из списка',
  checkList: 'Несколько из списка',
  menu: 'Раскрывающийся список',
  date: 'Дата',
  time: 'Время',
  dateTime: 'Дата и время',
}

const data = [
  {
    type: 'text',
    label: 'Профессия',
    // key: 'profession',
    defaultValue: '123',
    show: true,
    required: true,
  },
  {
    type: 'textarea',
    label: 'О себе',
    // key: 'about',
    defaultValue: '',
    show: true,
    required: false,
  },
  {
    type: 'number',
    label: 'Возраст',
    // key: 'age',
    defaultValue: 1,
    show: true,
    required: true,
    params: { min: 1, max: undefined, step: 5 },
  },
  {
    type: 'valuePicker',
    label: 'Пол',
    // key: 'gender',
    defaultValue: 'male',
    valuesArray: [
      { value: 'male', name: 'Мужчина', color: 'blue-400', icon: faMars },
      { value: 'famale', name: 'Женщина', color: 'red-400', icon: faVenus },
    ],
    show: true,
    required: true,
  },
]

const userQuestionnaireFunc = (startData, onConfirm) => {
  const { title, data } = startData ?? DEFAULT_QUESTIONNAIRE
  const stateDefault = {}
  data.forEach((item) => {
    stateDefault[item.key] = item.defaultValue
    // stateDefault.push(item.show ? item.defaultValue : undefined)
  })

  const Q = ({ onChange }) => {
    return (
      <>
        {data
          // .filter((item) => item.show)
          .map((item) => {
            if (!item.show) return null
            const onItemChange = (value) => onChange(item.key, value)

            if (item.type === 'text')
              return (
                <Input
                  {...item.params}
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
            if (item.type === 'textarea')
              return (
                <Textarea
                  {...item.params}
                  label={item.label}
                  type="text"
                  defaultValue={item.defaultValue}
                  onChange={onItemChange}
                  required={item.required}
                />
              )
            if (item.type === 'number') {
              return (
                <Input
                  {...item.params}
                  key={item.key}
                  label={item.label}
                  defaultValue={item.defaultValue}
                  type="number"
                  // value={firstName}
                  onChange={onItemChange}
                  // labelClassName="w-40"
                  // error={errors.firstName}
                  required={item.required}
                />
              )
            }
            if (item.type === 'valuePicker')
              return (
                <ValuePicker
                  {...item.params}
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

    // const updateState = (index, value) => {
    //   setState((state) => {
    //     const newState = [...state]
    //     newState[index] = value
    //     return newState
    //   })
    // }

    const updateState = (key, value) =>
      setState((state) => ({ ...state, [key]: value }))

    console.log('state', state)

    // const router = useRouter()

    // const refreshPage = () => {
    //   router.replace(router.asPath)
    // }

    const onClickConfirm = () => {
      closeModal()
      onConfirm(state)
    }

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
      if (onConfirm) setOnConfirmFunc(onClickConfirm)
      // setOnShowOnCloseConfirmDialog(isFormChanged)
      // setDisableConfirm(!isFormChanged)
    }, [state])

    return (
      <FormWrapper>
        <Q onChange={updateState} />
        <ErrorsList errors={errors} />
      </FormWrapper>
    )
  }

  return {
    title,
    confirmButtonName: 'Применить',
    Children: UserQuestionnaireFuncModal,
  }
}

export default userQuestionnaireFunc
