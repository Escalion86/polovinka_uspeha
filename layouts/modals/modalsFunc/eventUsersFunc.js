import CardButton from '@components/CardButton'
import EventUsersCounterAndAge from '@components/EventUsersCounterAndAge'
import InputWrapper from '@components/InputWrapper'
import { SelectUserList } from '@components/SelectItemList'
import TabContext from '@components/Tabs/TabContext'
import TabPanel from '@components/Tabs/TabPanel'
import { P } from '@components/tags'
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons/faArrowAltCircleLeft'
import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons/faArrowAltCircleRight'
import { faHeartCirclePlus } from '@fortawesome/free-solid-svg-icons/faHeartCirclePlus'
import { faListCheck } from '@fortawesome/free-solid-svg-icons/faListCheck'
import { faStreetView } from '@fortawesome/free-solid-svg-icons/faStreetView'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { arrayToObjectArray } from '@helpers/arrayToObject'
import compareObjects from '@helpers/compareObjects'
import { EVENT_STATUSES } from '@helpers/constants'
import isEventClosedFunc from '@helpers/isEventClosed'
import subEventsSummator from '@helpers/subEventsSummator'
import asyncEventsUsersByEventIdAtom from '@state/async/asyncEventsUsersByEventIdAtom'
// import { asyncEventsUsersByEventIdSelector } from '@state/async/asyncEventsUsersByEventIdAtom'
import { modalsFuncAtom } from '@state/atoms'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import usersAtom from '@state/atoms/usersAtom'
// import eventFullAtomAsync from '@state/async/eventFullAtomAsync'
import eventsUsersFullByEventIdSelector from '@state/selectors/eventsUsersFullByEventIdSelector'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  useRecoilRefresher_UNSTABLE,
  // useRecoilRefresher_UNSTABLE,
  useRecoilValue,
} from 'recoil'
import eventSelector from '@state/selectors/eventSelector'
import sortFunctions from '@helpers/sortFunctions'
import formatDateTime from '@helpers/formatDateTime'
import Note from '@components/Note'
import cn from 'classnames'
import { faHistory } from '@fortawesome/free-solid-svg-icons/faHistory'

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
  noButtons,
  itemChildren,
  nameFieldWrapperClassName,
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
        itemChildren={itemChildren}
        nameFieldWrapperClassName={nameFieldWrapperClassName}
        buttons={
          !noButtons && canEdit && !isEventClosed
            ? [
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
            : []
        }
      />
    </>
  )
}

