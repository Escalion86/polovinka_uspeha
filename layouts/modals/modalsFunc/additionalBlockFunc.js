import CheckBox from '@components/CheckBox'
import Input from '@components/Input'
import { postData, putData } from '@helpers/CRUD'
import useErrors from '@helpers/useErrors'
import React, { useEffect, useState } from 'react'
import EditableTextarea from '@components/EditableTextarea'
import { useRouter } from 'next/router'
import FormWrapper from '@components/FormWrapper'
import InputImage from '@components/InputImage'
import ErrorsList from '@components/ErrorsList'
import additionalBlockSelector from '@state/selectors/additionalBlockSelector'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import { useRecoilValue } from 'recoil'

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

    // const router = useRouter()

    // const refreshPage = () => {
    //   router.replace(router.asPath)
    // }

    const onClickConfirm = async () => {
      let error = false
      if (!title) {
        addError({ title: 'Необходимо ввести название' })
        error = true
      }
      if (!description) {
        addError({ description: 'Необходимо ввести описание' })
        error = true
      }
      if (!error) {
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
        // if (additionalBlock && !clone) {
        //   await putData(
        //     `/api/additionalBlocks/${additionalBlock._id}`,
        //     {
        //       title,
        //       description,
        //       showOnSite,
        //       image,
        //       menuName,
        //     },
        //     refreshPage
        //   )
        // } else {
        //   await postData(
        //     `/api/additionalBlocks`,
        //     {
        //       title,
        //       description,
        //       showOnSite,
        //       image,
        //       menuName,
        //     },
        //     refreshPage
        //   )
        // }
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
