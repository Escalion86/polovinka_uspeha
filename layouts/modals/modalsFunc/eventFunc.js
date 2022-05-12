import CheckBox from '@components/CheckBox'
import Input from '@components/Input'
import { postData, putData } from '@helpers/CRUD'
import useErrors from '@helpers/useErrors'
import React, { useEffect, useState } from 'react'
import EditableTextarea from '@components/EditableTextarea'
import { useRouter } from 'next/router'
import FormWrapper from '@components/FormWrapper'
import InputImage from '@components/InputImage'
import DatePicker from '@components/DatePicker'
import DateTimePicker from '@components/DateTimePicker'
import ErrorsList from '@components/ErrorsList'
import AddressPicker from '@components/AddressPicker'
import { useRecoilState, useSetRecoilState } from 'recoil'
import loadingEventsAtom from '@state/atoms/loadingEventsAtom'

const eventFunc = (event, clone = false) => {
  const EventModal = ({ closeModal, setOnConfirmFunc, setOnDeclineFunc }) => {
    const [loading, setLoading] = useRecoilState(loadingEventsAtom(event._id))

    useEffect(() => {
      if (loading) setLoading(false)
    }, [loading])

    const [title, setTitle] = useState(event ? event.title : '')
    const [description, setDescription] = useState(
      event ? event.description : ''
    )
    const [image, setImage] = useState(event ? event.image : '')
    const [date, setDate] = useState(event ? event.date : Date.now())
    const [address, setAddress] = useState(
      event?.address && typeof event.address === 'object'
        ? event.address
        : {
            town: '',
            street: '',
            house: '',
            entrance: '',
            floor: '',
            flat: '',
            comment: '',
          }
    )
    const [showOnSite, setShowOnSite] = useState(
      event ? event.showOnSite : true
    )
    const [errors, addError, removeError, clearErrors] = useErrors()

    const router = useRouter()

    const refreshPage = () => {
      // router.replace(router.asPath, '', { shallow: true })
      router.replace(router.asPath)
      // router.reload()
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
      if (!date) {
        addError({ date: 'Необходимо ввести дату' })
        error = true
      }
      if (!error) {
        // Устанавливаем атом загрузки
        setLoading(true)
        if (event && !clone) {
          await putData(
            `/api/events/${event._id}`,
            {
              image,
              title,
              description,
              showOnSite,
              date,
              address,
            },
            () => {
              // setLoading(false)
              refreshPage()
            }
          )
        } else {
          await postData(
            `/api/events`,
            {
              title,
              description,
              showOnSite,
              date,
              image,
              address,
            },
            () => {
              // setLoading(false)
              refreshPage()
            }
          )
        }
        closeModal()
      }
    }

    useEffect(() => {
      setOnConfirmFunc(onClickConfirm)
    }, [title, description, showOnSite, date, image, address])

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
          placeholder="Описание мероприятия..."
        />
        <DateTimePicker value={date} onChange={setDate} label="Дата и время" />
        {/* <DatePicker
          label="Дата"
          value={birthday}
          onChange={setBirthday}
        /> */}
        <AddressPicker address={address} onChange={setAddress} />
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
    title: `${event && !clone ? 'Редактирование' : 'Создание'} мероприятия`,
    confirmButtonName: event && !clone ? 'Применить' : 'Создать',
    Children: EventModal,
  }
}

export default eventFunc
