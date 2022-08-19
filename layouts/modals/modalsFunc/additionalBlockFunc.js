import React, { useEffect, useState } from 'react'
import useErrors from '@helpers/useErrors'

import { useRecoilValue } from 'recoil'
import additionalBlockSelector from '@state/selectors/additionalBlockSelector'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'

import CheckBox from '@components/CheckBox'
import Input from '@components/Input'
import EditableTextarea from '@components/EditableTextarea'
import FormWrapper from '@components/FormWrapper'
import InputImage from '@components/InputImage'
import ErrorsList from '@components/ErrorsList'

const additionalBlockFunc = (additionalBlockId, clone = false) => {
  const AdditionalBlockModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
  }) => {
    const additionalBlock = useRecoilValue(
      additionalBlockSelector(additionalBlockId)
    )
    const setAdditionalBlock = useRecoilValue(itemsFuncAtom).additionalBlock.set

    const [title, setTitle] = useState(
      additionalBlock ? additionalBlock.title : ''
    )
    const [description, setDescription] = useState(
      additionalBlock ? additionalBlock.description : ''
    )
    const [image, setImage] = useState(
      additionalBlock ? additionalBlock.image : ''
    )
    const [menuName, setMenuName] = useState(
      additionalBlock ? additionalBlock.menuName : ''
    )
    const [showOnSite, setShowOnSite] = useState(
      additionalBlock ? additionalBlock.showOnSite : true
    )
    const [errors, addError, removeError, clearErrors] = useErrors()

    const checkErrors = () => {
      clearErrors()
      return (
        (!title && addError({ title: 'Необходимо ввести название' })) ||
        (!description &&
          addError({ description: 'Необходимо ввести описание' }))
      )
    }

    const onClickConfirm = async () => {
      if (checkErrors()) {
        closeModal()
        setAdditionalBlock(
          {
            _id: additionalBlock?._id,
            title,
            description,
            showOnSite,
            image,
            menuName,
          },
          clone
        )
      }
    }
    useEffect(() => {
      setOnConfirmFunc(onClickConfirm)
    }, [title, description, showOnSite, image, menuName])
    return (
      <FormWrapper>
        <InputImage
          label="Картинка"
          directory="additionalBlocks"
          image={image}
          onChange={setImage}
        />
        <Input
          label="Название"
          type="text"
          value={title}
          onChange={(value) => {
            removeError('title')
            setTitle(value)
          }}
          // labelClassName="w-40"
          error={errors.title}
          forGrid
        />
        <EditableTextarea
          label="Описание"
          html={description}
          uncontrolled={false}
          onChange={(value) => {
            removeError('description')
            setDescription(value)
          }}
          forGrid
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
          forGrid
        />
        <CheckBox
          checked={showOnSite}
          labelPos="left"
          // labelClassName="w-40"
          forGrid
          onClick={() => setShowOnSite((checked) => !checked)}
          label="Показывать на сайте"
        />
        <ErrorsList errors={errors} />
      </FormWrapper>
    )
  }

  return {
    title: `${
      additionalBlockId && !clone ? 'Редактирование' : 'Создание'
    } блока`,
    confirmButtonName: additionalBlockId && !clone ? 'Применить' : 'Создать',
    Children: AdditionalBlockModal,
  }
}

export default additionalBlockFunc
