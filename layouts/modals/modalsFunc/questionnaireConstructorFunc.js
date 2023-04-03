import React, { useEffect, useState } from 'react'
import useErrors from '@helpers/useErrors'

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
  faMinus,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import IconButtonMenu from '@components/ButtonMenu'
import Divider from '@components/Divider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { v4 as uuid } from 'uuid'
import cn from 'classnames'
import arrayMove from '@helpers/arrayMove'
import InputWrapper from '@components/InputWrapper'
import Button from '@components/Button'
import CheckBox from '@components/CheckBox'
import getNoun from '@helpers/getNoun'

const typesNames = {
  text: 'Текст (строка)',
  textarea: 'Текст (абзац)',
  number: 'Число',
  comboList: 'Раскрывающийся список',
  radioList: 'Один из списка',
  checkList: 'Несколько из списка',
  customList: 'Список в свободной форме',
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
    {index >= 0 && <Divider thin />}
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
      className="mt-2 mb-1"
      noMargin
    />
    {children}
  </FormWrapper>
)

const ListConstructor = ({ list = [], onChange }) => {
  const [listState, setListState] = useState(
    list.map((item) => ({ key: uuid(), value: item }))
  )

  return (
    <>
      <div className="flex flex-col w-full gap-y-1">
        {listState.map(({ key, value }, index) => (
          <div key={key} className="flex items-center gap-x-1">
            <div className="w-6 text-right">{`${index + 1}.`}</div>
            <input
              value={value}
              onChange={(e) => {
                const newList = listState.map((item) =>
                  item.key === key ? { ...item, value: e.target.value } : item
                )
                onChange(newList.map(({ value }) => value))
                setListState(newList)
              }}
              className="flex-1 px-1 border border-gray-400 rounded"
            />
            <div className="flex items-center justify-center p-0.5 duration-200 transform cursor-pointer w-6 h-6 hover:scale-110">
              <FontAwesomeIcon
                className="w-4 h-4 text-danger"
                icon={faTrash}
                size="1x"
                onClick={() => {
                  const newList = listState.filter((item) => item.key !== key)
                  onChange(newList.map(({ value }) => value))
                  setListState(newList)
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="w-full">
        <Button
          name="Добавить пункт списка"
          thin
          onClick={() => {
            const newList = [...listState]
            newList.push({ key: uuid(), value: '' })
            onChange(newList.map(({ value }) => value))
            setListState(newList)
          }}
          icon={faPlus}
        />
      </div>
    </>
    // </InputWrapper>
  )
}

const questionnaireConstructorFunc = (startData, onConfirm) => {
  const QuestionnaireConstructorFuncModal = ({
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

    const [errors, checkErrors, addError, removeError, clearErrors] =
      useErrors()

    const addItem = (type) => {
      var params = {}
      var defaultValue = null
      if (type === 'customList') {
        params = { minItems: 1, maxItems: 10, withNumbering: false }
        defaultValue = []
      }
      if (type === 'checkList' || type === 'images') {
        defaultValue = []
      }
      setData((state) => [
        ...state,
        {
          ...DEFAULT_QUESTIONNAIRE_ITEM,
          type,
          key: uuid(),
          defaultValue,
          params,
        },
      ])
    }

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
                  {item.type === 'checkList' && (
                    <InputWrapper
                      paddingY
                      label="Пункты списка"
                      wrapperClassName="flex flex-col items-center gap-x-1 gap-y-1"
                    >
                      <ListConstructor
                        list={item.params?.list}
                        onChange={(newList) =>
                          setData((state) =>
                            state.map((item, i) =>
                              index === i
                                ? {
                                    ...item,
                                    params: { ...item.params, list: newList },
                                  }
                                : item
                            )
                          )
                        }
                      />
                      <div className="flex flex-wrap w-full gap-x-1 h-[38px] items-center">
                        <CheckBox
                          label="Анкетируемый может добавить"
                          checked={item.params?.ownItem}
                          // wrapperClassName="w-full"
                          onClick={() =>
                            setData((state) =>
                              state.map((item, i) =>
                                index === i
                                  ? {
                                      ...item,
                                      params: {
                                        ...item.params,
                                        ownItem: !item.params?.ownItem,
                                      },
                                    }
                                  : item
                              )
                            )
                          }
                        />
                        <input
                          value={item.params?.ownItemMax}
                          onChange={(e) => {
                            const newValue = e.target.value
                            setData((state) =>
                              state.map((item, i) =>
                                index === i
                                  ? {
                                      ...item,
                                      params: {
                                        ...item.params,
                                        ownItemMax: newValue,
                                      },
                                    }
                                  : item
                              )
                            )
                          }}
                          type="number"
                          min="1"
                          placeholder="1"
                          className="w-12 py-0 text-center border-b border-gray-400 outline-none"
                        />
                        <div>
                          {getNoun(
                            parseInt(item.params?.ownItemMax || 1),
                            'пункт',
                            'пункта',
                            'пунктов',
                            false
                          )}
                        </div>
                      </div>
                    </InputWrapper>
                  )}
                  {(item.type === 'radioList' || item.type === 'comboList') && (
                    <InputWrapper
                      paddingY
                      label="Пункты списка"
                      wrapperClassName="flex flex-col items-center gap-x-1 gap-y-1"
                    >
                      <ListConstructor
                        list={item.params?.list}
                        onChange={(newList) =>
                          setData((state) =>
                            state.map((item, i) =>
                              index === i
                                ? {
                                    ...item,
                                    params: { ...item.params, list: newList },
                                  }
                                : item
                            )
                          )
                        }
                      />
                      <CheckBox
                        label="Анкетируемый может добавить свой пункт"
                        checked={item.params?.ownItem}
                        wrapperClassName="w-full"
                        onClick={() =>
                          setData((state) =>
                            state.map((item, i) =>
                              index === i
                                ? {
                                    ...item,
                                    params: {
                                      ...item.params,
                                      ownItem: !item.params?.ownItem,
                                    },
                                  }
                                : item
                            )
                          )
                        }
                      />
                    </InputWrapper>
                  )}
                  {item.type === 'customList' && (
                    <div className="flex mt-3 gap-x-1">
                      <Input
                        label="Минимум пунктов"
                        value={item.params?.minItems}
                        onChange={(newValue) =>
                          setData((state) =>
                            state.map((item, i) =>
                              index === i
                                ? {
                                    ...item,
                                    params: {
                                      ...item.params,
                                      minItems: newValue,
                                    },
                                  }
                                : item
                            )
                          )
                        }
                        type="number"
                        // inputClassName="w-40"
                        noMargin
                      />
                      <Input
                        label="Максимум пунктов"
                        value={item.params?.maxItems}
                        onChange={(newValue) =>
                          setData((state) =>
                            state.map((item, i) =>
                              index === i
                                ? {
                                    ...item,
                                    params: {
                                      ...item.params,
                                      maxItems: newValue,
                                    },
                                  }
                                : item
                            )
                          )
                        }
                        type="number"
                        // inputClassName="w-40"
                        noMargin
                      />
                      <CheckBox
                        label="С нумерацией"
                        checked={item.params?.withNumbering}
                        wrapperClassName="w-full"
                        onClick={() =>
                          setData((state) =>
                            state.map((item, i) =>
                              index === i
                                ? {
                                    ...item,
                                    params: {
                                      ...item.params,
                                      withNumbering:
                                        !item.params?.withNumbering,
                                    },
                                  }
                                : item
                            )
                          )
                        }
                      />
                    </div>
                  )}
                  {item.type === 'images' && (
                    <div className="flex mt-3 gap-x-1">
                      {/* <Input
                        label="Минимум фотографий"
                        value={item.params?.minItems}
                        onChange={(newValue) =>
                          setData((state) =>
                            state.map((item, i) =>
                              index === i
                                ? {
                                    ...item,
                                    params: {
                                      ...item.params,
                                      minItems: newValue,
                                    },
                                  }
                                : item
                            )
                          )
                        }
                        type="number"
                        // inputClassName="w-40"
                        noMargin
                      /> */}
                      <Input
                        label="Максимум фотографий"
                        value={item.params?.maxImages}
                        onChange={(newValue) =>
                          setData((state) =>
                            state.map((item, i) =>
                              index === i
                                ? {
                                    ...item,
                                    params: {
                                      ...item.params,
                                      maxImages: newValue,
                                    },
                                  }
                                : item
                            )
                          )
                        }
                        type="number"
                        // inputClassName="w-40"
                        noMargin
                      />
                    </div>
                  )}
                  {item.type === 'number' && (
                    <div className="flex mt-3 gap-x-1">
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
                null,
                { name: 'Один из списка', value: 'radioList' },
                { name: 'Несколько из списка', value: 'checkList' },
                // { name: 'Раскрывающийся список', value: 'comboList' },
                { name: 'Список в свободной форме', value: 'customList' },
                null,
                { name: 'Дата', value: 'date' },
                { name: 'Время', value: 'time' },
                { name: 'Дата и время', value: 'dateTime' },
                null,
                { name: 'Фотографии / картинки', value: 'images' },
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
    confirmButtonName: 'Применить',
    Children: QuestionnaireConstructorFuncModal,
  }
}

export default questionnaireConstructorFunc
