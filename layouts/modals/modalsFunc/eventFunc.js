import CheckBox from '@components/CheckBox'
import Input from '@components/Input'
import useErrors from '@helpers/useErrors'
import React, { useEffect, useState } from 'react'
import EditableTextarea from '@components/EditableTextarea'
import FormWrapper from '@components/FormWrapper'
import DateTimePicker from '@components/DateTimePicker'
import ErrorsList from '@components/ErrorsList'
import AddressPicker from '@components/AddressPicker'
import { useRecoilValue } from 'recoil'
import { DEFAULT_ADDRESS } from '@helpers/constants'
import eventSelector from '@state/selectors/eventSelector'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import InputImages from '@components/InputImages'

const eventFunc = (eventId, clone = false) => {
  const EventModal = ({ closeModal, setOnConfirmFunc, setOnDeclineFunc }) => {
    const event = useRecoilValue(eventSelector(eventId))
    const setEvent = useRecoilValue(itemsFuncAtom).event.set

    const [title, setTitle] = useState(event ? event.title : '')
    const [images, setImages] = useState(event?.images ? event.images : [])
    const [description, setDescription] = useState(
      event ? event.description : ''
    )
    const [date, setDate] = useState(event ? event.date : Date.now())
    const [address, setAddress] = useState(
      event?.address && typeof event.address === 'object'
        ? event.address
        : DEFAULT_ADDRESS
    )
    const [showOnSite, setShowOnSite] = useState(
      event ? event.showOnSite : true
    )
    const [errors, addError, removeError, clearErrors] = useErrors()

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
        closeModal()
        setEvent(
          {
            _id: event?._id,
            images,
            title,
            description,
            showOnSite,
            date,
            address,
          },
          clone
        )
      }
    }

    useEffect(() => {
      setOnConfirmFunc(onClickConfirm)
    }, [title, description, showOnSite, date, images, address])

    return (
      <FormWrapper>
        <InputImages
          label="Фотографии"
          directory="events"
          images={images}
          onChange={setImages}
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
    title: `${eventId && !clone ? 'Редактирование' : 'Создание'} мероприятия`,
    confirmButtonName: eventId && !clone ? 'Применить' : 'Создать',
    Children: EventModal,
  }
}

export default eventFunc
