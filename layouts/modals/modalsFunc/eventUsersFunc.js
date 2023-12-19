import CardButton from '@components/CardButton'
import { SelectUserList } from '@components/SelectItemList'
import TabContext from '@components/Tabs/TabContext'
import TabPanel from '@components/Tabs/TabPanel'
import { P } from '@components/tags'
import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
} from '@fortawesome/free-regular-svg-icons'
import { faListCheck } from '@fortawesome/free-solid-svg-icons'
import birthDateToAge from '@helpers/birthDateToAge'
import compareArrays from '@helpers/compareArrays'
import { DEFAULT_EVENT, EVENT_STATUSES } from '@helpers/constants'
import copyToClipboard from '@helpers/copyToClipboard'
import getUserFullName from '@helpers/getUserFullName'
import isEventClosedFunc from '@helpers/isEventClosed'
import useSnackbar from '@helpers/useSnackbar'
import { modalsFuncAtom } from '@state/atoms'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import usersAtom from '@state/atoms/usersAtom'
import eventAssistantsSelector from '@state/selectors/eventAssistantsSelector'
import eventMansSelector from '@state/selectors/eventMansSelector'
import eventSelector from '@state/selectors/eventSelector'
import eventUsersInBanSelector from '@state/selectors/eventUsersInBanSelector'
import eventUsersInReserveSelector from '@state/selectors/eventUsersInReserveSelector'
import eventWomansSelector from '@state/selectors/eventWomansSelector'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import cn from 'classnames'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'

