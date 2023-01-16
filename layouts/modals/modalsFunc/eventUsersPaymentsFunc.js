import React from 'react'

import { useRecoilValue } from 'recoil'
import eventSelector from '@state/selectors/eventSelector'
// import itemsFuncAtom from '@state/atoms/itemsFuncAtom'

// import { SelectUserList } from '@components/SelectItemList'
import eventAssistantsSelector from '@state/selectors/eventAssistantsSelector'
// import eventMansSelector from '@state/selectors/eventMansSelector'
// import eventWomansSelector from '@state/selectors/eventWomansSelector'
// import eventUsersInReserveSelector from '@state/selectors/eventUsersInReserveSelector'
// import eventUsersInBanSelector from '@state/selectors/eventUsersInBanSelector'

// import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import TabContext from '@components/Tabs/TabContext'
import TabPanel from '@components/Tabs/TabPanel'
// import { DEFAULT_EVENT } from '@helpers/constants'
// import usersAtom from '@state/atoms/usersAtom'
// import compareArrays from '@helpers/compareArrays'
// import {
//   faArrowAltCircleLeft,
//   faArrowAltCircleRight,
// } from '@fortawesome/free-regular-svg-icons'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import paymentsByEventIdSelector from '@state/selectors/paymentsByEventIdSelector'
// import userSelector from '@state/selectors/userSelector'
import cn from 'classnames'
import eventParticipantsSelector from '@state/selectors/eventParticipantsSelector'
import { modalsFuncAtom } from '@state/atoms'
import { PaymentItem, UserItem } from '@components/ItemCards'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '@components/Button'

const sortFunction = (a, b) => (a.firstName < b.firstName ? -1 : 1)

