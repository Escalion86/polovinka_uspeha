import React, { useEffect, useState } from 'react'
import useErrors from '@helpers/useErrors'

import Input from '@components/Input'
import FormWrapper from '@components/FormWrapper'
import ErrorsList from '@components/ErrorsList'
import ValuePicker from '@components/ValuePicker/ValuePicker'
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons'
import Textarea from '@components/Textarea'
import { DEFAULT_QUESTIONNAIRE } from '@helpers/constants'
import DatePicker from '@components/DatePicker'
import DateTimePicker from '@components/DateTimePicker'
import TimePicker from '@components/TimePicker'
import QuestionnaireAnswersFill from '@components/QuestionnaireAnswersFill'
import CheckBox from '@components/CheckBox'
import InputWrapper from '@components/InputWrapper'
import RadioBox from '@components/RadioBox'

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

const CheckBoxList = ({
  label,
  error,
  required,
  list = [],
  defaultValue = [],
  onChange,
  fullWidth,
  ownItem = false,
}) => {
  const [value, setValue] = useState(
    defaultValue.filter((item) => list.includes(item))
  )
  const [ownItemChecked, setOwnItemChecked] = useState(
    !!defaultValue.find((item) => !list.includes(item))
  )
  const [ownItemInput, setOwnItemInput] = useState(
    defaultValue.find((item) => !list.includes(item)) || ''
  )

  return (
    <InputWrapper
      label={label}
      // labelClassName={labelClassName}
      // value={value ?? defaultValue}
      // className={className}
      required={required}
      // floatingLabel={floatingLabel}
      error={error}
      // showErrorText={showErrorText}
      paddingY="small"
      // paddingX={paddingX}
      // postfix={postfix}
      // prefix={prefix}
      // ref={ref}
      // disabled={disabled}
      fullWidth={fullWidth}
      // noBorder={noBorder}
      // noMargin
    >
      <div className="w-full">
        {list.map((label) => {
          const checked = value.includes(label)
          return (
            <CheckBox
              key={label}
              onChange={() => {
                const newValue = checked
                  ? value.filter((item) => item !== label)
                  : [...value, label]
                setValue(newValue)
                if (!ownItemChecked || ownItemInput === '') onChange(newValue)
                else onChange([...newValue, ownItemInput])
              }}
              checked={checked}
              label={label}
              wrapperClassName="w-full"
            />
          )
        })}
        {ownItem && (
          <div className="flex items-center w-full mt-2 mb-1 gap-x-1">
            <CheckBox
              onChange={() => {
                if (ownItemChecked || ownItemInput === '') onChange(value)
                else onChange([...value, ownItemInput])
                setOwnItemChecked(!ownItemChecked)
              }}
              label="Другое:"
              checked={ownItemChecked}
              // wrapperClassName="w-full"
              noMargin
              labelClassName="text-gray-500"
            />
            <input
              value={ownItemInput}
              onChange={(e) => {
                const newValue = e.target.value
                if (!ownItemChecked || e.target.value === '') onChange(value)
                else onChange([...value, newValue])
                setOwnItemInput(e.target.value)
              }}
              className="flex-1 py-0 border-b border-gray-400 outline-none"
            />
          </div>
        )}
      </div>
    </InputWrapper>
  )
}

