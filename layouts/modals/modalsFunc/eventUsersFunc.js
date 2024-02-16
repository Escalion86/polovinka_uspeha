import CardButton from '@components/CardButton'
import EventUsersCounterAndAge from '@components/EventUsersCounterAndAge'
import InputWrapper from '@components/InputWrapper'
import { SelectUserList } from '@components/SelectItemList'
import TabContext from '@components/Tabs/TabContext'
import TabPanel from '@components/Tabs/TabPanel'
import { P } from '@components/tags'
import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
  faArrowAltCircleUp,
} from '@fortawesome/free-regular-svg-icons'
import {
  faHeartCirclePlus,
  faListCheck,
  faStreetView,
} from '@fortawesome/free-solid-svg-icons'
import { arrayToObjectArray } from '@helpers/arrayToObject'
// import compareArrays from '@helpers/compareArrays'
import compareObjects from '@helpers/compareObjects'
import { EVENT_STATUSES } from '@helpers/constants'
import isEventClosedFunc from '@helpers/isEventClosed'
import subEventsSummator from '@helpers/subEventsSummator'
import { modalsFuncAtom } from '@state/atoms'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import usersAtom from '@state/atoms/usersAtom'
import eventSelector from '@state/selectors/eventSelector'
import eventsUsersFullByEventIdSelector from '@state/selectors/eventsUsersFullByEventIdSelector'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'

const EventsUsers = ({
  event,
  label,
  modalTitle,
  selectedIds = [],
  setSelectedIds,
  exceptedIds,
  canEdit,
  toReserveFunc,
  fromReserveFunc,
}) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  const isEventClosed = isEventClosedFunc(event)

  return (
    <>
      <SelectUserList
        showCounter={false}
        className="w-full"
        filter={{ gender: { operand: '!==', value: null } }}
        label={label}
        modalTitle={modalTitle}
        usersId={selectedIds}
        onChange={setSelectedIds}
        exceptedIds={exceptedIds}
        readOnly={!canEdit || isEventClosed}
        buttons={[
          event.subEvents.length > 1
            ? (id) => ({
                onClick: () => {
                  modalsFunc.eventUser.editSubEvent({
                    eventId: event._id,
                    userId: id,
                  })
                },
                icon: faStreetView,
                iconClassName: 'text-blue-600',
                tooltip: 'Изменить вариант участия',
              })
            : undefined,
          ...(canEdit && !isEventClosed
            ? [
                toReserveFunc
                  ? (id) => ({
                      onClick: () => {
                        setSelectedIds(
                          selectedIds.filter((userId) => userId !== id)
                        )
                        toReserveFunc(id)
                        // setReservedParticipantsIds(
                        //   sortUsersIds([...reservedParticipantsIds, id])
                        // )
                      },
                      icon: faArrowAltCircleRight,
                      iconClassName: 'text-general',
                      tooltip: 'Перенести в резерв',
                    })
                  : undefined,
                fromReserveFunc
                  ? (id) => ({
                      onClick: () => {
                        fromReserveFunc(id)
                        // setSelectedIds([...selectedIds, id])
                        setSelectedIds(
                          selectedIds.filter((userId) => userId !== id)
                        )
                      },
                      icon: faArrowAltCircleLeft,
                      iconClassName: 'text-general',
                      tooltip: 'Перенести в активный состав',
                    })
                  : undefined,
              ]
            : []),
        ]}
      />
      {/* <SelectUserList
        className="mb-1"
        label={labelWoman}
        modalTitle={modalTitleWoman}
        filter={{ gender: { operand: '===', value: 'famale' } }}
        usersId={womansIds}
        onChange={setWomansIds}
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
        exceptedIds={exceptedIds}
        readOnly={!canEdit || isEventClosed}
        buttons={
          canEdit && !isEventClosed
            ? [
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
      </div> */}
    </>
  )
}

const sortFunctionEventUser = (a, b) =>
  a.user?.firstName < b.user?.firstName ? -1 : 1

const sortByFirstNameAndGenderFunctionEventUser = (a, b) =>
  a.user?.gender === 'male'
    ? b.user?.gender === 'male'
      ? a.user?.firstName < b.user?.firstName
        ? -1
        : 1
      : -1
    : b.user?.gender === 'male'
      ? 1
      : a.user?.firstName < b.user?.firstName
        ? -1
        : 1

const sortByFirstNameAndGenderFunction = (a, b) =>
  a.gender === 'male'
    ? b.gender === 'male'
      ? a.firstName < b.firstName
        ? -1
        : 1
      : -1
    : b.gender === 'male'
      ? 1
      : a.firstName < b.firstName
        ? -1
        : 1

