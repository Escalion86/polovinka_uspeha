import React, { useEffect, useState } from 'react'
import useErrors from '@helpers/useErrors'
import { useRecoilValue } from 'recoil'
import directionSelector from '@state/selectors/directionSelector'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'

import CheckBox from '@components/CheckBox'
import Input from '@components/Input'
import EditableTextarea from '@components/EditableTextarea'
import FormWrapper from '@components/FormWrapper'
import InputImage from '@components/InputImage'
import ErrorsList from '@components/ErrorsList'
import { DEFAULT_DIRECTION } from '@helpers/constants'

const directionFunc = (directionId, clone = false) => {
  const DirectionModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const direction = useRecoilValue(directionSelector(directionId))
    const setDirection = useRecoilValue(itemsFuncAtom).direction.set

    const [title, setTitle] = useState(
      direction?.title ?? DEFAULT_DIRECTION.title
    )
    const [description, setDescription] = useState(
      direction?.description ?? DEFAULT_DIRECTION.description
    )
    const [image, setImage] = useState(
      direction?.image ?? DEFAULT_DIRECTION.image
    )
    const [showOnSite, setShowOnSite] = useState(
      direction?.showOnSite ?? DEFAULT_DIRECTION.showOnSite
    )
    const [errors, checkErrors, addError, removeError, clearErrors] =
      useErrors()

    // const router = useRouter()

    // const refreshPage = () => {
    //   router.replace(router.asPath)
    // }

    const onClickConfirm = async () => {
      if (!checkErrors({ title, description })) {
        closeModal()
        setDirection(
          {
            _id: direction?._id,
            title,
            description,
            showOnSite,
            image,
          },
          clone
        )
        // if (direction && !clone) {
        //   await putData(
        //     `/api/directions/${direction._id}`,
        //     {
        //       title,
        //       description,
        //       showOnSite,
        //       image,
        //     },
        //     refreshPage
        //   )
        // } else {
        //   await postData(
        //     `/api/directions`,
        //     {
        //       title,
        //       description,
        //       showOnSite,
        //       image,
        //     },
        //     refreshPage
        //   )
        // }
      }
    }

    useEffect(() => {
      const isFormChanged =
        direction?.title !== title ||
        direction?.description !== description ||
        direction?.showOnSite !== showOnSite ||
        direction?.image !== image

      setOnConfirmFunc(onClickConfirm)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
    }, [title, description, showOnSite, image])

    return (
      <FormWrapper>
        <InputImage
          label="Картинка"
          directory="directions"
          image={image}
          onChange={setImage}
          aspect={1}
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
          error={errors.description}
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
    title: `${
      directionId && !clone ? 'Редактирование' : 'Создание'
    } направления`,
    confirmButtonName: directionId && !clone ? 'Применить' : 'Создать',
    Children: DirectionModal,
  }
}

export default directionFunc