const RadioBoxList = ({
  label,
  error,
  required,
  list = [],
  defaultValue = null,
  onChange,
  fullWidth,
  ownItem = false,
}) => {
  const [value, setValue] = useState(defaultValue)
  const [ownItemChecked, setOwnItemChecked] = useState(
    !list.includes(defaultValue)
  )
  const [ownItemInput, setOwnItemInput] = useState(
    list.includes(defaultValue) ? '' : defaultValue
  )
  return (
    <InputWrapper
      label={label}
      // labelClassName={labelClassName}
      value={value}
      // className={className}
      required={required}
      // floatingLabel={floatingLabel}
      error={error}
      // showErrorText={showErrorText}
      paddingY="small"
      // paddingX={paddingX}
      // postfix={postfix}
      // prefix={prefix}
      // ref={ref}
      // disabled={disabled}
      fullWidth={fullWidth}
      // noBorder={noBorder}
      // noMargin
    >
      <div className="w-full">
        {list.map((label) => {
          const checked = value === label
          return (
            <RadioBox
              key={label}
              onClick={() => {
                setOwnItemChecked(false)
                if (!checked) {
                  setValue(label)
                  onChange(label)
                }
              }}
              checked={checked}
              label={label}
              wrapperClassName="w-full"
            />
          )
        })}
        {ownItem && (
          <div className="flex items-center w-full mt-2 mb-1 gap-x-1">
            <RadioBox
              onChange={() => {
                if (!ownItemChecked) {
                  setValue(ownItemInput)
                  onChange(ownItemInput)
                }
                setOwnItemChecked(!ownItemChecked)
              }}
              label="Другое:"
              checked={ownItemChecked}
              // wrapperClassName="w-full"
              noMargin
              labelClassName="text-gray-500"
            />
            <input
              value={ownItemInput}
              onChange={(e) => {
                const newValue = e.target.value
                if (ownItemChecked) {
                  setValue(e.target.value)
                  onChange(newValue)
                }
                setOwnItemInput(e.target.value)
              }}
              className="flex-1 py-0 border-b border-gray-400 outline-none"
            />
          </div>
        )}
      </div>
    </InputWrapper>
  )
}

const Q = ({ data, state, onChange, errors }) => {
  // console.log('state', state)
  console.log('state', state)
  return (
    <div>
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
                defaultValue={state[item.key]}
                type="text"
                // value={firstName}
                onChange={onItemChange}
                // labelClassName="w-40"
                error={errors[item.key]}
                required={item.required}
              />
            )
          if (item.type === 'textarea')
            return (
              <Textarea
                {...item.params}
                key={item.key}
                label={item.label}
                type="text"
                defaultValue={state[item.key]}
                onChange={onItemChange}
                required={item.required}
                error={errors[item.key]}
              />
            )
          if (item.type === 'number') {
            return (
              <Input
                {...item.params}
                key={item.key}
                label={item.label}
                defaultValue={state[item.key]}
                type="number"
                // value={firstName}
                onChange={onItemChange}
                // labelClassName="w-40"
                error={errors[item.key]}
                required={item.required}
              />
            )
          }
          if (item.type === 'valuePicker')
            return (
              <ValuePicker
                {...item.params}
                key={item.key}
                defaultValue={state[item.key]}
                // value={gender}
                valuesArray={item.valuesArray}
                label={item.label}
                onChange={onItemChange}
                // name="gender"
                error={errors[item.key]}
                required={item.required}
              />
            )
          if (item.type === 'date')
            return (
              <DatePicker
                {...item.params}
                key={item.key}
                label={item.label}
                defaultValue={state[item.key]}
                // value={firstName}
                onChange={onItemChange}
                // labelClassName="w-40"
                error={errors[item.key]}
                required={item.required}
                fullWidth
              />
            )
          if (item.type === 'time')
            return (
              <TimePicker
                {...item.params}
                key={item.key}
                label={item.label}
                defaultValue={state[item.key]}
                // value={firstName}
                onChange={onItemChange}
                // labelClassName="w-40"
                error={errors[item.key]}
                required={item.required}
                fullWidth
              />
            )
          if (item.type === 'dateTime')
            return (
              <DateTimePicker
                {...item.params}
                key={item.key}
                label={item.label}
                defaultValue={state[item.key]}
                // value={firstName}
                onChange={onItemChange}
                // labelClassName="w-40"
                error={errors[item.key]}
                required={item.required}
                fullWidth
              />
            )
          if (item.type === 'checkList')
            return (
              <CheckBoxList
                {...item.params}
                key={item.key}
                label={item.label}
                // list={}
                // value={}
                defaultValue={state[item.key]}
                onChange={onItemChange}
                error={errors[item.key]}
                required={item.required}
                fullWidth
                // label={item.label}
                // defaultValue={state[item.key]}
                // // value={firstName}
                // onChange={onItemChange}
                // // labelClassName="w-40"
                // error={errors[item.key]}
                // required={item.required}
                // fullWidth
              />
            )
          if (item.type === 'radioList')
            return (
              <RadioBoxList
                {...item.params}
                key={item.key}
                label={item.label}
                // list={}
                // value={}
                defaultValue={state[item.key]}
                onChange={onItemChange}
                error={errors[item.key]}
                required={item.required}
                fullWidth
                // label={item.label}
                // defaultValue={state[item.key]}
                // // value={firstName}
                // onChange={onItemChange}
                // // labelClassName="w-40"
                // error={errors[item.key]}
                // required={item.required}
                // fullWidth
              />
            )

          return null
        })}
    </div>
  )
}

