import CheckBox from '@components/CheckBox'
import Input from '@components/Input'
import { postData, putData } from '@helpers/CRUD'
import useErrors from '@helpers/useErrors'
import React, { useEffect, useState } from 'react'
import EditableTextarea from '@components/EditableTextarea'
import { useRouter } from 'next/router'
import FormWrapper from '@components/FormWrapper'
import InputImage from '@components/InputImage'
import directionsSchema from '@schemas/directionsSchema'

const schemaToState = (item = {}, schema) => {
  if (!schema) return {}
  const state = {}
  for (var prop in schema) {
    if (schema[prop].formOptions) {
      state[prop] = item[prop] ? item[prop] : schema[prop].default
    }
  }
  return state
}

const universalFunc = (item, schema) => {
  const isEditing = !!item

  const UniversalModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
  }) => {
    const [state, setState] = useState(() =>
      schemaToState(item, directionsSchema)
    )
    // const [title, setTitle] = useState(isEditing ? direction.title : '')
    // const [description, setDescription] = useState(
    //   isEditing ? direction.description : ''
    // )
    // const [image, setImage] = useState(isEditing ? direction.image : '')
    // const [showOnSite, setShowOnSite] = useState(
    //   isEditing ? direction.showOnSite : true
    // )
    const [errors, addError, removeError, clearErrors] = useErrors()

    // const router = useRouter()

    // const refreshPage = () => {
    //   router.replace(router.asPath)
    // }

    // const onClickConfirm = async () => {
    //   let error = false
    //   if (!title) {
    //     addError({ title: 'Необходимо ввести название' })
    //     error = true
    //   }
    //   if (!description) {
    //     addError({ description: 'Необходимо ввести описание' })
    //     error = true
    //   }
    //   if (!error) {
    //     if (isEditing) {
    //       await putData(
    //         `/api/directions/${direction._id}`,
    //         {
    //           title,
    //           description,
    //           showOnSite,
    //           image,
    //         },
    //         refreshPage
    //       )
    //     } else {
    //       await postData(
    //         `/api/directions`,
    //         {
    //           title,
    //           description,
    //           showOnSite,
    //           image,
    //         },
    //         refreshPage
    //       )
    //     }
    //     closeModal()
    //   }
    // }

    // useEffect(() => {
    //   setOnConfirmFunc(onClickConfirm)
    // }, [title, description, showOnSite])

    return (
      <FormWrapper>
        {Object.keys(state).map((key, index) => {
          if (key === 'title') return
        })}
        {/* <InputImage
          label="Картинка"
          directory="directions"
          image={image}
          onChange={setImage}
        />
        <Input
          label="Название"
          type="text"
          value={title}
          onChange={(e) => {
            removeError('title')
            setTitle(e.target.value)
          }}
          // labelClassName="w-40"
          error={errors.title}
          forGrid
        />
        <EditableTextarea
          title="Описание"
          html={description}
          readonly={false}
          uncontrolled={false}
          onChange={(e) => {
            removeError('description')
            setDescription(e.target.value)
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
        /> */}
        {Object.values(errors).length > 0 && (
          <div className="flex flex-col text-red-500">
            {Object.values(errors).map((error) => (
              <div key={error}>{error}</div>
            ))}
          </div>
        )}
      </FormWrapper>
    )
  }

  return {
    title: `${isEditing ? 'Редактирование' : 'Создание'} отзыва`,
    confirmButtonName: isEditing ? 'Применить' : 'Создать',
    Children: UniversalModal,
  }
}

export default universalFunc
