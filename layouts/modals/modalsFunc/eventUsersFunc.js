import React, { useEffect, useState } from 'react'
import useErrors from '@helpers/useErrors'

import { useRecoilValue } from 'recoil'
import eventSelector from '@state/selectors/eventSelector'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'

import EditableTextarea from '@components/EditableTextarea'
import FormWrapper from '@components/FormWrapper'
import DateTimePicker from '@components/DateTimePicker'
import ErrorsList from '@components/ErrorsList'
import AddressPicker from '@components/AddressPicker'
import InputImages from '@components/InputImages'
import PriceInput from '@components/PriceInput'
import CheckBox from '@components/CheckBox'
import Input from '@components/Input'

import { DEFAULT_ADDRESS } from '@helpers/constants'
import { SelectDirection } from '@components/SelectItem'
import eventsUsersSelector from '@state/selectors/eventsUsersSelector'
import eventsUsersSelectorByEventId from '@state/selectors/eventsUsersByEventIdSelector'
import { SelectItemsList, SelectUserList } from '@components/SelectItemList'
// import usersSelectorByEventId from '@state/selectors/usersByEventIdSelector'
import eventsUsersFullByEventIdSelector from '@state/selectors/eventsUsersFullByEventIdSelector'

const eventUsersFunc = (eventId) => {
  const EventModal = ({ closeModal, setOnConfirmFunc, setOnDeclineFunc }) => {
    const event = useRecoilValue(eventSelector(eventId))
    const setEventUsersId = useRecoilValue(itemsFuncAtom).event.setEventUsers

    const eventUsers = useRecoilValue(eventsUsersFullByEventIdSelector(eventId))

    const eventAssistantsIds = eventUsers
      .filter((item) => item.status === 'assistant')
      .map((item) => item.user._id)
    const eventMansIds = eventUsers
      .filter(
        (item) =>
          item.user.gender == 'male' &&
          (!item.status || item.status === '' || item.status === 'participant')
      )
      .map((item) => item.user._id)
    const eventWomansIds = eventUsers
      .filter(
        (item) =>
          item.user.gender == 'famale' &&
          (!item.status || item.status === '' || item.status === 'participant')
      )
      .map((item) => item.user._id)
    const eventReservedParticipantsIds = eventUsers
      .filter((item) => item.status === 'reserve')
      .map((item) => item.user._id)
    const eventBannedParticipantsIds = eventUsers
      .filter((item) => item.status === 'ban')
      .map((item) => item.user._id)

    const [assistantsIds, setAssistantsIds] = useState(eventAssistantsIds)
    const [mansIds, setMansIds] = useState(eventMansIds)
    const [womansIds, setWomansIds] = useState(eventWomansIds)
    const [reservedParticipantsIds, setReservedParticipantsIds] = useState(
      eventReservedParticipantsIds
    )
    const [bannedParticipantsIds, setBannedParticipantsIds] = useState(
      eventBannedParticipantsIds
    )
    // const [directionId, setDirectionId] = useState(
    //   event ? event.directionId : null
    // )
    // const [title, setTitle] = useState(event ? event.title : '')
    // const [images, setImages] = useState(event?.images ? event.images : [])
    // const [description, setDescription] = useState(
    //   event ? event.description : ''
    // )
    // const [date, setDate] = useState(event ? event.date : Date.now())
    // const [address, setAddress] = useState(
    //   event?.address && typeof event.address === 'object'
    //     ? event.address
    //     : DEFAULT_ADDRESS
    // )
    // const [price, setPrice] = useState(event ? event.price : 0)
    // const [showOnSite, setShowOnSite] = useState(
    //   event ? event.showOnSite : true
    // )
    // const [errors, addError, removeError, clearErrors] = useErrors()

    const onClickConfirm = async () => {
      // let error = false
      // if (!title) {
      //   addError({ title: 'Необходимо ввести название' })
      //   error = true
      // }
      // if (!description) {
      //   addError({ description: 'Необходимо ввести описание' })
      //   error = true
      // }
      // if (!date) {
      //   addError({ date: 'Необходимо ввести дату' })
      //   error = true
      // }
      // if (!error) {
      closeModal()
      const filteredAssistantsIds = assistantsIds.filter((user) => user !== '?')
      const filteredParticipantsIds = [
        ...mansIds.filter((user) => user !== '?'),
        ...womansIds.filter((user) => user !== '?'),
      ]
      const filteredReservedParticipantsIds = reservedParticipantsIds.filter(
        (user) => user !== '?'
      )
      const filteredBannedParticipantsIds = bannedParticipantsIds.filter(
        (user) => user !== '?'
      )
      const usersStatuses = [
        ...filteredAssistantsIds.map((userId) => {
          return { userId, status: 'assistant' }
        }),
        ...filteredParticipantsIds.map((userId) => {
          return { userId, status: 'participant' }
        }),
        ...filteredReservedParticipantsIds.map((userId) => {
          return { userId, status: 'reserve' }
        }),
        ...filteredBannedParticipantsIds.map((userId) => {
          return { userId, status: 'ban' }
        }),
      ]
      setEventUsersId(eventId, usersStatuses)
    }

    useEffect(() => {
      setOnConfirmFunc(onClickConfirm)
    }, [
      mansIds,
      womansIds,
      assistantsIds,
      reservedParticipantsIds,
      bannedParticipantsIds,
    ])

    const removeIdsFromReserve = (usersIds) => {
      const tempReservedParticipantsIds = []
      for (let i = 0; i < reservedParticipantsIds.length; i++) {
        if (!usersIds.includes(reservedParticipantsIds[i]))
          tempReservedParticipantsIds.push(reservedParticipantsIds[i])
      }
      setReservedParticipantsIds(tempReservedParticipantsIds)
    }
    const removeIdsFromAllByBan = (bannedUsersIds) => {
      var tempIds = []
      for (let i = 0; i < mansIds.length; i++) {
        if (!bannedUsersIds.includes(mansIds[i])) tempIds.push(mansIds[i])
      }
      setMansIds(tempIds)
      tempIds = []
      for (let i = 0; i < womansIds.length; i++) {
        if (!bannedUsersIds.includes(womansIds[i])) tempIds.push(womansIds[i])
      }
      setWomansIds(tempIds)
      tempIds = []
      for (let i = 0; i < assistantsIds.length; i++) {
        if (!bannedUsersIds.includes(assistantsIds[i]))
          tempIds.push(assistantsIds[i])
      }
      setAssistantsIds(tempIds)
      tempIds = []
      for (let i = 0; i < reservedParticipantsIds.length; i++) {
        if (!bannedUsersIds.includes(reservedParticipantsIds[i]))
          tempIds.push(reservedParticipantsIds[i])
      }
      setReservedParticipantsIds(tempIds)
    }

    return (
      <div>
        <SelectUserList
          title="Ведущие"
          usersId={assistantsIds}
          onChange={(usersIds) => {
            removeIdsFromReserve(usersIds)
            setAssistantsIds(usersIds)
          }}
          exceptedIds={[
            ...assistantsIds,
            ...mansIds,
            ...womansIds,
            ...bannedParticipantsIds,
          ]}
        />
        <SelectUserList
          title="Участники Мужчины"
          filter={{ gender: 'male' }}
          usersId={mansIds}
          onChange={(usersIds) => {
            removeIdsFromReserve(usersIds)
            setMansIds(usersIds)
          }}
          maxUsers={event.maxMans}
          canAddItem={
            (!event.maxUsers ||
              mansIds.length + womansIds.length < event.maxUsers) &&
            (event.maxMans === null || event.maxMans > mansIds.length)
          }
          exceptedIds={[...assistantsIds, ...bannedParticipantsIds]}
        />
        <SelectUserList
          title="Участники Женщины"
          filter={{ gender: 'famale' }}
          usersId={womansIds}
          onChange={(usersIds) => {
            removeIdsFromReserve(usersIds)
            setWomansIds(usersIds)
          }}
          maxUsers={event.maxWomans}
          canAddItem={
            (!event.maxUsers ||
              mansIds.length + womansIds.length < event.maxUsers) &&
            (event.maxWomans === null || event.maxWomans > womansIds.length)
          }
          exceptedIds={[...assistantsIds, ...bannedParticipantsIds]}
        />
        <div className="flex justify-end gap-x-1">
          <span>Всего:</span>
          <span className="font-bold">
            {mansIds.length + womansIds.length + assistantsIds.length}
          </span>
          {event.maxUsers ? (
            <>
              <span>/</span>
              <span>{event.maxUsers}</span>
            </>
          ) : null}
          <span>чел.</span>
        </div>
        <SelectUserList
          title="Резерв"
          usersId={reservedParticipantsIds}
          onChange={setReservedParticipantsIds}
          exceptedIds={[
            ...assistantsIds,
            ...mansIds,
            ...womansIds,
            ...reservedParticipantsIds,
            ...bannedParticipantsIds,
          ]}
        />
        <SelectUserList
          title="Блокированные"
          usersId={bannedParticipantsIds}
          onChange={(usersIds) => {
            removeIdsFromAllByBan(usersIds)
            setBannedParticipantsIds(usersIds)
          }}
          // onDelete={(user, onConfirm) => {
          //   console.log('1', 1)
          // }}
          exceptedIds={bannedParticipantsIds}
        />

        {/* <InputImages
          label="Фотографии"
          directory="events"
          images={images}
          onChange={setImages}
        />
        <SelectDirection
          selectedId={directionId}
          onChange={(direction) => setDirectionId(direction._id)}
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
        <PriceInput
          value={price}
          onChange={(value) => {
            removeError('price')
            setPrice(value)
          }}
        />
        <CheckBox
          checked={showOnSite}
          labelPos="left"
          // labelClassName="w-40"
          onClick={() => setShowOnSite((checked) => !checked)}
          label="Показывать на сайте"
        /> */}
        {/* <ErrorsList errors={errors} /> */}
      </div>
    )
  }

  return {
    title: `Участники мероприятия`,
    confirmButtonName: 'Применить',
    Children: EventModal,
  }
}

export default eventUsersFunc