const userQuestionnaireFunc = (questionnaire, value, onConfirm) => {
  const { title, data } = questionnaire ?? DEFAULT_QUESTIONNAIRE
  const stateDefault = {}
  data.forEach((item) => {
    stateDefault[item.key] =
      value !== null &&
      typeof value === 'object' &&
      value.hasOwnProperty(item.key)
        ? value[item.key]
        : item.defaultValue
    // stateDefault.push(item.show ? item.defaultValue : undefined)
  })

  const UserQuestionnaireFuncModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setBottomLeftButtonProps,
    setBottomLeftComponent,
  }) => {
    // const [loggedUser, setLoggedUser] = useRecoilState(loggedUserAtom)
    // const isLoggedUserDev = useRecoilValue(isLoggedUserDevSelector)
    // const user = useRecoilValue(userSelector(userId))
    // const setUser = useRecoilValue(itemsFuncAtom).user.set
    // const users = useRecoilValue(usersAtom)

    const [state, setState] = useState(stateDefault)
    const [errors, setErrors] = useState({})

    // const [errors, checkErrors, addError, removeError, clearErrors] =
    //   useErrors()

    // const updateState = (index, value) => {
    //   setState((state) => {
    //     const newState = [...state]
    //     newState[index] = value
    //     return newState
    //   })
    // }

    const updateState = (key, value) => {
      setState((state) => ({ ...state, [key]: value }))
      setErrors((state) => ({ ...state, [key]: false }))
    }

    // console.log('state', state)

    // const router = useRouter()

    // const refreshPage = () => {
    //   router.replace(router.asPath)
    // }

    const checkRequiredFields = () => {
      const errorsArr = {}
      data.forEach((item) => {
        const value = state[item.key]
        if (
          item.required &&
          !(
            value !== undefined &&
            value !== null &&
            value !== 'NaN' &&
            (!typeof value == 'object' || value.length !== 0)
          )
        )
          errorsArr[item.key] = item.label
      })
      return errorsArr
    }

    const onClickConfirm = () => {
      const errorsArr = checkRequiredFields()
      if (Object.keys(errorsArr).length === 0) {
        closeModal()
        onConfirm(state)
      } else {
        setErrors(errorsArr)
      }
    }

    useEffect(() => {
      // const isAllRequiredFilled = !data.find(
      //   (item) => item.required && !state[item.key]
      // )
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
      // setDisableConfirm(!isAllRequiredFilled)
    }, [state])

    useEffect(() => {
      setBottomLeftComponent(
        <QuestionnaireAnswersFill answers={state} questionnaireData={data} />
      )
    }, [data, state])

    return (
      <FormWrapper>
        <Q data={data} state={state} onChange={updateState} errors={errors} />
        {/* <ErrorsList errors={errors} /> */}
      </FormWrapper>
    )
  }

  return {
    title: `Анкета "${title}"`,
    confirmButtonName: 'Применить',
    Children: UserQuestionnaireFuncModal,
  }
}

export default userQuestionnaireFunc
