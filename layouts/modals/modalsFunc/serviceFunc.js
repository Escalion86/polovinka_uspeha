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
    const [image, setImage] = useState(service?.image ?? DEFAULT_SERVICE.image)
    const [menuName, setMenuName] = useState(
      service?.menuName ?? DEFAULT_SERVICE.menuName
    )
    const [showOnSite, setShowOnSite] = useState(
      service?.showOnSite ?? DEFAULT_SERVICE.setShowOnSite
    )
    const [price, setPrice] = useState(service?.price ?? DEFAULT_SERVICE.proce)
    const [errors, checkErrors, addError, removeError, clearErrors] =
      useErrors()

    const onClickConfirm = async () => {
      if (!checkErrors({ title, description, image })) {
        closeModal()
        setService(
          {
            _id: service?._id,
            title,
            description,
            showOnSite,
            image,
            menuName,
            index: service?.index ?? services?.length ?? 0,
            price,
          },
          clone
        )
      }
    }

    useEffect(() => {
      const isFormChanged =
        service?.title !== title ||
        service?.description !== description ||
        service?.showOnSite !== showOnSite ||
        service?.image !== image ||
        service?.menuName !== menuName ||
        service?.price !== price

      setOnConfirmFunc(onClickConfirm)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
    }, [title, description, showOnSite, image, menuName, price])

    return (
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
        <ErrorsList errors={errors} />
      </FormWrapper>
    )
  }

  return {
    title: `${serviceId && !clone ? 'Редактирование' : 'Создание'} услуги`,
    confirmButtonName: serviceId && !clone ? 'Применить' : 'Создать',
    Children: ServiceModal,
  }
}

export default serviceFunc
