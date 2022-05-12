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
import Modal from './Modal'

const directionFunc = (direction, clone = false) => {
  const DirectionModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
  }) => {
    const [title, setTitle] = useState(direction ? direction.title : '')
    const [description, setDescription] = useState(
      direction ? direction.description : ''
    )
    const [image, setImage] = useState(direction ? direction.image : '')
    const [showOnSite, setShowOnSite] = useState(
      direction ? direction.showOnSite : true
    )
    const [errors, addError, removeError, clearErrors] = useErrors()

    const router = useRouter()

    const refreshPage = () => {
      router.replace(router.asPath)
    }

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
        if (direction && !clone) {
          await putData(
            `/api/directions/${direction._id}`,
            {
              title,
              description,
              showOnSite,
              image,
            },
            refreshPage
          )
        } else {
          await postData(
            `/api/directions`,
            {
              title,
              description,
              showOnSite,
              image,
            },
            refreshPage
          )
        }
        closeModal()
      }
    }

    useEffect(() => {
      setOnConfirmFunc(onClickConfirm)
    }, [title, description, showOnSite, image])

    return (
      <Modal>
        <FormWrapper>
          <InputImage
            label="Картинка"
            directory="directions"
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
      </Modal>
    )
  }

  return {
    title: `${direction && !clone ? 'Редактирование' : 'Создание'} направления`,
    confirmButtonName: direction && !clone ? 'Применить' : 'Создать',
    Children: DirectionModal,
  }
}

export default directionFunc
