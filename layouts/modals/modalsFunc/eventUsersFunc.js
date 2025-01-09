import CardButton from '@components/CardButton'
import EventUsersCounterAndAge from '@components/EventUsersCounterAndAge'
import InputWrapper from '@components/InputWrapper'
// import { SelectUserList } from '@components/SelectItemList'
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
import modalsFuncAtom from '@state/atoms/modalsFuncAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
// import usersAtomAsync from '@state/async/usersAtomAsync'
// import eventFullAtomAsync from '@state/async/eventFullAtomAsync'
import eventsUsersFullByEventIdSelector from '@state/selectors/eventsUsersFullByEventIdSelector'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import eventSelector from '@state/selectors/eventSelector'
import sortFunctions from '@helpers/sortFunctions'
import formatDateTime from '@helpers/formatDateTime'
// import Note from '@components/Note'
import cn from 'classnames'
import { faHistory } from '@fortawesome/free-solid-svg-icons/faHistory'
import CheckBox from '@components/CheckBox'
import { UserItem } from '@components/ItemCards'
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import Tooltip from '@components/Tooltip'

const ItemButton = ({
  onClick,
  icon,
  iconClassName,
  tooltip,
  text,
  textClassName,
  thin,
}) => (
  <div className="flex items-center justify-center bg-gray-100 border-l border-gray-700 hover:bg-blue-200">
    <Tooltip title={tooltip}>
      <button
        onClick={onClick}
        className={cn(
          'flex items-center justify-center gap-x-0.5 h-full rounded-r shadow-sm group whitespace-nowrap font-futuraDemi cursor-pointer',
          thin ? 'px-1' : 'px-1.5'
        )}
      >
        {icon ? (
          <FontAwesomeIcon
            className={cn(
              'w-4 h-4 duration-300 group-hover:scale-125',
              iconClassName
            )}
            icon={icon}
          />
        ) : null}
        {text ? <div className={cn(textClassName)}>{text}</div> : null}
      </button>
    </Tooltip>
  </div>
)

const EventUsers2 = ({
  event,
  selectedUsers,
  setSelectedUsers,
  readOnly,
  toReserveFunc,
  fromReserveFunc,
  exceptedIds,
  subEventId,
  onChangeSubEvent,
}) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const addRow = () => {
    modalsFunc.selectUsers(
      selectedUsers,
      null,
      setSelectedUsers,
      exceptedIds
      // acceptedIds,
      // maxItems,
      // canSelectNone,
      // modalTitle,
      // showCountNumber
    )
  }

  return (
    <div
      name="itemsIds"
      className={cn(
        'flex flex-col flex-wrap-reverse bg-gray-100 border rounded-sm overflow-hidden',
        // required && (itemsId.length === 0 || itemsId[0] === '?')
        //   ? 'border-red-700'
        //   : 'border-gray-700',
        'border-gray-700'
      )}
    >
      {selectedUsers.map((user, index) => (
        <div
          key={user._id}
          className={cn('flex', {
            'border-b last:border-b-0 border-gray-700':
              index < selectedUsers.length,
          })}
        >
          <UserItem
            item={user}
            onClick={() => modalsFunc.user.view(user._id)}
            nameFieldWrapperClassName={
              user.eventUserCreatedAt ? 'pb-2' : undefined
            }
            noBorder
            // {...props}
          >
            {!readOnly &&
              (() => (
                <div className="absolute bottom-0 max-h-[13px] flex justify-center items-end w-full text-xs font-normal">
                  <div
                    className={cn(
                      'max-h-[13px] leading-[13px] border-t border-r border-l rounded-t-md px-2 border-gray-700',
                      user.eventUserCreatedAt ? 'bg-teal-50' : 'bg-red-50'
                    )}
                  >
                    {user.eventUserCreatedAt
                      ? formatDateTime(user.eventUserCreatedAt)
                      : 'Запись еще не создана'}
                  </div>
                </div>
              ))}
          </UserItem>
          {!readOnly && event.subEvents.length > 1 ? (
            <ItemButton
              onClick={() =>
                modalsFunc.eventUser.editSubEvent(
                  {
                    eventId: event._id,
                    userId: user._id,
                  },
                  ({ eventId, userId, subEventId }) => {
                    onChangeSubEvent(user, subEventId)
                  },
                  subEventId
                )
              }
              icon={faStreetView}
              iconClassName="text-blue-600"
              tooltip="Изменить вариант участия"
            />
          ) : undefined}

          {!readOnly && toReserveFunc ? (
            <ItemButton
              onClick={() => {
                setSelectedUsers(
                  selectedUsers.filter(({ _id }) => _id !== user._id)
                )
                toReserveFunc(user)
              }}
              icon={faArrowAltCircleRight}
              iconClassName="text-general"
              tooltip="Перенести в резерв"
            />
          ) : undefined}

          {!readOnly && fromReserveFunc ? (
            <ItemButton
              onClick={() => {
                fromReserveFunc(user)
                setSelectedUsers(
                  selectedUsers.filter(({ _id }) => _id !== user._id)
                )
              }}
              icon={faArrowAltCircleLeft}
              iconClassName="text-general"
              tooltip="Перенести в активный состав"
            />
          ) : undefined}
          {!readOnly && (
            <ItemButton
              tooltip="Удалить из списка"
              onClick={() =>
                setSelectedUsers(
                  selectedUsers.filter(({ _id }) => _id !== user._id)
                )
              }
              icon={faTimes}
              iconClassName="text-red-700"
            />
          )}
        </div>
      ))}
      {!readOnly && (
        <div
          onClick={addRow}
          className={cn(
            'group flex items-center justify-center h-6 bg-white',
            selectedUsers.length > 0 ? 'rounded-b' : 'rounded-sm',
            'cursor-pointer'
          )}
        >
          <div
            className={cn(
              'flex items-center justify-center transparent duration-200 group-hover:scale-110'
            )}
          >
            <FontAwesomeIcon className="w-5 h-5 text-gray-700" icon={faPlus} />
          </div>
        </div>
      )}
    </div>
  )
}
// const EventsUsers = ({
//   event,
//   label,
//   modalTitle,
//   selectedIds = [],
//   setSelectedIds,
//   exceptedIds,
//   canEdit,
//   toReserveFunc,
//   fromReserveFunc,
//   noButtons,
//   itemChildren,
//   nameFieldWrapperClassName,
//   createdAtObject,
// }) => {
//   const modalsFunc = useAtomValue(modalsFuncAtom)

