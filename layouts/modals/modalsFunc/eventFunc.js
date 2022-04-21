import CheckBox from '@components/CheckBox'
import Input from '@components/Input'
import { postData, putData } from '@helpers/CRUD'
import useErrors from '@helpers/useErrors'
import React, { useEffect, useState } from 'react'
import EditableTextarea from '@components/EditableTextarea'
import { useRouter } from 'next/router'
import FormWrapper from '@components/FormWrapper'

const eventFunc = (event, refreshPage) => {
  const isEditing = !!event

  const EventModal = ({ closeModal, setOnConfirmFunc, setOnDeclineFunc }) => {
    const [title, setTitle] = useState(isEditing ? event.title : '')
    const [description, setDescription] = useState(
      isEditing ? event.description : ''
    )
    const [date, setDate] = useState(isEditing ? event.date : Date.now())
    const [showOnSite, setShowOnSite] = useState(
      isEditing ? event.showOnSite : true
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
        if (isEditing) {
          await putData(
            `/api/events/${event._id}`,
            {
              title,
              description,
              showOnSite,
            },
            refreshPage
          )
        } else {
          await postData(
            `/api/events`,
            {
              title,
              description,
              showOnSite,
            },
            refreshPage
          )
        }
        closeModal()
      }
    }

    useEffect(() => {
      setOnConfirmFunc(onClickConfirm)
    }, [title, description])

    return (
      <FormWrapper>
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
        />
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
    Children: EventModal,
  }
}

export default eventFunc
