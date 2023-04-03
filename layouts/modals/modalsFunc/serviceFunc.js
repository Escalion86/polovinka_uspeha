import React, { useEffect, useState } from 'react'
import useErrors from '@helpers/useErrors'
import { useRecoilValue } from 'recoil'
import serviceSelector from '@state/selectors/serviceSelector'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'

import CheckBox from '@components/CheckBox'
import Input from '@components/Input'
import EditableTextarea from '@components/EditableTextarea'
import FormWrapper from '@components/FormWrapper'
import InputImage from '@components/InputImage'
import ErrorsList from '@components/ErrorsList'
import {
  DEFAULT_SERVICE,
  DEFAULT_USERS_STATUS_ACCESS,
  DEFAULT_USERS_STATUS_DISCOUNT,
} from '@helpers/constants'
import servicesAtom from '@state/atoms/servicesAtom'
import PriceInput from '@components/PriceInput'
import TabPanel from '@components/Tabs/TabPanel'
import TabContext from '@components/Tabs/TabContext'
import Button from '@components/Button'
import InputWrapper from '@components/InputWrapper'
import { modalsFuncAtom } from '@state/atoms'
import { getNounQuestions } from '@helpers/getNoun'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import Textarea from '@components/Textarea'
import FormRow from '@components/FormRow'
import compareObjects from '@helpers/compareObjects'
import InputImages from '@components/InputImages'
import compareArrays from '@helpers/compareArraysWithDif'

const Questionnaire = ({ data, onChange }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  // if (!props.data)
  return (
    <InputWrapper
      paddingY="small"
      label="Анкета"
      wrapperClassName="flex items-center gap-x-1"
    >
      {!data ? (
        <div
          className="flex items-center justify-between flex-1 cursor-pointer h-7 gap-x-1"
          onClick={() => modalsFunc.questionnaire.constructor(data, onChange)}
        >
          <span className="text-gray-400">{'без анкеты'}</span>
          {/* <Button
            name="Создать анкету"
            onClick={() => modalsFunc.questionnaire.constructor(data, onChange)}
          /> */}
        </div>
      ) : (
        <div className="flex items-center flex-1 gap-x-1">
          <div
            className="flex items-center flex-1 cursor-pointer gap-x-1"
            onClick={() => modalsFunc.questionnaire.constructor(data, onChange)}
          >
            <div>{data?.title}</div>
            <div>({getNounQuestions(data?.data.length)})</div>
          </div>
          <div className="flex items-center justify-center p-1 duration-200 transform cursor-pointer w-7 h-7 hover:scale-125">
            <FontAwesomeIcon
              className="w-4 h-4 text-purple-400"
              icon={faEye}
              size="1x"
              onClick={() => modalsFunc.questionnaire.open(data)}
            />
          </div>
          {/* <FontAwesomeIcon
            className="w-4 h-4 text-danger"
            icon={faTrash}
            size="1x"
          /> */}
          <div className="flex items-center justify-center p-1 duration-200 transform cursor-pointer w-7 h-7 hover:scale-125">
            <FontAwesomeIcon
              className="w-4 h-4 text-danger"
              icon={faTrash}
              size="1x"
              onClick={() => onChange(null)}
            />
          </div>
          {/* <Button name="Создать анкету" /> */}
        </div>
      )}
    </InputWrapper>
  )
  // const { data, title } = props.data
  // return (
  //   <div>
  //     <div>{title}</div>
  //     {/* <Button name="Создать анкету" /> */}
  //   </div>
  // )
}