//   const isEventClosed = isEventClosedFunc(event)

//   return (
//     <>
//       <SelectUserList
//         showCounter={false}
//         className="w-full"
//         filter={{ gender: { operand: '!==', value: null } }}
//         label={label}
//         modalTitle={modalTitle}
//         usersId={selectedIds}
//         onChange={setSelectedIds}
//         exceptedIds={exceptedIds}
//         readOnly={!canEdit || isEventClosed}
//         itemChildren={
//           createdAtObject
//             ? (user) => {
//                 return (
//                   <div className="absolute bottom-0 max-h-[13px] flex justify-center items-end w-full text-xs font-normal">
//                     <div
//                       className={cn(
//                         'max-h-[13px] leading-[13px] border-t border-r border-l rounded-t-md px-2 border-gray-700',
//                         createdAtObject[user._id] ? 'bg-teal-50' : 'bg-red-50'
//                       )}
//                     >
//                       {createdAtObject[user._id]
//                         ? formatDateTime(createdAtObject[user._id])
//                         : 'Запись еще не создана'}
//                     </div>
//                   </div>
//                 )
//               }
//             : undefined
//         }
//         nameFieldWrapperClassName={createdAtObject ? 'pb-2' : undefined}
//         buttons={
//           !noButtons && canEdit && !isEventClosed
//             ? [
//                 event.subEvents.length > 1
//                   ? (id) => ({
//                       onClick: () => {
//                         modalsFunc.eventUser.editSubEvent({
//                           eventId: event._id,
//                           userId: id,
//                         })
//                       },
//                       icon: faStreetView,
//                       iconClassName: 'text-blue-600',
//                       tooltip: 'Изменить вариант участия',
//                     })
//                   : undefined,
//                 toReserveFunc
//                   ? (id) => ({
//                       onClick: () => {
//                         setSelectedIds(
//                           selectedIds.filter((userId) => userId !== id)
//                         )
//                         toReserveFunc(id)
//                         // setReservedParticipantsIds(
//                         //   sortUsersIds([...reservedParticipantsIds, id])
//                         // )
//                       },
//                       icon: faArrowAltCircleRight,
//                       iconClassName: 'text-general',
//                       tooltip: 'Перенести в резерв',
//                     })
//                   : undefined,
//                 fromReserveFunc
//                   ? (id) => ({
//                       onClick: () => {
//                         fromReserveFunc(id)
//                         // setSelectedIds([...selectedIds, id])
//                         setSelectedIds(
//                           selectedIds.filter((userId) => userId !== id)
//                         )
//                       },
//                       icon: faArrowAltCircleLeft,
//                       iconClassName: 'text-general',
//                       tooltip: 'Перенести в активный состав',
//                     })
//                   : undefined,
//               ]
//             : []
//         }
//       />
//     </>
//   )
// }

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
    const modalsFunc = useAtomValue(modalsFuncAtom)
    const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
    const statusEdit = loggedUserActiveRole?.events?.statusEdit
    const canEdit = loggedUserActiveRole?.eventsUsers?.edit
    const seeHistory = loggedUserActiveRole?.eventsUsers?.seeHistory
    const copyListToClipboard =
      loggedUserActiveRole?.eventsUsers?.copyListToClipboard

    const [dataChanged, setDataChanged] = useState(isDataChanged)
    const [isSortingByGenderAndName, setIsSortingByGenderAndName] =
      useState(true)
    // const [sortType, setSortType] = useState('name')
    // const [sort, setSort] = useState({ genderAndFirstName: 'asc' })
    // const sortFunc = useMemo(() => sortFuncGenerator(sort), [sort])

    const event = useAtomValue(eventSelector(eventId))
    const setEventUsersId = useAtomValue(itemsFuncAtom).event.setEventUsers
    // const users = useAtomValue(usersAtomAsync)
    const isEventClosed = isEventClosedFunc(event)

    const showLikes = loggedUserActiveRole?.events?.editLikes && event.likes

    // const sortedUsers = useMemo(
    //   () => [...users].sort(sortFunctions.genderAndFirstName.asc),
    //   [users]
    // )

    const eventUsers = useAtomValue(eventsUsersFullByEventIdSelector(eventId))
    const eventUsersCreatedAtObject = useMemo(
      () =>
        eventUsers.reduce((acc, { createdAt, userId }) => {
          acc[userId] = createdAt
          return acc
        }, {}),
      [eventUsers]
    )

    // const filteredUsers = useMemo(
    //   () => eventUsers.map(({ user }) => user),
    //   [eventUsers]
    // )

    // const sortUsersByIds = useCallback(
    //   (ids) =>
    //     users
    //       .filter((user) => ids.includes(user._id))
    //       .map((user) => ({
    //         ...user,
    //         eventUserCreatedAt: eventUsersCreatedAtObject[user._id],
    //       })),
    //   [users]
    // )

    // const sortUsersByCreatedAt = useCallback(
    //   (ids) => {
    //     const filteredUsers = users.filter((user) => ids.includes(user._id))
    //     const filteredEventUsers = filteredUsers.map((user) => ({
    //       ...(eventUsers.find(({ userId }) => userId === user._id) || { user }),
    //       eventUserCreatedAt: eventUsersCreatedAtObject[user._id],
    //     }))
    //     filteredEventUsers.sort(sortFunctions.eventUserCreatedAt.asc)
    //     const result = filteredEventUsers.map(({ user }) => user)
    //     return result
    //   },
    //   [users]
    // )

    const sortUsersByGenderAndFirstNameFull = useCallback((selectedUsers) => {
      // const filteredUsers = users.filter((user) => ids.includes(user._id))
      const updatedUsers = selectedUsers.map((user) => ({
        ...user,
        eventUserCreatedAt: eventUsersCreatedAtObject[user._id],
      }))
      return updatedUsers.toSorted(sortFunctions.genderAndFirstName.asc)
    }, [])

    const sortUsersByCreatedAtFull = useCallback((selectedUsers) => {
      // const filteredUsers = users.filter((user) => ids.includes(user._id))
      const updatedUsers = selectedUsers.map((user) => ({
        ...user,
        eventUserCreatedAt: eventUsersCreatedAtObject[user._id],
      }))
      return updatedUsers.toSorted(sortFunctions.eventUserCreatedAt.asc)
    }, [])

    // const sortFunc = useMemo(
    //   () => (isSortingByGenderAndName ? sortUsersByIds : sortUsersByCreatedAt),
    //   [isSortingByGenderAndName]
    // )

    const sortFuncFull = useMemo(
      () =>
        isSortingByGenderAndName
          ? sortUsersByGenderAndFirstNameFull
          : sortUsersByCreatedAtFull,
      [isSortingByGenderAndName]
    )

    const sortAllByCreatedAt = useCallback((sortByCreatedAt) => {
      const sortFunc = sortByCreatedAt
        ? sortFunctions.eventUserCreatedAt.asc
        : sortFunctions.genderAndFirstName.asc
      setParticipants((state) => {
        const tempParticipant = {}
        for (const participantKey in state) {
          tempParticipant[participantKey] =
            state[participantKey].toSorted(sortFunc)
        }
        return tempParticipant
      })
      // setReserve((state) => {
      //   const tempReserve = { ...state }
      //   for (const reserveKey in tempReserve) {
      //     tempReserve[reserveKey] = sortFunc(tempReserve[reserveKey])
      //   }
      //   return tempReserve
      // })
      setAssistants((state) => state.toSorted(sortFunc))
      // setBanned((state) => sortFunc(state))
    }, [])

    const sortedEventUsersParticipants = useMemo(
      () =>
        [...eventUsers.filter(({ status }) => status === 'participant')].sort(
          // isSortingByGenderAndName
          //   ?
          (a, b) => sortFunctions.genderAndFirstName.asc(a.user, b.user)
          //   :
          // sortFunctions.createdAt.asc
        ),
      [
        eventUsers,
        // isSortingByGenderAndName
      ]
    )

    const sortedEventUsersReserve = useMemo(
      () =>
        [...eventUsers.filter(({ status }) => status === 'reserve')].sort(
          // isSortingByGenderAndName
          //   ?
          (a, b) => sortFunctions.genderAndFirstName.asc(a.user, b.user)
          // : sortFunctions.createdAt.asc
        ),
      [
        eventUsers,
        // isSortingByGenderAndName
      ]
    )

    const arrayAssistants = useMemo(
      () =>
        [...eventUsers.filter(({ status }) => status === 'assistant')]
          .sort(
            // isSortingByGenderAndName
            // ?
            (a, b) => sortFunctions.genderAndFirstName.asc(a.user, b.user)
            // : sortFunctions.createdAt.asc
          )
          .map(({ user, createdAt }) => ({
            ...user,
            eventUserCreatedAt: createdAt,
          })),
      [
        eventUsers,
        // isSortingByGenderAndName
      ]
    )

    const arrayBanned = useMemo(
      () =>
        [...eventUsers.filter(({ status }) => status === 'ban')]
          .sort(
            // isSortingByGenderAndName
            // ?
            (a, b) => sortFunctions.genderAndFirstName.asc(a.user, b.user)
            // : sortFunctions.createdAt.asc
          )
          .map(({ user, createdAt }) => ({
            ...user,
            eventUserCreatedAt: createdAt,
          })),
      [
        eventUsers,
        // , isSortingByGenderAndName
      ]
    )

    const objParticipants = useMemo(
      () =>
        arrayToObjectArray(
          sortedEventUsersParticipants,
          'subEventId',
          true,
          event._id,
          ({ user, createdAt }) => ({ ...user, eventUserCreatedAt: createdAt })
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
          ({ user, createdAt }) => ({ ...user, eventUserCreatedAt: createdAt })
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
            {seeHistory && (
              <CardButton
                icon={faHistory}
                onClick={() => {
                  modalsFunc.event.historyEventUsers(event._id)
                }}
                color="orange"
                tooltipText="История записей"
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

    // const setParticipantsState = (subEventId, ids) => {
    //   setParticipants((state) => ({
    //     ...state,
    //     [subEventId]: sortFunc(ids),
    //   }))
    // }

    // const setReserveState = (subEventId, ids) => {
    //   setReserve((state) => ({
    //     ...state,
    //     [subEventId]: sortFunc(ids),
    //   }))
    // }

    const setParticipantsStateFull = (subEventId, users) => {
      setParticipants((state) => ({
        ...state,
        [subEventId]: sortFuncFull(users),
      }))
    }

    const setReserveStateFull = (subEventId, users) => {
      setReserve((state) => ({
        ...state,
        [subEventId]: sortFuncFull(users),
      }))
    }

    // const setAssistantsState = (ids) => setAssistants(sortFunc(ids))

    const setAssistantsStateFull = (users) => setAssistants(sortFuncFull(users))

    // const setBannedState = (ids) => setBanned(sortFunc(ids))

    const setBannedStateFull = (users) => setBanned(sortFuncFull(users))

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
                wrapperClassName="flex flex-col items-stretch gap-y-1.5"
              >
                {children}
              </InputWrapper>
            )
          : ({ children }) => (
              <div className="flex flex-col items-stretch gap-y-1.5">
                {children}
              </div>
            ),
      [event]
    )

    return (
      <>
        {/* <div className="absolute z-50 top-1 right-11">
          <SortingButtonMenu
            sort={sort}
            onChange={setSort}
            sortKeys={['genderAndFirstName', 'createdAt']}
            showTitle
          />
        </div> */}
        {canEdit && (
          <CheckBox
            label="Сортировать по дате создания записи"
            checked={!isSortingByGenderAndName}
            onChange={() => {
              sortAllByCreatedAt(isSortingByGenderAndName)
              setIsSortingByGenderAndName((checked) => !checked)
            }}
          />
        )}
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
                  <EventUsers2
                    modalTitle="Выбор участников"
                    selectedUsers={participants[id] ?? []}
                    event={event}
                    setSelectedUsers={(selectedUsers) =>
                      setParticipantsStateFull(id, selectedUsers)
                    }
                    toReserveFunc={(newUser) => {
                      setReserveStateFull(id, [...(reserve[id] || []), newUser])
                    }}
                    readOnly={!canEdit}
                    exceptedIds={[
                      ...reserveIdsAll,
                      ...assistantsIds,
                      ...bannedIds,
                      ...otherSubEventsPartisipantsIds,
                    ]}
                    subEventId={id}
                    onChangeSubEvent={(user, newSubEventId) => {
                      setParticipantsStateFull(
                        id,
                        participants[id].filter(({ _id }) => _id !== user._id)
                      )
                      setParticipantsStateFull(newSubEventId, [
                        ...participants[newSubEventId],
                        user,
                      ])
                    }}
                  />
                  {/* <EventsUsers
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
                    createdAtObject={
                      canEdit ? eventUsersCreatedAtObject : undefined
                    }
                  /> */}
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
                    <EventUsers2
                      modalTitle="Выбор резерва"
                      selectedUsers={reserve[id] ?? []}
                      event={event}
                      setSelectedUsers={(selectedUsers) =>
                        setReserveStateFull(id, selectedUsers)
                      }
                      fromReserveFunc={(newUser) => {
                        setParticipantsStateFull(id, [
                          ...(participants[id] || []),
                          newUser,
                        ])
                      }}
                      readOnly={!canEdit}
                      exceptedIds={[
                        ...participantsIdsAll,
                        ...assistantsIds,
                        ...bannedIds,
                        ...otherSubEventsReserveIds,
                      ]}
                      subEventId={id}
                      onChangeSubEvent={(user, newSubEventId) => {
                        setReserveStateFull(
                          id,
                          reserve[id].filter(({ _id }) => _id !== user._id)
                        )
                        setReserveStateFull(newSubEventId, [
                          ...reserve[newSubEventId],
                          user,
                        ])
                      }}
                    />
                    {/* <EventsUsers
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
                      createdAtObject={eventUsersCreatedAtObject}
                    /> */}
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
            <EventUsers2
              modalTitle="Выбор ведущих"
              selectedUsers={assistants ?? []}
              setSelectedUsers={(selectedUsers) =>
                setAssistantsStateFull(selectedUsers)
              }
              event={event}
              readOnly={!canEdit}
              exceptedIds={[
                ...participantsIdsAll,
                ...reserveIdsAll,
                ...bannedIds,
              ]}
            />
            {/* <EventsUsers
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
            /> */}
          </TabPanel>
          {canEdit && (
            <TabPanel
              tabName="Бан"
              tabAddToLabel={`(${bannedCount})`}
              className="flex flex-col mt-2 gap-y-5"
            >
              <EventUsers2
                modalTitle="Выбор забаненых участников"
                selectedUsers={banned ?? []}
                setSelectedUsers={(selectedUsers) =>
                  setBannedStateFull(selectedUsers)
                }
                event={event}
                readOnly={!canEdit}
                exceptedIds={[
                  ...participantsIdsAll,
                  ...reserveIdsAll,
                  ...assistantsIds,
                ]}
              />
              {/* <EventsUsers
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
              /> */}
            </TabPanel>
          )}
        </TabContext>
      </>
    )
  }

  const ModalRefresher = (props) => {
    const [isRefreshed, setIsRefreshed] = useState(false)
    const [data, refreshEventState] = useAtom(
      asyncEventsUsersByEventIdAtom(eventId)
    )
    const [prevData, setPravData] = useState(data)
    // const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
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
