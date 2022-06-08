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
    console.log('1')
    const additionalBlock = useRecoilValue(
      additionalBlockSelector(additionalBlockId)
    )
    console.log('2')
    const setAdditionalBlock = useRecoilValue(itemsFuncAtom).additionalBlock.set
    console.log('3')
    const [title, setTitle] = useState(
      additionalBlock ? additionalBlock.title : ''
    )
    console.log('4')
    const [description, setDescription] = useState(
      additionalBlock ? additionalBlock.description : ''
    )
    console.log('5')
    const [image, setImage] = useState(
      additionalBlock ? additionalBlock.image : ''
    )
    console.log('6')
    const [menuName, setMenuName] = useState(
      additionalBlock ? additionalBlock.menuName : ''
    )
    console.log('7')
    const [showOnSite, setShowOnSite] = useState(
      additionalBlock ? additionalBlock.showOnSite : true
    )
    console.log('8')
    const [errors, addError, removeError, clearErrors] = useErrors()
    console.log('9')
    // const router = useRouter()

    // const refreshPage = () => {
    //   router.replace(router.asPath)
    // }

    const checkErrors = () => {
      console.log('checkErrors')
      return (
        (!title && addError({ title: 'Необходимо ввести название' })) ||
        (!description &&
          addError({ description: 'Необходимо ввести описание' }))
      )
    }
    console.log('10')
    const onClickConfirm = async () => {
      console.log('15')
      if (checkErrors()) {
        console.log('16')
        closeModal()
        console.log('17')
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
        console.log('18')
      }
    }
    console.log('11')
    useEffect(() => {
      console.log('13')
      setOnConfirmFunc(onClickConfirm)
      console.log('14')
    }, [title, description, showOnSite, image, menuName])
    console.log('12')
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
        {/* <Input
          label="Описание"
          value={description}
          onChange={(e) => {
            removeError('description')
            setDescription(e.target.value)
          }}
          labelClassName="w-40"
          error={errors.description}
        /> */}
        {/* <EditableTextarea
          label="Описание"
          html={description}
          uncontrolled={false}
          onChange={(value) => {
            removeError('description')
            setDescription(value)
          }}
          forGrid
        /> */}
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
