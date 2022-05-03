import CheckBox from '@components/CheckBox'
import Input from '@components/Input'
import { postData, putData } from '@helpers/CRUD'
import useErrors from '@helpers/useErrors'
import React, { useEffect, useState } from 'react'
import EditableTextarea from '@components/EditableTextarea'
import { useRouter } from 'next/router'
import FormWrapper from '@components/FormWrapper'
import InputImage from '@components/InputImage'

const eventFunc = (event, clone = false) => {
  const EventModal = ({ closeModal, setOnConfirmFunc, setOnDeclineFunc }) => {
    const [title, setTitle] = useState(event ? event.title : '')
    const [description, setDescription] = useState(
      event ? event.description : ''
    )
    const [image, setImage] = useState(event ? event.image : '')
    const [date, setDate] = useState(event ? event.date : Date.now())
    const [showOnSite, setShowOnSite] = useState(
      event ? event.showOnSite : true
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
        if (event && !clone) {
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
    }, [title, description, showOnSite])

    return (
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
          placeholder="Описание мероприятия..."
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
    title: `${event && !clone ? 'Редактирование' : 'Создание'} мероприятия`,
    confirmButtonName: event && !clone ? 'Применить' : 'Создать',
    Children: EventModal,
  }
}

export default eventFunc
