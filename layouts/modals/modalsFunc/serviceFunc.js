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
import { DEFAULT_SERVICE } from '@helpers/constants'
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
    const [image, setImage] = useState(service?.image ?? DEFAULT_SERVICE.image)
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
    const [errors, checkErrors, addError, removeError, clearErrors] =
      useErrors()

    const onClickConfirm = async () => {
      if (
        !checkErrors({
          title,
          description,
          shortDescription,
          image,
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
            image,
            menuName,
            index: service?.index ?? services?.length ?? 0,
            price,
            questionnaire,
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
        service?.image !== image ||
        service?.menuName !== menuName ||
        service?.price !== price ||
        service?.questionnaire !== questionnaire

      setOnConfirmFunc(onClickConfirm)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
    }, [
      title,
      shortDescription,
      description,
      showOnSite,
      image,
      menuName,
      price,
      questionnaire,
    ])

    return (
      <>
        {/* <TabContext value="Общие">
          <TabPanel tabName="Общие" className="px-0"> */}
        <FormWrapper>
          <InputImage
            label="Картинка"
            directory="services"
            image={image}
            onChange={(value) => {
              removeError('image')
              setImage(value)
            }}
            required
            error={errors.image}
          />
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
          <PriceInput
            value={price}
            onChange={(value) => {
              removeError('price')
              setPrice(value)
            }}
            error={errors.price}
            // labelPos="left"
          />
          <Questionnaire data={questionnaire} onChange={setQuestionnaire} />
          <Input
            label="Название в меню"
            type="text"
            value={menuName}
            onChange={(value) => {
              removeError('menuName')
              setMenuName(value)
            }}
            // labelClassName="w-40"
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
        {/* </TabPanel>
          <TabPanel tabName="Анкета" className="px-0"> */}
        {/* <CheckBox
              checked={showOnSite}
              labelPos="left"
              // labelClassName="w-40"
              onClick={() => setShowOnSite((checked) => !checked)}
              label="Показывать на сайте"
            /> */}
        {/* </TabPanel>
        </TabContext> */}
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