const UsersPayments = ({ event, users, defaultPayDirection }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const paymentsOfEvent = useRecoilValue(paymentsByEventIdSelector(event._id))

  return (
    <div className="flex flex-col gap-y-1">
      {users.map((user) => {
        const paymentsOfUser = paymentsOfEvent.filter(
          (payment) =>
            payment.userId === user._id &&
            (payment.payDirection === 'toUser' ||
              payment.payDirection === 'fromUser')
        )

        const sumOfPayments =
          paymentsOfUser.reduce(
            (p, payment) =>
              p +
              (payment.sum ?? 0) *
                (payment.payDirection === 'toUser' ||
                payment.payDirection === 'toEvent'
                  ? -1
                  : 1),
            0
          ) / 100

        const eventPriceForUser =
          (event.price -
            (typeof event.usersStatusDiscount[user.status ?? 'novice'] ===
            'number'
              ? event.usersStatusDiscount[user.status ?? 'novice']
              : 0)) /
          100

        const sumToPay = eventPriceForUser - sumOfPayments

        return (
          <div
            key={user._id}
            className="overflow-hidden border border-gray-700 rounded"
          >
            <div className="flex">
              <UserItem
                item={user}
                onClick={() => modalsFunc.user.view(user._id)}
              />
              <div className="flex flex-col items-center justify-center w-16 px-1 text-sm leading-4 border-l border-gray-700">
                <span
                  className={cn(
                    sumOfPayments === eventPriceForUser
                      ? 'text-success'
                      : sumOfPayments < eventPriceForUser
                      ? sumOfPayments === 0
                        ? 'text-danger'
                        : 'text-orange-500'
                      : 'text-blue-700'
                  )}
                >{`${sumOfPayments} ₽`}</span>
                <span className="w-full text-center border-gray-700 border-t-1">{`${eventPriceForUser} ₽`}</span>
              </div>
              <div
                className="flex items-center justify-center w-8 border-l border-gray-700 cursor-pointer group text-general"
                onClick={() => {
                  modalsFunc.payment.add(null, {
                    payDirection: defaultPayDirection,
                    sum: sumToPay * 100,
                    userId: user._id,
                    eventId: event._id,
                  })
                }}
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  className={cn('w-5 h-5 duration-300 group-hover:scale-125')}
                />
              </div>
            </div>
            {paymentsOfUser.length > 0 && (
              <div className="p-1 bg-opacity-50 border-t border-gray-700 rounded-b bg-general">
                {paymentsOfUser.map((payment) => (
                  <div
                    key={payment._id}
                    className="flex bg-white border-t border-l border-r border-gray-700 last:border-b-1"
                  >
                    <PaymentItem
                      item={payment}
                      noBorder
                      checkable={false}
                      onClick={() => {
                        modalsFunc.payment.edit(payment._id)
                      }}
                    />
                    <div
                      className="flex items-center justify-center w-8 border-l border-gray-700 cursor-pointer group text-danger"
                      onClick={() => {
                        modalsFunc.payment.delete(payment._id)
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        className={cn(
                          'w-5 h-5 duration-300 group-hover:scale-125'
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

const eventUsersPaymentsFunc = (eventId) => {
  const EventUsersPaymentsModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setOnlyCloseButtonShow,
  }) => {
    // const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)
    const event = useRecoilValue(eventSelector(eventId))
    const modalsFunc = useRecoilValue(modalsFuncAtom)
    // const setEventUsersId = useRecoilValue(itemsFuncAtom).event.setEventUsers
    // const users = useRecoilValue(usersAtom)
    const paymentsOfEvent = useRecoilValue(paymentsByEventIdSelector(eventId))

    // const sortUsersIds = (ids) =>
    //   [...users]
    //     .filter((user) => ids.includes(user._id))
    //     .sort(sortFunction)
    //     .map((user) => user._id)

    const eventAssistants = useRecoilValue(eventAssistantsSelector(eventId))
    const sortedEventAssistants = [...eventAssistants].sort(sortFunction)
    const sortedEventAssistantsIds = sortedEventAssistants.map(
      (user) => user._id
    )

    const eventParticipants = useRecoilValue(eventParticipantsSelector(eventId))
    const sortedEventParticipants = [...eventParticipants].sort(sortFunction)
    const sortedEventParticipantsIds = sortedEventParticipants.map(
      (user) => user._id
    )

    const sumOfPaymentsOfEventFromParticipants =
      paymentsOfEvent.reduce((p, payment) => {
        if (
          payment.payDirection !== 'toUser' &&
          payment.payDirection !== 'fromUser'
        )
          return p
        const isUserParticipant = sortedEventParticipantsIds.includes(
          payment.userId
        )
        if (isUserParticipant)
          return (
            p +
            (payment.sum ?? 0) * (payment.payDirection === 'toUser' ? -1 : 1)
          )

        return p
      }, 0) / 100

    const sumOfPaymentsOfEventToAssistants =
      paymentsOfEvent.reduce((p, payment) => {
        if (
          payment.payDirection !== 'toUser' &&
          payment.payDirection !== 'fromUser'
        )
          return p
        const isUserAssistant = sortedEventAssistantsIds.includes(
          payment.userId
        )
        if (isUserAssistant)
          return (
            p +
            (payment.sum ?? 0) * (payment.payDirection === 'toUser' ? -1 : 1)
          )

        return p
      }, 0) / 100

    const paymentsToEvent = paymentsOfEvent.filter(
      (payment) => payment.payDirection === 'toEvent'
    )

    const sumOfPaymentsToEvent =
      paymentsToEvent.reduce((p, payment) => p - (payment.sum ?? 0), 0) / 100

    const membersOfEventCount = eventParticipants.filter(
      (user) => user.status === 'member'
    ).length
    const noviceOfEventCount = eventParticipants.length - membersOfEventCount
    const paymentsToExpectFromParticipants =
      (event.price * eventParticipants.length -
        membersOfEventCount * (event.usersStatusDiscount?.member ?? 0) -
        noviceOfEventCount * (event.usersStatusDiscount?.novice ?? 0)) /
      100

    const totalIncome =
      sumOfPaymentsOfEventFromParticipants +
      sumOfPaymentsOfEventToAssistants +
      sumOfPaymentsToEvent

    const expectedIncome =
      paymentsToExpectFromParticipants +
      sumOfPaymentsOfEventToAssistants +
      sumOfPaymentsToEvent
    // const eventReservedParticipants = useRecoilValue(
    //   eventUsersInReserveSelector(eventId)
    // )
    // const sortedEventReservedParticipantsIds = [...eventReservedParticipants]
    //   // .sort(sortFunction)
    //   .map((user) => user._id)

    // const eventBannedParticipants = useRecoilValue(
    //   eventUsersInBanSelector(eventId)
    // )
    // const sortedEventBannedParticipantsIds = [...eventBannedParticipants]
    //   .sort(sortFunction)
    //   .map((user) => user._id)

    // const [assistantsIds, setAssistantsIds] = useState(sortedEventAssistantsIds)
    // // const [participantsIds, setParticipantsIds] = useState(sortedEventParticipantsIds)
    // const [reservedParticipantsIds, setReservedParticipantsIds] = useState(
    //   sortedEventReservedParticipantsIds
    // )
    // const [bannedParticipantsIds, setBannedParticipantsIds] = useState(
    //   sortedEventBannedParticipantsIds
    // )

    // const onClickConfirm = async () => {
    //   closeModal()
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
    //   const usersStatuses = [
    //     ...filteredAssistantsIds.map((userId) => {
    //       return { userId, status: 'assistant' }
    //     }),
    //     ...filteredParticipantsIds.map((userId) => {
    //       return { userId, status: 'participant' }
    //     }),
    //     ...filteredReservedParticipantsIds.map((userId) => {
    //       return { userId, status: 'reserve' }
    //     }),
    //     ...filteredBannedParticipantsIds.map((userId) => {
    //       return { userId, status: 'ban' }
    //     }),
    //   ]
    //   setEventUsersId(eventId, usersStatuses)
    // }

    // useEffect(() => {
    //   const isFormChanged =
    //     !compareArrays(assistantsIds, sortedEventAssistantsIds) ||
    //     !compareArrays(usersIds, sortedEventUsersIds) ||
    //     !compareArrays(
    //       reservedParticipantsIds,
    //       sortedEventReservedParticipantsIds
    //     ) ||
    //     !compareArrays(bannedParticipantsIds, sortedEventBannedParticipantsIds)

    //   setOnShowOnCloseConfirmDialog(isFormChanged)
    //   setDisableConfirm(!isFormChanged)
    //   setOnConfirmFunc(onClickConfirm)
    //   if (!isLoggedUserAdmin) setOnlyCloseButtonShow(true)
    // }, [
    //   usersIds,
    //   assistantsIds,
    //   reservedParticipantsIds,
    //   bannedParticipantsIds,
    // ])

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

    const TotalFromParticipants = () => (
      <div className="flex gap-x-1">
        <span>Всего получено от участников:</span>
        <span
          className={cn(
            'font-bold',
            sumOfPaymentsOfEventFromParticipants ===
              paymentsToExpectFromParticipants
              ? 'text-success'
              : sumOfPaymentsOfEventFromParticipants <
                paymentsToExpectFromParticipants
              ? sumOfPaymentsOfEventFromParticipants === 0
                ? 'text-danger'
                : 'text-orange-500'
              : 'text-blue-700'
          )}
        >{`${sumOfPaymentsOfEventFromParticipants} ₽`}</span>
        <span>/</span>
        <span className="font-bold">{`${paymentsToExpectFromParticipants} ₽`}</span>
      </div>
    )

    const TotalToAssistants = () => (
      <div className="flex gap-x-1">
        <span>Всего затрат на ведущих и ассистентов:</span>
        <span
          className={cn(
            'font-bold',
            sumOfPaymentsOfEventToAssistants === 0
              ? 'text-success'
              : sumOfPaymentsOfEventToAssistants > 0
              ? 'text-blue-700'
              : 'text-danger'
          )}
        >{`${sumOfPaymentsOfEventToAssistants} ₽`}</span>
      </div>
    )

    const TotalToEvent = () => (
      <div className="flex gap-x-1">
        <span>Всего затрат на расходники и организацию:</span>
        <span
          className={cn(
            'font-bold',
            sumOfPaymentsToEvent === 0
              ? 'text-success'
              : sumOfPaymentsToEvent > 0
              ? 'text-blue-700'
              : 'text-danger'
          )}
        >{`${sumOfPaymentsToEvent} ₽`}</span>
      </div>
    )

    return (
      <TabContext value="Участники">
        <TabPanel
          tabName="Участники"
          tabAddToLabel={`${sumOfPaymentsOfEventFromParticipants} ₽`}
        >
          <UsersPayments
            event={event}
            users={sortedEventParticipants}
            defaultPayDirection="fromUser"
          />
          <TotalFromParticipants />
        </TabPanel>
        <TabPanel
          tabName="Ведущие"
          tabAddToLabel={`${sumOfPaymentsOfEventToAssistants} ₽`}
        >
          <UsersPayments
            event={event}
            users={sortedEventAssistants}
            defaultPayDirection="toUser"
          />
          <TotalToAssistants />
        </TabPanel>
        <TabPanel
          tabName="Прочие затраты"
          tabAddToLabel={`${sumOfPaymentsToEvent} ₽`}
        >
          <Button
            name="Добавить затраты"
            onClick={() =>
              modalsFunc.payment.add(null, {
                payDirection: 'toEvent',
                eventId: event._id,
              })
            }
          />
          {paymentsToEvent.length > 0 && (
            <div className="p-1 bg-opacity-50 border-t border-gray-700 rounded-b bg-general">
              {paymentsToEvent.map((payment) => (
                <div
                  key={payment._id}
                  className="flex bg-white border-t border-l border-r border-gray-700 last:border-b-1"
                >
                  <PaymentItem
                    item={payment}
                    noBorder
                    checkable={false}
                    onClick={() => {
                      modalsFunc.payment.edit(payment._id)
                    }}
                  />
                  <div
                    className="flex items-center justify-center w-8 border-l border-gray-700 cursor-pointer group text-danger"
                    onClick={() => {
                      modalsFunc.payment.delete(payment._id)
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      className={cn(
                        'w-5 h-5 duration-300 group-hover:scale-125'
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          <TotalToEvent />
        </TabPanel>
        <TabPanel tabName="Сводка" tabAddToLabel={`${totalIncome} ₽`}>
          <TotalFromParticipants />
          <TotalToAssistants />
          <TotalToEvent />
          <div className="flex gap-x-1">
            <span>Текущая прибыль:</span>
            <span
              className={cn(
                'font-bold',
                totalIncome <= 0 ? 'text-danger' : 'text-success'
              )}
            >{`${totalIncome} ₽`}</span>
          </div>
          <div className="flex gap-x-1">
            <span>Ожидаемая прибыль:</span>
            <span
              className={cn(
                'font-bold',
                expectedIncome <= 0 ? 'text-danger' : 'text-success'
              )}
            >{`${expectedIncome} ₽`}</span>
          </div>
        </TabPanel>
      </TabContext>
    )
  }

  return {
    title: `Финансы мероприятия`,
    confirmButtonName: 'Применить',
    Children: EventUsersPaymentsModal,
  }
}

export default eventUsersPaymentsFunc