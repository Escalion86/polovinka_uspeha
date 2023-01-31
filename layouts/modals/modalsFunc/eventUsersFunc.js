import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
} from '@fortawesome/free-regular-svg-icons'
import isEventClosedFunc from '@helpers/isEventClosed'
import { P } from '@components/tags'
import { faLock, faPlay } from '@fortawesome/free-solid-svg-icons'
import isEventCanBeClosedSelector from '@state/selectors/isEventCanBeClosedSelector'

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
    setBottomLeftButtonProps,
  }) => {
    const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)
    const event = useRecoilValue(eventSelector(eventId))
    const setEventUsersId = useRecoilValue(itemsFuncAtom).event.setEventUsers
    const users = useRecoilValue(usersAtom)
    const isEventClosed = isEventClosedFunc(event)
    const setEvent = useRecoilValue(itemsFuncAtom).event.set
    const isEventCanBeClosed = useRecoilValue(
      isEventCanBeClosedSelector(eventId)
    )
    // const paymentsOfEvent = useRecoilValue(paymentsByEventIdSelector(eventId))

    const sortUsersIds = useCallback(
      (ids) =>
        [...users]
          .filter((user) => ids.includes(user._id))
          .sort(sortFunction)
          .map((user) => user._id),
      [users]
    )

    const eventAssistants = useRecoilValue(eventAssistantsSelector(eventId))
    const sortedEventAssistantsIds = useMemo(
      () => [...eventAssistants].sort(sortFunction).map((user) => user._id),
      [eventAssistants]
    )

    const eventMans = useRecoilValue(eventMansSelector(eventId))
    const sortedEventMansIds = useMemo(
      () => [...eventMans].sort(sortFunction).map((user) => user._id),
      [eventMans]
    )

    const eventWomans = useRecoilValue(eventWomansSelector(eventId))
    const sortedEventWomansIds = useMemo(
      () => [...eventWomans].sort(sortFunction).map((user) => user._id),
      [eventWomans]
    )

    const eventReservedParticipants = useRecoilValue(
      eventUsersInReserveSelector(eventId)
    )
    const sortedEventReservedParticipantsIds = useMemo(
      () => [...eventReservedParticipants].map((user) => user._id),
      [eventReservedParticipants]
    )

    const eventBannedParticipants = useRecoilValue(
      eventUsersInBanSelector(eventId)
    )
    const sortedEventBannedParticipantsIds = useMemo(
      () =>
        [...eventBannedParticipants].sort(sortFunction).map((user) => user._id),
      [eventBannedParticipants]
    )

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

    const isAssistantsChanged = useMemo(
      () => !compareArrays(assistantsIds, sortedEventAssistantsIds),
      [assistantsIds]
    )
    const isMansChanged = useMemo(
      () => !compareArrays(mansIds, sortedEventMansIds),
      [mansIds]
    )
    const isWomansChanged = useMemo(
      () => !compareArrays(womansIds, sortedEventWomansIds),
      [womansIds]
    )
    const isReservedParticipantsChanged = useMemo(
      () =>
        !compareArrays(
          reservedParticipantsIds,
          sortedEventReservedParticipantsIds
        ),
      [reservedParticipantsIds]
    )
    const isBannedParticipantsIdsChanged = useMemo(
      () =>
        !compareArrays(bannedParticipantsIds, sortedEventBannedParticipantsIds),
      [bannedParticipantsIds]
    )

    const isFormChanged =
      isAssistantsChanged ||
      isMansChanged ||
      isWomansChanged ||
      isReservedParticipantsChanged ||
      isBannedParticipantsIdsChanged

    useEffect(() => {
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
      setOnConfirmFunc(onClickConfirm)
      if (!isLoggedUserAdmin || isEventClosed) setOnlyCloseButtonShow(true)
    }, [isFormChanged, isLoggedUserAdmin, isEventClosed])

    useEffect(() => {
      if (isLoggedUserAdmin) {
        setBottomLeftButtonProps({
          name:
            event.status === 'closed'
              ? 'Активировать мероприятие'
              : 'Закрыть мероприятие',
          classBgColor: event.status === 'closed' ? 'bg-general' : 'bg-success',
          icon: event.status === 'closed' ? faPlay : faLock,
          onClick: () =>
            setEvent({
              _id: eventId,
              status: event.status === 'closed' ? 'active' : 'closed',
            }),
          disabled:
            event.status === 'active' && (isFormChanged || !isEventCanBeClosed),
        })
      } else setBottomLeftButtonProps(undefined)
    }, [isEventCanBeClosed, event.status, isLoggedUserAdmin, isFormChanged])

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
      <>
        {isLoggedUserAdmin && isEventClosed && (
          <P className="text-danger">
            Мероприятие закрыто, поэтому редактирование состава участников
            запрещено
          </P>
        )}
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
              readOnly={!isLoggedUserAdmin || isEventClosed}
              buttons={
                isLoggedUserAdmin && !isEventClosed
                  ? [
                      // (id) => {
                      //   const paymentsOfUser = paymentsOfEvent.filter(
                      //     (payment) => payment.userId === id
                      //   )

                      //   const sumOfPayments =
                      //     paymentsOfUser.reduce((p, c) => p + (c.sum ?? 0), 0) / 100

                      //   return {
                      //     onClick: () => {},
                      //     // icon: faMoneyBill,
                      //     // iconClassName: 'text-general',
                      //     tooltip: 'Оплата',
                      //     thin: true,
                      //     text: (() => {
                      //       const user = useRecoilValue(userSelector(id))
                      //       const eventPriceForUser =
                      //         (event.price -
                      //           (typeof event.usersStatusDiscount[
                      //             user.status ?? 'novice'
                      //           ] === 'number'
                      //             ? event.usersStatusDiscount[user.status ?? 'novice']
                      //             : 0)) /
                      //         100
                      //       return (
                      //         <div className="flex flex-col w-12 text-xs leading-4">
                      //           <span
                      //             className={cn(
                      //               sumOfPayments === eventPriceForUser
                      //                 ? 'text-success'
                      //                 : sumOfPayments < eventPriceForUser
                      //                 ? sumOfPayments === 0
                      //                   ? 'text-danger'
                      //                   : 'text-orange-500'
                      //                 : 'text-blue-700'
                      //             )}
                      //           >{`${sumOfPayments} ₽`}</span>
                      //           <span className="border-gray-700 border-t-1">{`${eventPriceForUser} ₽`}</span>
                      //         </div>
                      //       )
                      //     })(),
                      //     // textClassName: 'w-10',
                      //   }
                      // },
                      (id) => ({
                        onClick: () => {
                          setMansIds(
                            sortUsersIds(
                              [...mansIds].filter((userId) => userId !== id)
                            )
                          )
                          setReservedParticipantsIds(
                            sortUsersIds([...reservedParticipantsIds, id])
                          )
                        },
                        icon: faArrowAltCircleRight,
                        iconClassName: 'text-general',
                        tooltip: 'Перенести в резерв',
                      }),
                    ]
                  : []
              }
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
              readOnly={!isLoggedUserAdmin || isEventClosed}
              buttons={
                isLoggedUserAdmin && !isEventClosed
                  ? [
                      // (id) => {
                      //   const paymentsOfUser = paymentsOfEvent.filter(
                      //     (payment) => payment.userId === id
                      //   )

                      //   const sumOfPayments =
                      //     paymentsOfUser.reduce((p, c) => p + (c.sum ?? 0), 0) /
                      //     100

                      //   return {
                      //     onClick: () => {},
                      //     // icon: faMoneyBill,
                      //     // iconClassName: 'text-general',
                      //     tooltip: 'Оплата',

                      //     thin: true,
                      //     text: (() => {
                      //       const user = useRecoilValue(userSelector(id))
                      //       const eventPriceForUser =
                      //         (event.price -
                      //           (typeof event.usersStatusDiscount[
                      //             user.status ?? 'novice'
                      //           ] === 'number'
                      //             ? event.usersStatusDiscount[
                      //                 user.status ?? 'novice'
                      //               ]
                      //             : 0)) /
                      //         100
                      //       return (
                      //         <div className="flex flex-col w-12 text-xs leading-4">
                      //           <span
                      //             className={
                      //               sumOfPayments === eventPriceForUser
                      //                 ? 'text-success'
                      //                 : sumOfPayments < eventPriceForUser
                      //                 ? sumOfPayments === 0
                      //                   ? 'text-danger'
                      //                   : 'text-orange-500'
                      //                 : 'text-blue-700'
                      //             }
                      //           >{`${sumOfPayments} ₽`}</span>
                      //           <span className="border-gray-700 border-t-1">{`${eventPriceForUser} ₽`}</span>
                      //         </div>
                      //       )
                      //     })(),
                      //     // textClassName: 'w-10',
                      //   }
                      // },
                      (id) => ({
                        onClick: () => {
                          setWomansIds(
                            sortUsersIds(
                              [...womansIds].filter((userId) => userId !== id)
                            )
                          )
                          setReservedParticipantsIds(
                            sortUsersIds([...reservedParticipantsIds, id])
                          )
                        },
                        icon: faArrowAltCircleRight,
                        iconClassName: 'text-general',
                        tooltip: 'Перенести в резерв',
                      }),
                    ]
                  : []
              }
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
                onChange={(usersIds) => {
                  removeIdsFromParticipants(usersIds)
                  setReservedParticipantsIds(sortUsersIds(usersIds))
                }}
                exceptedIds={[
                  ...assistantsIds,
                  // ...mansIds,
                  // ...womansIds,
                  // ...reservedParticipantsIds,
                  ...bannedParticipantsIds,
                ]}
                buttons={
                  isLoggedUserAdmin && !isEventClosed
                    ? [
                        (id) => ({
                          onClick: () => {
                            removeIdsFromReserve([id])
                            const genderOfUser = users.find(
                              (user) => user._id === id
                            ).gender
                            if (genderOfUser === 'male')
                              setMansIds(sortUsersIds([...mansIds, id]))
                            if (genderOfUser === 'famale')
                              setWomansIds(sortUsersIds([...womansIds, id]))
                          },
                          icon: faArrowAltCircleLeft,
                          iconClassName: 'text-general',
                          tooltip: 'Перенести в активный состав',
                        }),
                      ]
                    : []
                }
                readOnly={!isLoggedUserAdmin || isEventClosed}
              />
            </TabPanel>
          )}
          <TabPanel
            tabName="Ведущие"
            tabAddToLabel={`(${assistantsIds.length})`}
          >
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
              readOnly={!isLoggedUserAdmin || isEventClosed}
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
                readOnly={!isLoggedUserAdmin || isEventClosed}
              />
            </TabPanel>
          )}
          {/* <ErrorsList errors={errors} /> */}
          {/* </TabsBody>
      </Tabs> */}
        </TabContext>
      </>
    )
  }

  return {
    title: `Участники мероприятия`,
    confirmButtonName: 'Применить',
    Children: EventModal,
  }
}

export default eventUsersFunc
