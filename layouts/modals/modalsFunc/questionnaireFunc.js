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
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import IconButtonMenu from '@components/ButtonMenu'
import Divider from '@components/Divider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Label from '@components/Label'
import questionnaireSelector from '@state/selectors/questionnaireSelector'

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
  label,
  onChange,
  title,
  index,
  onDelete,
  children,
}) => (
  <FormWrapper>
    {index >= 0 && <Divider thin light />}
    <div className="flex items-center gap-x-2">
      <div
        className="ml-2 font-bold text-right min-w-10 w-[10%] text-text leading-[0.875rem]"
        text={`№${index + 1}.`}
      >{`№${index + 1}.`}</div>
      <span className="flex-1 italic font-bold text-gray-600">{title}</span>
      <div className="flex items-center justify-center p-1 duration-200 transform cursor-pointer w-7 h-7 hover:scale-125">
        <FontAwesomeIcon
          className="w-4 h-4 text-red-700"
          icon={faTrash}
          size="1x"
          onClick={() => onDelete(index)}
        />
      </div>
    </div>
    <Input
      label="Заголовок (вопрос)"
      value={label}
      onChange={(newValue) => onChange({ label: newValue }, index)}
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
      setData((state) => [...state, { ...DEFAULT_QUESTIONNAIRE_ITEM, type }])

    const deleteItem = (index) =>
      setData((state) => state.filter((item, i) => i !== index))

    const onChange = (obj, index) => {
      setData((state) =>
        state.map((item, i) => (index === i ? { ...item, ...obj } : item))
      )
    }

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
          <div className="flex pl-10">
            <span className="flex items-center justify-center flex-1 text-lg font-bold">
              Вопросы
            </span>
            <div>
              <IconButtonMenu
                // dense
                // name="Добавить вопрос"
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
          </div>
          {data && data.length > 0 ? (
            data.map((item, index) => {
              return (
                <QuestionnaireItem
                  key={index}
                  label={item.label}
                  onChange={onChange}
                  title={typesNames[item.type]}
                  index={index}
                  onDelete={deleteItem}
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
              {'Нажмите "+" для создания вопроса анкеты'}
            </div>
          )}
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