const useCopyUserListToClipboard = ({ mans, womans }) => {
  const mansNames = mans.map(
    (user, index) =>
      `${index + 1}. ${getUserFullName(user)}${
        user.status === 'member' ? ' (клуб)' : ''
      } - ${birthDateToAge(user.birthday)}`
  )
  const womansNames = womans.map(
    (user, index) =>
      `${index + 1}. ${getUserFullName(user)}${
        user.status === 'member' ? ' (клуб)' : ''
      } - ${birthDateToAge(user.birthday)}`
  )
  const mansText = mansNames.length > 0 ? `${mansNames.join(`\n`)}` : null
  const womansText = womansNames.length > 0 ? `${womansNames.join(`\n`)}` : null

  return copyToClipboard(
    `${mansText ? `Мужчины:\n${mansNames.join(`\n`)}\n\n` : ''}${
      womansText ? `Женщины:\n${womansNames.join(`\n`)}` : ''
    }`
  )
}

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
    setTopLeftComponent,
  }) => {
    const modalsFunc = useRecoilValue(modalsFuncAtom)
    const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleSelector)
    const statusEdit = loggedUserActiveRole?.events?.statusEdit
    const canEdit = loggedUserActiveRole?.eventsUsers?.edit
    const copyListToClipboard =
      loggedUserActiveRole?.eventsUsers?.copyListToClipboard

    const event = useRecoilValue(eventSelector(eventId))
    const setEventUsersId = useRecoilValue(itemsFuncAtom).event.setEventUsers
    const users = useRecoilValue(usersAtom)
    const isEventClosed = isEventClosedFunc(event)
    // const setEvent = useRecoilValue(itemsFuncAtom).event.set
    // const isEventCanBeClosed = useRecoilValue(
    //   isEventCanBeClosedSelector(eventId)
    // )
    const { info } = useSnackbar()
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
    const sortedEventAssistants = useMemo(
      () => [...eventAssistants].sort(sortFunction),
      [eventAssistants]
    )
    const sortedEventAssistantsIds = useMemo(
      () => sortedEventAssistants.map((user) => user._id),
      [sortedEventAssistants]
    )

    const eventMans = useRecoilValue(eventMansSelector(eventId))
    const sortedEventMans = useMemo(
      () => [...eventMans].sort(sortFunction),
      [eventMans]
    )
    const sortedEventMansIds = useMemo(
      () => sortedEventMans.map((user) => user._id),
      [sortedEventMans]
    )

    const eventWomans = useRecoilValue(eventWomansSelector(eventId))
    const sortedEventWomans = useMemo(
      () => [...eventWomans].sort(sortFunction),
      [eventMans]
    )
    const sortedEventWomansIds = useMemo(
      () => sortedEventWomans.map((user) => user._id),
      [sortedEventWomans]
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

    useEffect(() => {
      if ((statusEdit || copyListToClipboard) && setTopLeftComponent)
        setTopLeftComponent(() => (
          <div className="flex">
            {statusEdit &&
              (() => {
                const status = event.status ?? 'active'
                const { icon, color, name } = EVENT_STATUSES.find(
                  ({ value }) => value === status
                )
                return (
                  <CardButton
                    icon={icon}
                    onClick={() => modalsFunc.event.statusEdit(event._id)}
                    color={
                      color.indexOf('-') > 0
                        ? color.slice(0, color.indexOf('-'))
                        : color
                    }
                    tooltipText={`${name} (изменить статус)`}
                  />
                )
              })()}
            {copyListToClipboard && (
              <CardButton
                icon={faListCheck}
                onClick={() => {
                  useCopyUserListToClipboard({
                    mans: users.filter((user) => mansIds.includes(user._id)),
                    womans: users.filter((user) =>
                      womansIds.includes(user._id)
                    ),
                  })

                  info('Список участников скопирован в буфер обмена')
                }}
                color="purple"
                tooltipText="Скопировать в буфер список участников"
              />
            )}
          </div>
        ))
    }, [
      statusEdit,
      copyListToClipboard,
      setTopLeftComponent,
      mansIds,
      womansIds,
      event,
    ])

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

    useEffect(() => {
      const isFormChanged =
        isAssistantsChanged ||
        isMansChanged ||
        isWomansChanged ||
        isReservedParticipantsChanged ||
        isBannedParticipantsIdsChanged

      setOnConfirmFunc(isFormChanged ? onClickConfirm : undefined)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
      setOnlyCloseButtonShow(!canEdit || isEventClosed)
    }, [
      assistantsIds,
      mansIds,
      womansIds,
      reservedParticipantsIds,
      bannedParticipantsIds,
      canEdit,
      isEventClosed,
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
      <>
        {canEdit && isEventClosed && (
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
              className="mb-1"
              label="Участники Мужчины"
              modalTitle="Выбор участников (мужчин)"
              filter={{ gender: { operand: '===', value: 'male' } }}
              usersId={mansIds}
              onChange={(usersIds) => {
                removeIdsFromReserve(usersIds)
                setMansIds(sortUsersIds(usersIds))
              }}
              counterClassName={
                event.maxMans && mansIds.length >= event.maxMans
                  ? 'text-danger font-bold'
                  : ''
              }
              maxUsers={event.maxMans}
              canAddItem={
                (!event.maxUsers ||
                  mansIds.length + womansIds.length < event.maxUsers) &&
                (event.maxMans === null || event.maxMans > mansIds.length)
              }
              exceptedIds={[...assistantsIds, ...bannedParticipantsIds]}
              readOnly={!canEdit || isEventClosed}
              buttons={
                canEdit && !isEventClosed
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
              className="mb-1"
              label="Участники Женщины"
              modalTitle="Выбор участниц (женщин)"
              filter={{ gender: { operand: '===', value: 'famale' } }}
              usersId={womansIds}
              onChange={(usersIds) => {
                removeIdsFromReserve(usersIds)
                setWomansIds(sortUsersIds(usersIds))
              }}
              counterClassName={
                event.maxWomans && womansIds.length >= event.maxWomans
                  ? 'text-danger font-bold'
                  : ''
              }
              maxUsers={event.maxWomans}
              canAddItem={
                (!event.maxUsers ||
                  mansIds.length + womansIds.length < event.maxUsers) &&
                (event.maxWomans === null || event.maxWomans > womansIds.length)
              }
              exceptedIds={[...assistantsIds, ...bannedParticipantsIds]}
              readOnly={!canEdit || isEventClosed}
              buttons={
                canEdit && !isEventClosed
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
              <span
                className={cn(
                  event.maxParticipants &&
                    mansIds.length + womansIds.length >= event.maxParticipants
                    ? 'font-bold text-danger'
                    : ''
                )}
              >
                {mansIds.length + womansIds.length}
              </span>
              {event.maxParticipants ? (
                <>
                  <span>/</span>
                  <span>{event.maxParticipants}</span>
                </>
              ) : null}
              <span>чел.</span>
            </div>
          </TabPanel>
          {canEdit &&
            (event.isReserveActive ?? DEFAULT_EVENT.isReserveActive) && (
              <TabPanel
                tabName="Резерв"
                tabAddToLabel={`(${reservedParticipantsIds.length})`}
              >
                <SelectUserList
                  label="Резерв"
                  filter={{ gender: { operand: '!==', value: null } }}
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
                    canEdit && !isEventClosed
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
                  readOnly={!canEdit || isEventClosed}
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
              readOnly={!canEdit || isEventClosed}
            />
          </TabPanel>
          {canEdit && (
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
                readOnly={!canEdit || isEventClosed}
              />
            </TabPanel>
          )}
          {/* <ErrorsList errors={errors} /> */}
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
