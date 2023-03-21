import React, { useEffect, useState } from 'react'
import useErrors from '@helpers/useErrors'
import { useRecoilValue } from 'recoil'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'

import Input from '@components/Input'
import FormWrapper from '@components/FormWrapper'
import ErrorsList from '@components/ErrorsList'
import {
  DEFAULT_QUESTIONNAIRE_ITEM,
  DEFAULT_QUESTIONNAIRE,
} from '@helpers/constants'
import {
  faArrowDown,
  faArrowUp,
  faAsterisk,
  faEye,
  faEyeSlash,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import IconButtonMenu from '@components/ButtonMenu'
import Divider from '@components/Divider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { unstable_useId } from '@mui/material'
import { v4 as uuid } from 'uuid'
import cn from 'classnames'
import arrayMove from '@helpers/arrayMove'

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

const QuestionnaireItem = ({
  // label,
  item,
  onChange,
  title,
  index,
  onDelete,
  children,
  onClickUp,
  onClickDown,
}) => (
  <FormWrapper>
    {index >= 0 && <Divider thin light />}
    <div className="flex items-center gap-x-2">
      <div
        className="ml-2 font-bold text-right min-w-10 w-[10%] text-text leading-[0.875rem]"
        text={`№${index + 1}.`}
      >{`№${index + 1}.`}</div>
      <span className="flex-1 italic font-bold text-gray-600">{title}</span>
      {onClickUp && (
        <div className="flex items-center justify-center p-0.5 duration-200 transform cursor-pointer w-7 h-7 hover:scale-110">
          <FontAwesomeIcon
            className="w-5 h-5 text-gray-400"
            icon={faArrowUp}
            size="1x"
            onClick={() => onClickUp(index)}
          />
        </div>
      )}
      {onClickDown && (
        <div className="flex items-center justify-center p-0.5 duration-200 transform cursor-pointer w-7 h-7 hover:scale-110">
          <FontAwesomeIcon
            className="w-5 h-5 text-gray-400"
            icon={faArrowDown}
            size="1x"
            onClick={() => onClickDown(index)}
          />
        </div>
      )}
      <div className="flex items-center justify-center p-0.5 duration-200 transform cursor-pointer w-7 h-7 hover:scale-110">
        <FontAwesomeIcon
          className={cn(
            'w-5 h-5',
            item.required ? 'text-danger' : 'text-gray-400'
          )}
          icon={faAsterisk}
          size="1x"
          onClick={() => onChange({ key: item.key, required: !item.required })}
        />
      </div>
      <div className="flex items-center justify-center p-0.5 duration-200 transform cursor-pointer w-7 h-7 hover:scale-110">
        <FontAwesomeIcon
          className="w-5 h-5 text-purple-500"
          icon={item.show ? faEye : faEyeSlash}
          size="1x"
          onClick={() => onChange({ key: item.key, show: !item.show })}
        />
      </div>
      <div className="ml-3 flex items-center justify-center p-0.5 duration-200 transform cursor-pointer w-7 h-7 hover:scale-110">
        <FontAwesomeIcon
          className="w-5 h-5 text-danger"
          icon={faTrash}
          size="1x"
          onClick={() => onDelete(item.key)}
        />
      </div>
    </div>
    <Input
      label="Заголовок (вопрос)"
      value={item.label}
      onChange={(newValue) => onChange({ key: item.key, label: newValue })}
      // noMargin
    />
    {children}
  </FormWrapper>
)

const questionnaireFunc = (startData, onConfirm) => {
  const QuestionnaireFuncModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    // const questionnaire = useRecoilValue(questionnaireSelector(questionnaireId))
    const [questionnaireName, setQuestionnaireName] = useState(
      startData?.title ?? DEFAULT_QUESTIONNAIRE.title
    )
    const [data, setData] = useState(
      startData?.data ?? DEFAULT_QUESTIONNAIRE.data
    )
    // const setQuestionnaire = useRecoilValue(itemsFuncAtom).questionnaire.set

    const [errors, checkErrors, addError, removeError, clearErrors] =
      useErrors()

    const addItem = (type) =>
      setData((state) => [
        ...state,
        { ...DEFAULT_QUESTIONNAIRE_ITEM, type, key: uuid() },
      ])

    // const deleteItem = (index) => {
    //   setData((state) => state.filter((item, i) => i !== index))
    // }

    const deleteItem = (key) => {
      setData((state) => state.filter((item) => item.key !== key))
    }

    // const onChange = (obj, index) => {
    //   setData((state) =>
    //     state.map((item, i) => (index === i ? { ...item, ...obj } : item))
    //   )
    // }

    const onChange = (obj) => {
      setData((state) =>
        state.map((item) => (item.key === obj.key ? { ...item, ...obj } : item))
      )
    }

    const onClickUp = (index) => {
      setData((state) => arrayMove(state, index, index - 1))
    }

    const onClickDown = (index) => {
      setData((state) => arrayMove(state, index, index + 1))
    }

    // console.log('data', data)

    // const router = useRouter()

    // const refreshPage = () => {
    //   router.replace(router.asPath)
    // }
    // console.log('startData', startData)
    // console.log('onConfirm', onConfirm)

    const onClickConfirm = async () => {
      closeModal()
      onConfirm({ title: questionnaireName, data })
      // setQuestionnaire(
      //   {
      //     _id: questionnaire?._id,
      //     name: questionnaireName,
      //     data,
      //   },
      //   clone
      // )
    }
    console.log('data', data)

    useEffect(() => {
      const isErrors =
        questionnaireName === '' ||
        data.length === 0 ||
        data.find((item) => !item.label)
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
      // setOnDeclineFunc(() => onConfirm(null))
      // setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(isErrors)
    }, [questionnaireName, data])

    return (
      <div className="flex flex-col">
        {/* <Divider thin light /> */}

        <FormWrapper className="gap-y-1">
          <Input
            label="Название анкеты"
            value={questionnaireName}
            onChange={setQuestionnaireName}
          />
          {/* <div className="flex pl-10"> */}
          <div className="flex items-center justify-center flex-1 text-lg font-bold">
            Вопросы
          </div>
          {/* </div> */}
          {data && data.length > 0 ? (
            data.map((item, index) => {
              return (
                <QuestionnaireItem
                  key={item.key}
                  item={item}
                  // label={item.label}
                  onChange={onChange}
                  title={typesNames[item.type]}
                  index={index}
                  onDelete={deleteItem}
                  onClickUp={index > 0 && onClickUp}
                  onClickDown={index < data.length - 1 && onClickDown}
                >
                  {item.type === 'number' && (
                    <div className="flex mt-2 gap-x-1">
                      <Input
                        label="Минимум"
                        value={item.params?.min}
                        onChange={
                          (newValue) =>
                            setData((state) =>
                              state.map((item, i) =>
                                index === i
                                  ? {
                                      ...item,
                                      params: { ...item.params, min: newValue },
                                    }
                                  : item
                              )
                            )
                          // onChange({ params: { min: newValue } }, index)
                        }
                        type="number"
                        // inputClassName="w-40"
                        noMargin
                      />
                      <Input
                        label="Максимум"
                        value={item.params?.max}
                        onChange={
                          (newValue) =>
                            setData((state) =>
                              state.map((item, i) =>
                                index === i
                                  ? {
                                      ...item,
                                      params: { ...item.params, max: newValue },
                                    }
                                  : item
                              )
                            )
                          // onChange({ params: { max: newValue } }, index)
                        }
                        type="number"
                        // inputClassName="w-40"
                        noMargin
                      />
                    </div>
                  )}
                </QuestionnaireItem>
              )
              // if (item.type === 'textarea')
              // return (
              //   <QuestionnaireItem index={index} onDelete={deleteItem}>
              //     <Input
              //       label="Вопрос"
              //       value={item.value}
              //       onChange={(newValue) =>
              //         onChange({ value: newValue }, index)
              //       }
              //     />
              //   </QuestionnaireItem>
              // )
            })
          ) : (
            <div className="flex justify-center w-full">
              {'Нет вопросов. Нажмите "+" для создания вопроса анкеты'}
            </div>
          )}
          <div className="flex justify-center">
            <IconButtonMenu
              // dense
              name="Добавить вопрос"
              icon={faPlus}
              items={[
                { name: 'Текст (строка)', value: 'text' },
                { name: 'Текст (абзац)', value: 'textarea' },
                null,
                { name: 'Число', value: 'number' },
                // null,
                // { name: 'Один из списка', value: 'comboList' },
                // { name: 'Несколько из списка', value: 'checkList' },
                // { name: 'Раскрывающийся список', value: 'menu' },
                // null,
                // { name: 'Дата', value: 'date' },
                // { name: 'Время', value: 'time' },
                // { name: 'Дата и время', value: 'dateTime' },
              ]}
              onChange={addItem}
            />
          </div>

          <ErrorsList errors={errors} />
        </FormWrapper>
      </div>
    )
  }

  return {
    title: `Конструктор анкеты`,
    confirmButtonName: 'Создать',
    Children: QuestionnaireFuncModal,
  }
}

export default questionnaireFunc