const sortFunctionEventUser = (a, b) =>
  a.user?.firstName < b.user?.firstName ? -1 : 1

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
  const EventUsersModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setOnlyCloseButtonShow,
    setTopLeftComponent,
    isDataChanged,
  }) => {
    const modalsFunc = useRecoilValue(modalsFuncAtom)
    const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleSelector)
    const statusEdit = loggedUserActiveRole?.events?.statusEdit
    const canEdit = loggedUserActiveRole?.eventsUsers?.edit
    const copyListToClipboard =
      loggedUserActiveRole?.eventsUsers?.copyListToClipboard

    const [dataChanged, setDataChanged] = useState(isDataChanged)
    // const [sortType, setSortType] = useState('name')
    // const [sort, setSort] = useState({ firstNameAndGender: 'asc' })
    // const sortFunc = useMemo(() => sortFuncGenerator(sort), [sort])

    const event = useRecoilValue(eventSelector(eventId))
    const setEventUsersId = useRecoilValue(itemsFuncAtom).event.setEventUsers
    const users = useRecoilValue(usersAtom)
    const isEventClosed = isEventClosedFunc(event)

    const showLikes = loggedUserActiveRole?.events?.editLikes && event.likes

    const sortedUsers = useMemo(
      () => [...users].sort(sortFunctions.firstNameAndGender.asc),
      [users]
    )

    const sortUsersByIds = useCallback(
      (ids) => sortedUsers.filter((user) => ids.includes(user._id)),
      [sortedUsers]
    )

    const eventUsers = useRecoilValue(eventsUsersFullByEventIdSelector(eventId))

    const sortUsersByCreatedAt = useCallback(
      (ids) => {
        const filteredUsers = sortedUsers.filter((user) =>
          ids.includes(user._id)
        )
        const filteredEventUsers = filteredUsers.map(
          (user) =>
            eventUsers.find(({ userId }) => userId === user._id) || { user }
        )
        filteredEventUsers.sort(sortFunctions.createdAt.asc)
        const result = filteredEventUsers.map(({ user }) => user)
        return result
      },
      [sortedUsers]
    )

    const sortedEventUsersParticipants = useMemo(
      () =>
        [...eventUsers.filter(({ status }) => status === 'participant')].sort(
          (a, b) => sortFunctions.firstNameAndGender.asc(a.user, b.user)
        ),
      [eventUsers]
    )

    const sortedEventUsersReserve = useMemo(
      () =>
        [...eventUsers.filter(({ status }) => status === 'reserve')].sort(
          sortFunctions.createdAt.asc
        ),
      [eventUsers]
    )

    const arrayAssistants = useMemo(
      () =>
        [...eventUsers.filter(({ status }) => status === 'assistant')]
          .sort((a, b) => sortFunctions.firstNameAndGender.asc(a.user, b.user))
          .map(({ user }) => user),
      [eventUsers]
    )

    const arrayBanned = useMemo(
      () =>
        [...eventUsers.filter(({ status }) => status === 'ban')]
          .sort((a, b) => sortFunctions.firstNameAndGender.asc(a.user, b.user))
          .map(({ user }) => user),
      [eventUsers]
    )

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

    const [participants, setParticipants] = useState(objParticipants)
    const [reserve, setReserve] = useState(objReserve)
    const [assistants, setAssistants] = useState(arrayAssistants)
    const [banned, setBanned] = useState(arrayBanned)

    useEffect(() => {
      if (!compareObjects(participants, objParticipants))
        setParticipants(objParticipants)
    }, [objParticipants])

    useEffect(() => {
      if (!compareObjects(reserve, objReserve)) setReserve(objReserve)
    }, [objReserve])

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
            <CardButton
              icon={faHistory}
              onClick={() => {
                modalsFunc.event.historyEventUsers(event._id)
              }}
              color="orange"
              tooltipText="История записей"
            />
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
      // participants,
      // reserve,
      // assistants,
      // banned,
      // event,
    ])

    const onClickConfirm = async () => {
      closeModal()

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
      })
      if (assistants)
        assistants.forEach((user) =>
          usersStatuses.push({
            userId: user._id,
            status: 'assistant',
            subEventId: null,
          })
        )
      if (banned)
        banned.forEach((user) =>
          usersStatuses.push({
            userId: user._id,
            status: 'ban',
            subEventId: null,
          })
        )

      setEventUsersId(eventId, usersStatuses)
    }

    useEffect(() => {
      const isFormChanged =
        !compareObjects(participants, objParticipants) ||
        !compareObjects(assistants, arrayAssistants) ||
        !compareObjects(reserve, objReserve) ||
        !compareObjects(banned, arrayBanned)

      setOnConfirmFunc(isFormChanged ? onClickConfirm : undefined)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
      setOnlyCloseButtonShow(!canEdit || isEventClosed)
    }, [participants, assistants, reserve, banned, canEdit, isEventClosed])

    const setParticipantsState = (subEventId, ids) => {
      setParticipants((state) => ({
        ...state,
        [subEventId]: sortUsersByIds(ids),
      }))
    }

    const setReserveState = (subEventId, ids) => {
      setReserve((state) => ({
        ...state,
        [subEventId]: sortUsersByCreatedAt(ids),
      }))
    }

    const setAssistantsState = (ids) => setAssistants(sortUsersByIds(ids))

    const setBannedState = (ids) => setBanned(sortUsersByIds(ids))

    const participantsCount = Object.keys(participants).reduce(
      (sum, subEventId) => sum + participants[subEventId]?.length ?? 0,
      0
    )

    const reserveCount = Object.keys(reserve).reduce(
      (sum, subEventId) => sum + reserve[subEventId]?.length ?? 0,
      0
    )

    const assistantsCount = assistants?.length ?? 0
    const bannedCount = banned?.length ?? 0

    const participantsIds = {}
    const reserveIds = {}
    var participantsIdsAll = []
    var reserveIdsAll = []
    const assistantsIds = assistants.map(({ _id }) => _id)
    const bannedIds = banned.map(({ _id }) => _id)
    const eventUsersToUse = {}

    event.subEvents.forEach(({ id }) => {
      const participantsSubEvent = participants[id] ?? []
      const reserveSubEvent = reserve[id] ?? []

      participantsIds[id] = participantsSubEvent.map(({ _id }) => _id)
      reserveIds[id] = reserveSubEvent.map(({ _id }) => _id)
      participantsIdsAll = [...participantsIdsAll, ...participantsIds[id]]
      reserveIdsAll = [...reserveIdsAll, ...reserveIds[id]]

      eventUsersToUse[id] = [
        ...participantsSubEvent.map((user) => ({
          user,
          status: 'participant',
          userStatus: user.status,
          subEventId: id,
        })),
        ...reserveSubEvent.map((user) => ({
          user,
          status: 'reserve',
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
        {/* <div className="absolute z-50 top-1 right-11">
          <SortingButtonMenu
            sort={sort}
            onChange={setSort}
            sortKeys={['firstNameAndGender', 'createdAt']}
            showTitle
          />
        </div> */}
        {canEdit && isEventClosed && (
          <P className="text-danger">
            Мероприятие закрыто, поэтому редактирование состава участников
            запрещено
          </P>
        )}
        {canEdit && dataChanged && (
          <div
            className="flex items-center px-1 leading-[14px] cursor-pointer select-none gap-x-1 text-success"
            onClick={() => setDataChanged(false)}
          >
            <div>
              Обратите внимание! Данные были изменены с момента предыдущей
              загрузки. Отображены актуальные данные.
            </div>
            <FontAwesomeIcon
              className="w-4 h-4 min-w-4 min-h-4"
              icon={faTimesCircle}
            />
          </div>
        )}
        <TabContext value="Участники">
          <TabPanel
            tabName="Участники"
            tabAddToLabel={`(${participantsCount})`}
            className="flex flex-col mt-1 gap-y-5"
          >
            {event.subEvents.map((subEvent) => {
              const { id, title } = subEvent
              const otherSubEventsPartisipantsIds = event.subEvents.reduce(
                (sum, { id }) => {
                  if (id !== subEvent.id)
                    return [...sum, ...participantsIds[id]]
                  return sum
                },
                []
              )
              return (
                <Wrapper
                  key={'Участники' + id}
                  label={title || 'Основной тип участия'}
                >
                  {canEdit && (
                    <div className="flex justify-center">
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
                      ...reserveIdsAll,
                      ...assistantsIds,
                      ...bannedIds,
                      ...otherSubEventsPartisipantsIds,
                    ]}
                    canEdit={canEdit}
                    toReserveFunc={(newId) => {
                      setReserveState(id, [...reserveIds[id], newId])
                    }}
                    // itemChildren={
                    //   eventUsers
                    //     ? (user) => {
                    //         const eventUser = eventUsers.find(
                    //           ({ userId }) => userId === user._id
                    //         )
                    //         return (
                    //           <div className="text-xs font-normal tablet:text-sm">
                    //             <div className="leading-[14px]">
                    //               {formatDateTime(eventUser.createdAt)}
                    //             </div>
                    //           </div>
                    //         )
                    //       }
                    //     : undefined
                    // }
                  />
                </Wrapper>
              )
            })}
          </TabPanel>
          {canEdit && subEventsSummator(event.subEvents)?.isReserveActive && (
            <TabPanel
              tabName="Резерв"
              tabAddToLabel={`(${reserveCount})`}
              className="flex flex-col gap-y-5"
            >
              <Note noMargin>Резерв отсортирован по дате создания заявки</Note>
              {event.subEvents.map((subEvent) => {
                const { id, title } = subEvent

                const otherSubEventsReserveIds = event.subEvents.reduce(
                  (sum, { id }) => {
                    if (id !== subEvent.id) return [...sum, ...reserveIds[id]]
                    return sum
                  },
                  []
                )

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
                        ...participantsIdsAll,
                        ...assistantsIds,
                        ...bannedIds,
                        ...otherSubEventsReserveIds,
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
                      nameFieldWrapperClassName="pb-2 laptop:pb-0"
                      itemChildren={
                        eventUsers
                          ? (user) => {
                              const eventUser = eventUsers.find(
                                ({ userId }) => userId === user._id
                              )
                              return (
                                <div className="absolute bottom-0 max-h-[13px] flex justify-center items-end w-full text-xs font-normal">
                                  <div
                                    className={cn(
                                      'max-h-[13px] leading-[13px] border-t border-r border-l rounded-t-md px-2 border-gray-700',
                                      eventUser?.createdAt
                                        ? 'bg-teal-50'
                                        : 'bg-red-50'
                                    )}
                                  >
                                    {eventUser?.createdAt
                                      ? formatDateTime(eventUser.createdAt)
                                      : 'Запись еще не создана'}
                                  </div>
                                </div>
                              )
                            }
                          : undefined
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
            <EventsUsers
              event={event}
              modalTitle="Выбор ведущих"
              selectedIds={assistantsIds}
              setSelectedIds={setAssistantsState}
              exceptedIds={[
                ...participantsIdsAll,
                ...reserveIdsAll,
                ...bannedIds,
              ]}
              canEdit={canEdit}
              noButtons
            />
          </TabPanel>
          {canEdit && (
            <TabPanel
              tabName="Бан"
              tabAddToLabel={`(${bannedCount})`}
              className="flex flex-col mt-2 gap-y-5"
            >
              <EventsUsers
                event={event}
                modalTitle="Выбор забаненых участников"
                selectedIds={bannedIds}
                setSelectedIds={setBannedState}
                exceptedIds={[
                  ...participantsIdsAll,
                  ...reserveIdsAll,
                  ...assistantsIds,
                ]}
                canEdit={canEdit}
                noButtons
              />
            </TabPanel>
          )}
        </TabContext>
      </>
    )
  }

  const ModalRefresher = (props) => {
    const [isRefreshed, setIsRefreshed] = useState(false)
    const data = useRecoilValue(asyncEventsUsersByEventIdAtom(eventId))
    const [prevData, setPravData] = useState(data)
    const refreshEventState = useRecoilRefresher_UNSTABLE(
      asyncEventsUsersByEventIdAtom(eventId)
    )
    // const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleSelector)
    // const canEdit = loggedUserActiveRole?.eventsUsers?.edit

    useEffect(() => {
      refreshEventState()
      setIsRefreshed(true)
    }, [])

    const isDataChanged = JSON.stringify(prevData) !== JSON.stringify(data)
    return isRefreshed ? (
      <EventUsersModal {...props} isDataChanged={isDataChanged} />
    ) : null
  }

  return {
    title: `Участники мероприятия`,
    confirmButtonName: 'Применить',
    Children:
      // EventUsersModal,
      ModalRefresher,
  }
}

export default eventUsersFunc