const serviceFunc = (serviceId, clone = false) => {
  const ServiceModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const services = useRecoilValue(servicesAtom)

    const service = useRecoilValue(serviceSelector(serviceId))

    const setService = useRecoilValue(itemsFuncAtom).service.set

    const [title, setTitle] = useState(service?.title ?? DEFAULT_SERVICE.title)
    const [description, setDescription] = useState(
      service?.description ?? DEFAULT_SERVICE.description
    )
    const [shortDescription, setShortDescription] = useState(
      service?.shortDescription ?? DEFAULT_SERVICE.shortDescription
    )
    const [images, setImages] = useState(
      service?.images ?? DEFAULT_SERVICE.images
    )
    const [menuName, setMenuName] = useState(
      service?.menuName ?? DEFAULT_SERVICE.menuName
    )
    const [showOnSite, setShowOnSite] = useState(
      service?.showOnSite ?? DEFAULT_SERVICE.setShowOnSite
    )
    const [price, setPrice] = useState(service?.price ?? DEFAULT_SERVICE.proce)
    const [questionnaire, setQuestionnaire] = useState(
      service?.questionnaire ?? DEFAULT_SERVICE.questionnaire
    )
    const defaultUsersStatusAccess = {
      ...DEFAULT_USERS_STATUS_ACCESS,
      ...service?.usersStatusAccess,
    }
    const [usersStatusAccess, setUsersStatusAccess] = useState(
      defaultUsersStatusAccess
    )

    const defaultUsersStatusDiscount = {
      ...DEFAULT_USERS_STATUS_DISCOUNT,
      ...(service?.usersStatusDiscount ?? DEFAULT_EVENT.usersStatusDiscount),
    }
    const [usersStatusDiscount, setUsersStatusDiscount] = useState(
      defaultUsersStatusDiscount
    )

    const [errors, checkErrors, addError, removeError, clearErrors] =
      useErrors()

    const onClickConfirm = async () => {
      if (
        !checkErrors({
          title,
          description,
          shortDescription,
          images,
          questionnaire,
        })
      ) {
        closeModal()
        setService(
          {
            _id: service?._id,
            title,
            shortDescription,
            description,
            showOnSite,
            images,
            menuName,
            index: service?.index ?? services?.length ?? 0,
            price,
            questionnaire,
            usersStatusAccess,
            usersStatusDiscount,
          },
          clone
        )
      }
    }

    useEffect(() => {
      const isFormChanged =
        service?.title !== title ||
        service?.description !== description ||
        service?.shortDescription !== shortDescription ||
        service?.showOnSite !== showOnSite ||
        !compareArrays(service?.images, images) ||
        service?.menuName !== menuName ||
        service?.price !== price ||
        !compareObjects(defaultUsersStatusAccess, usersStatusAccess) ||
        !compareObjects(defaultUsersStatusDiscount, usersStatusDiscount) ||
        service?.questionnaire !== questionnaire

      setOnConfirmFunc(onClickConfirm)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
    }, [
      title,
      shortDescription,
      description,
      showOnSite,
      images,
      menuName,
      price,
      questionnaire,
      usersStatusAccess,
      usersStatusDiscount,
    ])

    return (
      <>
        <TabContext value="Общие">
          <TabPanel tabName="Общие" className="px-0">
            <FormWrapper>
              <InputImages
                label="Фотографии"
                directory="services"
                images={images}
                onChange={(images) => {
                  removeError('images')
                  setImages(images)
                }}
                required
                error={errors.images}
              />
              {/* <InputImage
                label="Картинка"
                directory="services"
                image={image}
                onChange={(value) => {
                  removeError('image')
                  setImage(value)
                }}
                required
                error={errors.image}
              /> */}
              <Input
                label="Название"
                type="text"
                value={title}
                onChange={(value) => {
                  removeError('title')
                  setTitle(value)
                }}
                error={errors.title}
                required
              />
              <Textarea
                label="Короткое описание (для карточки)"
                value={shortDescription}
                onChange={(value) => {
                  removeError('shortDescription')
                  setShortDescription(value)
                }}
                error={errors.shortDescription}
                required
              />
              <EditableTextarea
                label="Описание"
                html={description}
                uncontrolled={false}
                onChange={(value) => {
                  removeError('description')
                  setDescription(value)
                }}
                error={errors.description}
                required
              />
              {/* <PriceInput
            value={price}
            onChange={(value) => {
              removeError('price')
              setPrice(value)
            }}
            error={errors.price}
            // labelPos="left"
          /> */}
              <Questionnaire data={questionnaire} onChange={setQuestionnaire} />
              <Input
                label="Название в меню"
                type="text"
                value={menuName}
                onChange={(value) => {
                  removeError('menuName')
                  setMenuName(value)
                }}
                error={errors.menuName}
              />
              <CheckBox
                checked={showOnSite}
                labelPos="left"
                // labelClassName="w-40"
                onClick={() => setShowOnSite((checked) => !checked)}
                label="Показывать на сайте"
              />
            </FormWrapper>
          </TabPanel>
          <TabPanel tabName="Доступ и стоимость" className="px-0">
            <PriceInput
              value={price}
              onChange={(value) => {
                removeError('price')
                setPrice(value)
              }}
              error={errors.price}
            />
            <CheckBox
              checked={usersStatusAccess?.noReg}
              labelPos="left"
              onClick={() =>
                setUsersStatusAccess((state) => {
                  return { ...state, noReg: !usersStatusAccess?.noReg }
                })
              }
              label="Не авторизован"
            />
            <CheckBox
              checked={usersStatusAccess?.novice}
              labelPos="left"
              onClick={() =>
                setUsersStatusAccess((state) => {
                  return { ...state, novice: !usersStatusAccess?.novice }
                })
              }
              label="Новичок"
            />
            {usersStatusAccess?.novice && (
              <FormRow>
                <PriceInput
                  label="Скидка новичкам"
                  value={usersStatusDiscount?.novice ?? 0}
                  onChange={(value) => {
                    setUsersStatusDiscount((state) => {
                      return { ...state, novice: value }
                    })
                  }}
                  noMargin
                />
                <div>
                  Итого: {(price - usersStatusDiscount?.novice) / 100} ₽
                </div>
              </FormRow>
            )}
            <CheckBox
              checked={usersStatusAccess?.member}
              labelPos="left"
              onClick={() =>
                setUsersStatusAccess((state) => {
                  return { ...state, member: !usersStatusAccess?.member }
                })
              }
              label="Участник клуба"
            />
            {usersStatusAccess?.member && (
              <FormRow>
                <PriceInput
                  label="Скидка участникам клуба"
                  value={usersStatusDiscount?.member ?? 0}
                  onChange={(value) => {
                    // removeError('price')
                    setUsersStatusDiscount((state) => {
                      return { ...state, member: value }
                    })
                  }}
                  noMargin
                  // labelContentWidth
                  // labelPos="left"
                />
                <div>
                  Итого: {(price - usersStatusDiscount?.member) / 100} ₽
                </div>
              </FormRow>
            )}
            {/* </FormRow> */}
            {/* </FormWrapper> */}
          </TabPanel>
        </TabContext>
        <ErrorsList errors={errors} />
      </>
    )
  }

  return {
    title: `${serviceId && !clone ? 'Редактирование' : 'Создание'} услуги`,
    confirmButtonName: serviceId && !clone ? 'Применить' : 'Создать',
    Children: ServiceModal,
  }
}

export default serviceFunc
