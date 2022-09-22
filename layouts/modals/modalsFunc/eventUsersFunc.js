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

    const eventAssistantsIds = useRecoilValue(
      eventAssistantsSelector(eventId)
    ).map((user) => user._id)
    const eventMansIds = useRecoilValue(eventMansSelector(eventId)).map(
      (user) => user._id
    )
    const eventWomansIds = useRecoilValue(eventWomansSelector(eventId)).map(
      (user) => user._id
    )
    const eventReservedParticipantsIds = useRecoilValue(
      eventUsersInReserveSelector(eventId)
    ).map((user) => user._id)
    const eventBannedParticipantsIds = useRecoilValue(
      eventUsersInBanSelector(eventId)
    ).map((user) => user._id)

    const [assistantsIds, setAssistantsIds] = useState(eventAssistantsIds)
    const [mansIds, setMansIds] = useState(eventMansIds)
    const [womansIds, setWomansIds] = useState(eventWomansIds)
    const [reservedParticipantsIds, setReservedParticipantsIds] = useState(
      eventReservedParticipantsIds
    )
    const [bannedParticipantsIds, setBannedParticipantsIds] = useState(
      eventBannedParticipantsIds
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
        assistantsIds !== eventAssistantsIds ||
        mansIds !== eventMansIds ||
        womansIds !== eventWomansIds ||
        reservedParticipantsIds !== eventReservedParticipantsIds ||
        bannedParticipantsIds !== eventBannedParticipantsIds

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
            filter={{ gender: { operand: '===', value: 'male' } }}
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
            readOnly={!isLoggedUserAdmin}
          />
          <SelectUserList
            label="Участники Женщины"
            filter={{ gender: { operand: '===', value: 'famale' } }}
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
            readOnly={!isLoggedUserAdmin}
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
        </TabPanel>
        {(event.isReserveActive ?? DEFAULT_EVENT.isReserveActive) && (
          <TabPanel
            tabName="Резерв"
            tabAddToLabel={`(${reservedParticipantsIds.length})`}
          >
            <SelectUserList
              label="Резерв"
              usersId={reservedParticipantsIds}
              onChange={setReservedParticipantsIds}
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
            usersId={assistantsIds}
            onChange={(usersIds) => {
              removeIdsFromReserve(usersIds)
              setAssistantsIds(usersIds)
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
              usersId={bannedParticipantsIds}
              onChange={(usersIds) => {
                removeIdsFromAllByBan(usersIds)
                setBannedParticipantsIds(usersIds)
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
