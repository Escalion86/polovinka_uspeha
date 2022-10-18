import React, { useEffect, useState } from 'react'

import { useRecoilValue } from 'recoil'
import eventSelector from '@state/selectors/eventSelector'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'

import { SelectUserList } from '@components/SelectItemList'
import eventAssistantsSelector from '@state/selectors/eventAssistantsSelector'
import eventMansSelector from '@state/selectors/eventMansSelector'
import eventWomansSelector from '@state/selectors/eventWomansSelector'
import eventUsersInReserveSelector from '@state/selectors/eventUsersInReserveSelector'
import eventUsersInBanSelector from '@state/selectors/eventUsersInBanSelector'

import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import TabContext from '@components/Tabs/TabContext'
import TabPanel from '@components/Tabs/TabPanel'
import { DEFAULT_EVENT } from '@helpers/constants'
import usersAtom from '@state/atoms/usersAtom'
import compareArrays from '@helpers/compareArrays'

const sortFunction = (a, b) => (a.firstName < b.firstName ? -1 : 1)

const eventUsersFunc = (eventId) => {
  const EventModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setOnlyCloseButtonShow,
  }) => {
    const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)
    const event = useRecoilValue(eventSelector(eventId))
    const setEventUsersId = useRecoilValue(itemsFuncAtom).event.setEventUsers
    const users = useRecoilValue(usersAtom)

    const sortUsersIds = (ids) =>
      [...users]
        .filter((user) => ids.includes(user._id))
        .sort(sortFunction)
        .map((user) => user._id)

    const eventAssistants = useRecoilValue(eventAssistantsSelector(eventId))
    const sortedEventAssistantsIds = [...eventAssistants]
      .sort(sortFunction)
      .map((user) => user._id)

    const eventMans = useRecoilValue(eventMansSelector(eventId))
    const sortedEventMansIds = [...eventMans]
      .sort(sortFunction)
      .map((user) => user._id)

    const eventWomans = useRecoilValue(eventWomansSelector(eventId))
    const sortedEventWomansIds = [...eventWomans]
      .sort(sortFunction)
      .map((user) => user._id)

    const eventReservedParticipants = useRecoilValue(
      eventUsersInReserveSelector(eventId)
    )
    const sortedEventReservedParticipantsIds = [...eventReservedParticipants]
      .sort(sortFunction)
      .map((user) => user._id)

    const eventBannedParticipants = useRecoilValue(
      eventUsersInBanSelector(eventId)
    )
    const sortedEventBannedParticipantsIds = [...eventBannedParticipants]
      .sort(sortFunction)
      .map((user) => user._id)

    const [assistantsIds, setAssistantsIds] = useState(sortedEventAssistantsIds)
    const [mansIds, setMansIds] = useState(sortedEventMansIds)
    const [womansIds, setWomansIds] = useState(sortedEventWomansIds)
    const [reservedParticipantsIds, setReservedParticipantsIds] = useState(
      sortedEventReservedParticipantsIds
    )
    const [bannedParticipantsIds, setBannedParticipantsIds] = useState(
      sortedEventBannedParticipantsIds
    )

    const onClickConfirm = async () => {
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
      const isFormChanged =
        !compareArrays(assistantsIds, sortedEventAssistantsIds) ||
        !compareArrays(mansIds, sortedEventMansIds) ||
        !compareArrays(womansIds, sortedEventWomansIds) ||
        !compareArrays(
          reservedParticipantsIds,
          sortedEventReservedParticipantsIds
        ) ||
        !compareArrays(bannedParticipantsIds, sortedEventBannedParticipantsIds)

      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
      setOnConfirmFunc(onClickConfirm)
      if (!isLoggedUserAdmin) setOnlyCloseButtonShow(true)
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
    const removeIdsFromParticipants = (usersIds) => {
      const tempMansIds = []
      for (let i = 0; i < mansIds.length; i++) {
        if (!usersIds.includes(mansIds[i])) tempMansIds.push(mansIds[i])
      }

      const tempWomansIds = []
      for (let i = 0; i < womansIds.length; i++) {
        if (!usersIds.includes(womansIds[i])) tempWomansIds.push(womansIds[i])
      }
      setMansIds(tempMansIds)
      setWomansIds(tempWomansIds)
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
      <TabContext value="Участники">
        <TabPanel
          tabName="Участники"
          tabAddToLabel={`(${mansIds.length + womansIds.length})`}
        >
          <SelectUserList
            label="Участники Мужчины"
            modalTitle="Выбор участников (мужчин)"
            filter={{ gender: { operand: '===', value: 'male' } }}
            usersId={mansIds}
            onChange={(usersIds) => {
              removeIdsFromReserve(usersIds)
              setMansIds(sortUsersIds(usersIds))
            }}
            maxUsers={event.maxMans}
            canAddItem={
              (!event.maxUsers ||
                mansIds.length + womansIds.length < event.maxUsers) &&
              (event.maxMans === null || event.maxMans > mansIds.length)
            }
            exceptedIds={[...assistantsIds, ...bannedParticipantsIds]}
            readOnly={!isLoggedUserAdmin}
          />
          <SelectUserList
            label="Участники Женщины"
            modalTitle="Выбор участниц (женщин)"
            filter={{ gender: { operand: '===', value: 'famale' } }}
            usersId={womansIds}
            onChange={(usersIds) => {
              removeIdsFromReserve(usersIds)
              setWomansIds(sortUsersIds(usersIds))
            }}
            maxUsers={event.maxWomans}
            canAddItem={
              (!event.maxUsers ||
                mansIds.length + womansIds.length < event.maxUsers) &&
              (event.maxWomans === null || event.maxWomans > womansIds.length)
            }
            exceptedIds={[...assistantsIds, ...bannedParticipantsIds]}
            readOnly={!isLoggedUserAdmin}
          />
          <div className="flex justify-end gap-x-1">
            <span>Всего участников:</span>
            <span className="font-bold">
              {mansIds.length + womansIds.length}
            </span>
            {event.maxUsers ? (
              <>
                <span>/</span>
                <span>{event.maxUsers}</span>
              </>
            ) : null}
            <span>чел.</span>
          </div>
        </TabPanel>
        {(event.isReserveActive ?? DEFAULT_EVENT.isReserveActive) && (
          <TabPanel
            tabName="Резерв"
            tabAddToLabel={`(${reservedParticipantsIds.length})`}
          >
            <SelectUserList
              label="Резерв"
              modalTitle="Выбор пользователей в резерв"
              usersId={reservedParticipantsIds}
              onChange={(usersIds) =>
                setReservedParticipantsIds(sortUsersIds(usersIds))
              }
              exceptedIds={[
                ...assistantsIds,
                // ...mansIds,
                // ...womansIds,
                // ...reservedParticipantsIds,
                ...bannedParticipantsIds,
              ]}
              readOnly={!isLoggedUserAdmin}
            />
          </TabPanel>
        )}
        <TabPanel tabName="Ведущие" tabAddToLabel={`(${assistantsIds.length})`}>
          <SelectUserList
            label="Ведущие"
            modalTitle="Выбор ведущих"
            usersId={assistantsIds}
            onChange={(usersIds) => {
              removeIdsFromReserve(usersIds)
              removeIdsFromParticipants(usersIds)
              setAssistantsIds(sortUsersIds(usersIds))
            }}
            exceptedIds={[
              // ...assistantsIds,
              // ...mansIds,
              // ...womansIds,
              ...bannedParticipantsIds,
            ]}
            readOnly={!isLoggedUserAdmin}
          />
        </TabPanel>
        {isLoggedUserAdmin && (
          <TabPanel
            tabName="Бан"
            tabAddToLabel={`(${bannedParticipantsIds.length})`}
          >
            <SelectUserList
              label="Блокированные"
              modalTitle="Выбор блокированных пользователей"
              usersId={bannedParticipantsIds}
              onChange={(usersIds) => {
                removeIdsFromAllByBan(usersIds)
                setBannedParticipantsIds(sortUsersIds(usersIds))
              }}
              // onDelete={(user, onConfirm) => {
              //   console.log('1', 1)
              // }}
              exceptedIds={bannedParticipantsIds}
              readOnly={!isLoggedUserAdmin}
            />
          </TabPanel>
        )}
        {/* <ErrorsList errors={errors} /> */}
        {/* </TabsBody>
      </Tabs> */}
      </TabContext>
    )
  }

  return {
    title: `Участники мероприятия`,
    confirmButtonName: 'Применить',
    Children: EventModal,
  }
}

export default eventUsersFunc