const genderSplitAndSort = (eventUsers) =>
  genderSplitAndSort?.length === 0
    ? [[], []]
    : [
        [...eventUsers.filter(({ user }) => user.gender === 'male')].sort(
          sortFunctionEventUser
        ),
        [...eventUsers.filter(({ user }) => user.gender === 'famale')].sort(
          sortFunctionEventUser
        ),
      ]

// const getIds = (eventUsers) => eventUsers.map(({ user }) => user._id)

const eventUsersFunc = (eventId) => {
  const EventModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setOnlyCloseButtonShow,
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

    const showLikes = loggedUserActiveRole?.events?.editLikes && event.likes

    const sortedUsers = useMemo(
      () => [...users].sort(sortByFirstNameAndGenderFunction),
      [users]
    )

    // const sortUsersIds = useCallback(
    //   (ids) =>
    //     sortedUsers
    //       .filter((user) => ids.includes(user._id))
    //       .map((user) => user._id),
    //   [sortedUsers]
    // )

    const sortUsersByIds = useCallback(
      (ids) =>
        // .map((user) => user._id),
        sortedUsers.filter((user) => ids.includes(user._id)),
      [sortedUsers]
    )

    const eventUsers = useRecoilValue(eventsUsersFullByEventIdSelector(eventId))
    // const [sortedEventMans, sortedEventWomans] = useMemo(
    //   () =>
    //     genderSplitAndSort(
    //       eventUsers.filter(({ status }) => status === 'participant')
    //     ),
    //   [eventUsers]
    // )

    const sortedEventUsersParticipants = useMemo(
      () =>
        [...eventUsers.filter(({ status }) => status === 'participant')].sort(
          sortByFirstNameAndGenderFunctionEventUser
        ),
      [eventUsers]
    )

    const sortedEventUsersReserve = useMemo(
      () =>
        [...eventUsers.filter(({ status }) => status === 'reserve')].sort(
          sortByFirstNameAndGenderFunctionEventUser
        ),
      [eventUsers]
    )

    const sortedEventUsersAssistants = useMemo(
      () =>
        [...eventUsers.filter(({ status }) => status === 'assistant')].sort(
          sortByFirstNameAndGenderFunctionEventUser
        ),
      [eventUsers]
    )

    const sortedEventUsersBanned = useMemo(
      () =>
        [...eventUsers.filter(({ status }) => status === 'ban')].sort(
          sortByFirstNameAndGenderFunctionEventUser
        ),
      [eventUsers]
    )

    // const sortedEventAssistantsIds = useMemo(
    //   () => getIds(sortedEventUsersAssistants),
    //   [sortedEventUsersAssistants]
    // )

    // const sortedEventMansIds = useMemo(
    //   () => getIds(sortedEventMans),
    //   [sortedEventMans]
    // )

    // const sortedEventWomansIds = useMemo(
    //   () => getIds(sortedEventWomans),
    //   [sortedEventWomans]
    // )

    // const sortedEventReservedParticipantsIds = useMemo(
    //   () => getIds(sortedEventUsersReserve),
    //   [sortedEventUsersReserve]
    // )

    // const sortedEventBannedParticipantsIds = useMemo(
    //   () => getIds(sortedEventUsersBanned),
    //   [sortedEventUsersBanned]
    // )

    const objParticipants = useMemo(
      () =>
        arrayToObjectArray(
          sortedEventUsersParticipants,
          'subEventId',
          true,
          event._id,
          ({ user }) => user
        ),
      [sortedEventUsersParticipants]
    )

    const objReserve = useMemo(
      () =>
        arrayToObjectArray(
          sortedEventUsersReserve,
          'subEventId',
          true,
          event._id,
          ({ user }) => user
        ),
      [sortedEventUsersReserve]
    )

    const objAssistants = useMemo(
      () =>
        arrayToObjectArray(
          sortedEventUsersAssistants,
          'subEventId',
          true,
          event._id,
          ({ user }) => user
        ),
      [sortedEventUsersAssistants]
    )

    const objBanned = useMemo(
      () =>
        arrayToObjectArray(
          sortedEventUsersBanned,
          'subEventId',
          true,
          event._id,
          ({ user }) => user
        ),
      [sortedEventUsersBanned]
    )

    const [participants, setParticipants] = useState(objParticipants)
    const [reserve, setReserve] = useState(objReserve)
    const [assistants, setAssistants] = useState(objAssistants)
    const [banned, setBanned] = useState(objBanned)

    useEffect(() => {
      if (!compareObjects(participants, objParticipants))
        setParticipants(objParticipants)
    }, [objParticipants])

    useEffect(() => {
      if (!compareObjects(reserve, objReserve)) setReserve(objReserve)
    }, [objReserve])

    // const [assistantsIds, setAssistantsIds] = useState(sortedEventAssistantsIds)
    // const [mansIds, setMansIds] = useState(sortedEventMansIds)
    // const [womansIds, setWomansIds] = useState(sortedEventWomansIds)
    // const [reservedParticipantsIds, setReservedParticipantsIds] = useState(
    //   sortedEventReservedParticipantsIds
    // )
    // const [bannedParticipantsIds, setBannedParticipantsIds] = useState(
    //   sortedEventBannedParticipantsIds
    // )

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
                  modalsFunc.event.copyUsersList(event._id)
                  // useCopyUserListToClipboard({
                  //   mans: users.filter((user) => mansIds.includes(user._id)),
                  //   womans: users.filter((user) =>
                  //     womansIds.includes(user._id)
                  //   ),
                  // })

                  // info('Список участников скопирован в буфер обмена')
                }}
                color="purple"
                tooltipText="Скопировать в буфер список участников"
              />
            )}
            {showLikes && (
              <CardButton
                icon={faHeartCirclePlus}
                onClick={() => modalsFunc.event.viewLikes(event._id)}
                color="pink"
                tooltipText='Калькулятор "Быстрые свидания"'
              />
            )}
          </div>
        ))
    }, [
      statusEdit,
      copyListToClipboard,
      setTopLeftComponent,
      participants,
      reserve,
      assistants,
      banned,
      event,
    ])

    const onClickConfirm = async () => {
      closeModal()
      // const filteredAssistantsIds = assistantsIds.filter((user) => user !== '?')
      // const filteredParticipantsIds = [
      //   ...mansIds.filter((user) => user !== '?'),
      //   ...womansIds.filter((user) => user !== '?'),
      // ]
      // const filteredReservedParticipantsIds = reservedParticipantsIds.filter(
      //   (user) => user !== '?'
      // )
      // const filteredBannedParticipantsIds = bannedParticipantsIds.filter(
      //   (user) => user !== '?'
      // )
      // const usersStatuses = [
      //   ...filteredAssistantsIds.map((userId) => {
      //     return { userId, status: 'assistant' }
      //   }),
      //   ...filteredParticipantsIds.map((userId) => {
      //     return { userId, status: 'participant' }
      //   }),
      //   ...filteredReservedParticipantsIds.map((userId) => {
      //     return { userId, status: 'reserve' }
      //   }),
      //   ...filteredBannedParticipantsIds.map((userId) => {
      //     return { userId, status: 'ban' }
      //   }),
      // ]
      const usersStatuses = []
      event.subEvents.forEach(({ id }) => {
        if (participants[id])
          participants[id].forEach((user) =>
            usersStatuses.push({
              userId: user._id,
              status: 'participant',
              subEventId: id,
            })
          )
        if (reserve[id])
          reserve[id].forEach((user) =>
            usersStatuses.push({
              userId: user._id,
              status: 'reserve',
              subEventId: id,
            })
          )
        if (assistants[id])
          assistants[id].forEach((user) =>
            usersStatuses.push({
              userId: user._id,
              status: 'assistant',
              subEventId: id,
            })
          )
        if (banned[id])
          banned[id].forEach((user) =>
            usersStatuses.push({
              userId: user._id,
              status: 'ban',
              subEventId: id,
            })
          )
      })

      setEventUsersId(eventId, usersStatuses)
    }

    useEffect(() => {
      const isFormChanged =
        !compareObjects(participants, objParticipants) ||
        !compareObjects(assistants, objAssistants) ||
        !compareObjects(reserve, objReserve) ||
        !compareObjects(banned, objBanned)

      setOnConfirmFunc(isFormChanged ? onClickConfirm : undefined)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
      setOnlyCloseButtonShow(!canEdit || isEventClosed)
    }, [participants, assistants, reserve, banned, canEdit, isEventClosed])

    // const removeIdsFromReserve = (usersIds) => {
    //   const tempReservedParticipantsIds = []
    //   for (let i = 0; i < reservedParticipantsIds.length; i++) {
    //     if (!usersIds.includes(reservedParticipantsIds[i]))
    //       tempReservedParticipantsIds.push(reservedParticipantsIds[i])
    //   }
    //   setReservedParticipantsIds(tempReservedParticipantsIds)
    // }
    // const removeIdsFromParticipants = (usersIds) => {
    //   const tempMansIds = []
    //   for (let i = 0; i < mansIds.length; i++) {
    //     if (!usersIds.includes(mansIds[i])) tempMansIds.push(mansIds[i])
    //   }

    //   const tempWomansIds = []
    //   for (let i = 0; i < womansIds.length; i++) {
    //     if (!usersIds.includes(womansIds[i])) tempWomansIds.push(womansIds[i])
    //   }
    //   setMansIds(tempMansIds)
    //   setWomansIds(tempWomansIds)
    // }
    // const removeIdsFromAllByBan = (bannedUsersIds) => {
    //   var tempIds = []
    //   for (let i = 0; i < mansIds.length; i++) {
    //     if (!bannedUsersIds.includes(mansIds[i])) tempIds.push(mansIds[i])
    //   }
    //   setMansIds(tempIds)
    //   tempIds = []
    //   for (let i = 0; i < womansIds.length; i++) {
    //     if (!bannedUsersIds.includes(womansIds[i])) tempIds.push(womansIds[i])
    //   }
    //   setWomansIds(tempIds)
    //   tempIds = []
    //   for (let i = 0; i < assistantsIds.length; i++) {
    //     if (!bannedUsersIds.includes(assistantsIds[i]))
    //       tempIds.push(assistantsIds[i])
    //   }
    //   setAssistantsIds(tempIds)
    //   tempIds = []
    //   for (let i = 0; i < reservedParticipantsIds.length; i++) {
    //     if (!bannedUsersIds.includes(reservedParticipantsIds[i]))
    //       tempIds.push(reservedParticipantsIds[i])
    //   }
    //   setReservedParticipantsIds(tempIds)
    // }

    const setParticipantsState = (subEventId, ids) => {
      setParticipants((state) => ({
        ...state,
        [subEventId]: sortUsersByIds(ids),
      }))
    }

    const setReserveState = (subEventId, ids) => {
      setReserve((state) => ({
        ...state,
        [subEventId]: sortUsersByIds(ids),
      }))
    }

    const setAssistantsState = (subEventId, ids) => {
      setAssistants((state) => ({
        ...state,
        [subEventId]: sortUsersByIds(ids),
      }))
    }

    const setBannedState = (subEventId, ids) => {
      setBanned((state) => ({
        ...state,
        [subEventId]: sortUsersByIds(ids),
      }))
    }

    const participantsCount = Object.keys(participants).reduce(
      (sum, subEventId) => sum + participants[subEventId]?.length ?? 0,
      0
    )

    const reserveCount = Object.keys(reserve).reduce(
      (sum, subEventId) => sum + reserve[subEventId]?.length ?? 0,
      0
    )

    const assistantsCount = Object.keys(assistants).reduce(
      (sum, subEventId) => sum + assistants[subEventId]?.length ?? 0,
      0
    )

    const bannedCount = Object.keys(banned).reduce(
      (sum, subEventId) => sum + banned[subEventId]?.length ?? 0,
      0
    )
    const participantsIds = {}
    const reserveIds = {}
    const assistantsIds = {}
    const bannedIds = {}
    const eventUsersToUse = {}

    event.subEvents.forEach(({ id }) => {
      const participantsSubEvent = participants[id] ?? []
      const reserveSubEvent = reserve[id] ?? []
      const assistantsSubEvent = assistants[id] ?? []
      const bannedSubEvent = banned[id] ?? []

      participantsIds[id] = participantsSubEvent.map(({ _id }) => _id)
      reserveIds[id] = reserveSubEvent.map(({ _id }) => _id)
      assistantsIds[id] = assistantsSubEvent.map(({ _id }) => _id)
      bannedIds[id] = bannedSubEvent.map(({ _id }) => _id)

      eventUsersToUse[id] = [
        ...participantsSubEvent.map((user) => ({
          user,
          status: 'participant',
          userStatus: user.status,
          subEventId: id,
        })),
        ...assistantsSubEvent.map((user) => ({
          user,
          status: 'assistant',
          userStatus: user.status,
          subEventId: id,
        })),
        ...reserveSubEvent.map((user) => ({
          user,
          status: 'reserve',
          userStatus: user.status,
          subEventId: id,
        })),
        ...bannedSubEvent.map((user) => ({
          user,
          status: 'ban',
          userStatus: user.status,
          subEventId: id,
        })),
      ]
    })

    const Wrapper = useMemo(
      () =>
        event.subEvents.length > 1
          ? ({ children, label }) => (
              <InputWrapper
                label={label}
                paddingX="small"
                noMargin
                centerLabel
                wrapperClassName="flex flex-col items-stretch"
              >
                {children}
              </InputWrapper>
            )
          : ({ children }) => children,
      [event]
    )

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
            tabAddToLabel={`(${participantsCount})`}
            className="flex flex-col mt-2 gap-y-5"
          >
            {event.subEvents.map((subEvent) => {
              const { id, title } = subEvent

              return (
                <Wrapper
                  key={'Участники' + id}
                  label={title || 'Основной тип участия'}
                >
                  {canEdit && (
                    <div className="flex justify-center mb-1">
                      <EventUsersCounterAndAge
                        event={event}
                        subEvent={subEvent}
                        eventUsersToUse={eventUsersToUse[id] ?? []}
                        // showNoviceAndMemberSum
                        showAges={false}
                        dontShowLabel
                      />
                    </div>
                  )}
                  <EventsUsers
                    event={event}
                    modalTitle="Выбор участников"
                    selectedIds={participantsIds[id]}
                    setSelectedIds={(ids) => setParticipantsState(id, ids)}
                    exceptedIds={[
                      ...reserveIds[id],
                      ...assistantsIds[id],
                      ...bannedIds[id],
                    ]}
                    canEdit={canEdit}
                    toReserveFunc={(newId) => {
                      setReserveState(id, [...reserveIds[id], newId])
                    }}
                  />
                </Wrapper>
              )
            })}
          </TabPanel>
          {canEdit && subEventsSummator(event.subEvents)?.isReserveActive && (
            <TabPanel
              tabName="Резерв"
              tabAddToLabel={`(${reserveCount})`}
              className="flex flex-col mt-2 gap-y-5"
            >
              {event.subEvents.map((subEvent) => {
                const { id, title } = subEvent

                return (
                  <Wrapper
                    key={'Резерв' + id}
                    label={title || 'Основной тип участия'}
                  >
                    <EventsUsers
                      event={event}
                      modalTitle="Выбор резерва"
                      selectedIds={reserveIds[id]}
                      setSelectedIds={(ids) => setReserveState(id, ids)}
                      exceptedIds={[
                        ...participantsIds[id],
                        ...assistantsIds[id],
                        ...bannedIds[id],
                      ]}
                      canEdit={canEdit}
                      fromReserveFunc={
                        (newId) =>
                          setParticipantsState(id, [
                            ...participantsIds[id],
                            newId,
                          ])
                        // setReserveState(sortUsersByIds([...reserveIds[id], id]))
                      }
                    />
                  </Wrapper>
                )
              })}
            </TabPanel>
          )}
          <TabPanel
            tabName="Ведущие"
            tabAddToLabel={`(${assistantsCount})`}
            className="flex flex-col mt-2 gap-y-5"
          >
            {event.subEvents.map((subEvent) => {
              const { id, title } = subEvent

              return (
                <Wrapper
                  key={'Ведущие' + id}
                  label={title || 'Основной тип участия'}
                >
                  <EventsUsers
                    event={event}
                    modalTitle="Выбор ведущих"
                    selectedIds={assistantsIds[id]}
                    setSelectedIds={(ids) => setAssistantsState(id, ids)}
                    exceptedIds={[
                      ...participantsIds[id],
                      ...reserveIds[id],
                      ...bannedIds[id],
                    ]}
                    canEdit={canEdit}
                  />
                </Wrapper>
              )
            })}
          </TabPanel>
          {canEdit && (
            <TabPanel
              tabName="Бан"
              tabAddToLabel={`(${bannedCount})`}
              className="flex flex-col mt-2 gap-y-5"
            >
              {event.subEvents.map((subEvent) => {
                const { id, title } = subEvent

                return (
                  <Wrapper
                    key={'Бан' + id}
                    label={title || 'Основной тип участия'}
                  >
                    <EventsUsers
                      event={event}
                      modalTitle="Выбор забаненых участников"
                      selectedIds={bannedIds[id]}
                      setSelectedIds={(ids) => setBannedState(id, ids)}
                      exceptedIds={[
                        ...participantsIds[id],
                        ...reserveIds[id],
                        ...assistantsIds[id],
                      ]}
                      canEdit={canEdit}
                    />
                  </Wrapper>
                )
              })}
            </TabPanel>
          )}
          {/* {canEdit &&
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
          )} */}
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
