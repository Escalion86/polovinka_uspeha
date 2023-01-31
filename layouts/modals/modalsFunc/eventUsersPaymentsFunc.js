import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import eventSelector from '@state/selectors/eventSelector'
import eventAssistantsSelector from '@state/selectors/eventAssistantsSelector'

import TabContext from '@components/Tabs/TabContext'
import TabPanel from '@components/Tabs/TabPanel'
import {
  faAngleDown,
  faCertificate,
  faLock,
  faPlay,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import paymentsByEventIdSelector from '@state/selectors/paymentsByEventIdSelector'
import cn from 'classnames'
import eventParticipantsSelector from '@state/selectors/eventParticipantsSelector'
import { modalsFuncAtom } from '@state/atoms'
import { PaymentItem, UserItem } from '@components/ItemCards'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '@components/Button'
import { motion } from 'framer-motion'
import sumOfPaymentsToAssistantsSelector from '@state/selectors/sumOfPaymentsToAssistantsSelector'
import sumOfCouponsFromParticipantsSelector from '@state/selectors/sumOfCouponsFromParticipantsSelector'
import sumOfPaymentsFromParticipantsSelector from '@state/selectors/sumOfPaymentsFromParticipantsSelector'
import sumOfPaymentsToEventSelector from '@state/selectors/sumOfPaymentsToEventSelector'
import paymentsToEventSelector from '@state/selectors/paymentsToEventSelector'
import sumOfExpectingPaymentsFromParticipantsSelector from '@state/selectors/sumOfExpectingPaymentsFromParticipantsSelector'
import totalIncomeOfEventSelector from '@state/selectors/totalIncomeOfEventSelector'
import expectedIncomeOfEventSelector from '@state/selectors/expectedIncomeOfEventSelector'
import isEventClosedFunc from '@helpers/isEventClosed'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import { P } from '@components/tags'
import sumOfPaymentsFromEventSelector from '@state/selectors/sumOfPaymentsFromEventSelector'
import paymentsFromEventSelector from '@state/selectors/paymentsFromEventSelector'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import eventParticipantsFullByEventIdSelector from '@state/selectors/eventParticipantsFullByEventIdSelector'
import eventAssistantsFullByEventIdSelector from '@state/selectors/eventAssistantsFullByEventIdSelector'
import UserStatusIcon from '@components/UserStatusIcon'
import isEventExpiredFunc from '@helpers/isEventExpired'

const sortFunction = (a, b) => (a.firstName < b.firstName ? -1 : 1)

const UsersPayments = ({
  event,
  users,
  eventUsers,
  defaultPayDirection,
  noEventPriceForUser,
  readOnly = false,
}) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const paymentsOfEvent = useRecoilValue(paymentsByEventIdSelector(event._id))

  return (
    <div className="flex flex-col gap-y-1">
      {eventUsers.map(
        ({
          _id,
          user,
          // event,
          userStatus,
          eventSubtypeNum,
          comment,
        }) => {
          const [isCollapsed, setIsCollapsed] = useState(true)
          const allPaymentsOfUser = paymentsOfEvent.filter(
            (payment) =>
              payment.userId === user._id &&
              (payment.payDirection === 'toUser' ||
                payment.payDirection === 'fromUser')
          )

          const couponsOfUser = allPaymentsOfUser.filter(
            (payment) => payment.payType === 'coupon'
          )
          const paymentsOfUser = allPaymentsOfUser.filter(
            (payment) => payment.payType !== 'coupon'
          )

          const sumOfCoupons =
            couponsOfUser.reduce(
              (p, payment) =>
                p +
                (payment.sum ?? 0) *
                  (payment.payDirection === 'toUser' ||
                  payment.payDirection === 'toEvent'
                    ? -1
                    : 1),
              0
            ) / 100

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

          const userDiscount =
            event.usersStatusDiscount[
              userStatus
                ? userStatus
                : !user?.status || user.status === 'ban'
                ? 'novice'
                : user.status
            ]

          const eventPriceForUser = noEventPriceForUser
            ? 0
            : (event.price -
                (typeof userDiscount === 'number' ? userDiscount : 0)) /
                100 -
              sumOfCoupons

          const sumToPay = eventPriceForUser - sumOfPayments

          useEffect(() => {
            if (paymentsOfUser.length === 0) setIsCollapsed(true)
          }, [paymentsOfUser.length])

          return (
            <div
              key={user._id}
              className="overflow-hidden border border-gray-700 rounded"
            >
              <div className="flex">
                <div className="flex-1">
                  <UserItem
                    item={user}
                    onClick={() => modalsFunc.user.view(user._id)}
                    noBorder
                  />
                </div>
                <div
                  className="hover:bg-blue-200 cursor-pointer flex flex-col items-center justify-center text-sm leading-4 border-l border-gray-700 min-w-[80px]"
                  onClick={() => modalsFunc.eventUser.editStatus(_id)}
                >
                  <span
                    className={cn(
                      'px-1 whitespace-nowrap',
                      noEventPriceForUser
                        ? sumOfPayments === 0
                          ? 'text-success'
                          : 'text-danger'
                        : sumOfPayments === eventPriceForUser
                        ? 'text-success'
                        : sumOfPayments < eventPriceForUser
                        ? sumOfPayments === 0
                          ? 'text-danger'
                          : 'text-orange-500'
                        : 'text-blue-700'
                    )}
                  >{`${sumOfPayments} ₽`}</span>
                  {!noEventPriceForUser && (
                    <div
                      className={cn(
                        'px-1 w-full min-w-min flex gap-x-0.5 items-center justify-center border-gray-700 border-t-1 whitespace-nowrap',
                        sumOfCoupons > 0 ? 'text-general' : 'text-black'
                      )}
                    >
                      {sumOfCoupons > 0 && (
                        <div className="flex items-center justify-center w-3 min-w-3">
                          <FontAwesomeIcon
                            icon={faCertificate}
                            className="w-3 min-w-3"
                          />
                        </div>
                      )}
                      <div className="min-w-3">
                        <UserStatusIcon status={userStatus} size="xs" />
                      </div>
                      <span>{`${eventPriceForUser} ₽`}</span>
                    </div>
                  )}
                </div>
                {!readOnly && (
                  <div
                    className="flex items-center justify-center w-8 border-l border-gray-700 cursor-pointer group text-general"
                    onClick={() => {
                      modalsFunc.payment.add(null, {
                        payDirection: defaultPayDirection,
                        sum: noEventPriceForUser ? 0 : sumToPay * 100,
                        userId: user._id,
                        eventId: event._id,
                      })
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faPlus}
                      className={cn(
                        'w-5 h-5 duration-300 group-hover:scale-125'
                      )}
                    />
                  </div>
                )}
                <div
                  className={cn(
                    'flex items-center justify-center w-8 border-l border-gray-700',
                    allPaymentsOfUser.length > 0
                      ? 'text-black cursor-pointer'
                      : 'text-gray-300 cursor-not-allowed'
                  )}
                  onClick={() => {
                    allPaymentsOfUser.length > 0 &&
                      setIsCollapsed((state) => !state)
                  }}
                >
                  <div
                    className={cn('w-4 duration-300 transition-transform', {
                      'rotate-180': isCollapsed,
                    })}
                  >
                    <FontAwesomeIcon icon={faAngleDown} size="lg" />
                  </div>
                </div>
              </div>
              {allPaymentsOfUser.length > 0 && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: isCollapsed ? 0 : 'auto' }}
                >
                  <div className="p-1 bg-opacity-50 border-t border-gray-700 rounded-b bg-general">
                    {allPaymentsOfUser.map((payment) => (
                      <div
                        key={payment._id}
                        className="flex bg-white border-t border-l border-r border-gray-700 last:border-b-1"
                      >
                        <PaymentItem
                          item={payment}
                          noBorder
                          checkable={false}
                          onClick={() => modalsFunc.payment.edit(payment._id)}
                        />
                        {!readOnly && (
                          <div
                            className="flex items-center justify-center w-8 border-l border-gray-700 cursor-pointer group text-danger"
                            onClick={() => {
                              modalsFunc.payment.delete(payment._id)
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              className={cn(
                                'w-4 h-4 duration-300 group-hover:scale-125'
                              )}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )
        }
      )}
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
    setBottomLeftButtonProps,
  }) => {
    const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)
    const event = useRecoilValue(eventSelector(eventId))
    const isEventClosed = isEventClosedFunc(event)
    const isEventExpired = isEventExpiredFunc(event)
    const modalsFunc = useRecoilValue(modalsFuncAtom)
    const setEvent = useRecoilValue(itemsFuncAtom).event.set
    // const setEventUsersId = useRecoilValue(itemsFuncAtom).event.setEventUsers
    // const users = useRecoilValue(usersAtom)
    // const paymentsOfEvent = useRecoilValue(paymentsByEventIdSelector(eventId))
    const paymentsToEvent = useRecoilValue(paymentsToEventSelector(eventId))
    const paymentsFromEvent = useRecoilValue(paymentsFromEventSelector(eventId))
    // const eventAssistantsIds = useRecoilValue(
    //   eventAssistantsIdsSelector(eventId)
    // )
    // const eventParticipantsIds = useRecoilValue(
    //   eventParticipantsIdsSelector(eventId)
    // )
    // const sortUsersIds = (ids) =>
    //   [...users]
    //     .filter((user) => ids.includes(user._id))
    //     .sort(sortFunction)
    //     .map((user) => user._id)

    const eventAssistants = useRecoilValue(eventAssistantsSelector(eventId))
    const eventParticipants = useRecoilValue(eventParticipantsSelector(eventId))
    const eventParticipantsFull = useRecoilValue(
      eventParticipantsFullByEventIdSelector(eventId)
    )
    const eventAssistantsFull = useRecoilValue(
      eventAssistantsFullByEventIdSelector(eventId)
    )
    // const allPaymentsOfEventFromAndToUsers = useRecoilValue(paymentsFromAndToUsersSelector(eventId))

    // const paymentsOfEventFromAndToUsers = useRecoilValue(
    //   paymentsWithNoCouponsFromAndToUsersSelector(eventId)
    // )
    // const couponsOfEventFromUsers = useRecoilValue(
    //   couponsOfEventFromUsersSelector(eventId)
    // )

    const sumOfPaymentsOfEventFromParticipants = useRecoilValue(
      sumOfPaymentsFromParticipantsSelector(eventId)
    )
    const sumOfCouponsOfEventFromParticipants = useRecoilValue(
      sumOfCouponsFromParticipantsSelector(eventId)
    )
    const sumOfPaymentsOfEventToAssistants = useRecoilValue(
      sumOfPaymentsToAssistantsSelector(eventId)
    )

    // const sumOfPaymentsOfEventFromParticipants =
    //   paymentsOfEventFromAndToUsers.reduce((p, payment) => {
    //     const isUserParticipant = eventParticipantsIds.includes(payment.userId)
    //     if (isUserParticipant)
    //       return (
    //         p +
    //         (payment.sum ?? 0) * (payment.payDirection === 'toUser' ? -1 : 1)
    //       )

    //     return p
    //   }, 0) / 100

    // const sumOfCouponsOfEventFromParticipants =
    //   couponsOfEventFromUsers.reduce((p, payment) => {
    //     const isUserParticipant = eventParticipantsIds.includes(payment.userId)
    //     if (isUserParticipant)
    //       return (
    //         p +
    //         (payment.sum ?? 0) * (payment.payDirection === 'toUser' ? -1 : 1)
    //       )

    //     return p
    //   }, 0) / 100

    // const sumOfPaymentsOfEventToAssistants =
    //   paymentsOfEventFromAndToUsers.reduce((p, payment) => {
    //     const isUserAssistant = eventAssistantsIds.includes(payment.userId)
    //     if (isUserAssistant)
    //       return (
    //         p +
    //         (payment.sum ?? 0) * (payment.payDirection === 'toUser' ? -1 : 1)
    //       )

    //     return p
    //   }, 0) / 100

    // const allPaymentsToEvent = useRecoilValue(allPaymentsToEventSelector(eventId))

    const sumOfPaymentsToEvent = useRecoilValue(
      sumOfPaymentsToEventSelector(eventId)
    )

    const sumOfPaymentsFromEvent = useRecoilValue(
      sumOfPaymentsFromEventSelector(eventId)
    )

    // const membersOfEventCount = eventParticipants.filter(
    //   (user) => user.status === 'member'
    // ).length
    // const noviceOfEventCount = eventParticipants.length - membersOfEventCount
    const paymentsToExpectFromParticipants = useRecoilValue(
      sumOfExpectingPaymentsFromParticipantsSelector(eventId)
    )
    // const paymentsToExpectFromParticipants =
    //   (event.price * eventParticipants.length -
    //     membersOfEventCount * (event.usersStatusDiscount?.member ?? 0) -
    //     noviceOfEventCount * (event.usersStatusDiscount?.novice ?? 0)) /
    //     100 -
    //   sumOfCouponsOfEventFromParticipants

    const totalIncome = useRecoilValue(totalIncomeOfEventSelector(eventId))

    const expectedIncome = useRecoilValue(
      expectedIncomeOfEventSelector(eventId)
    )

    const maxPartisipants =
      event.maxMans !== null && event.maxWomans !== null
        ? Math.min(event.maxMans + event.maxWomans, event.maxParticipants)
        : event.maxParticipants !== null
        ? event.maxParticipants
        : null

    const maxPaymentPerParticipant =
      event.price -
      Math.min(
        event.usersStatusDiscount?.member ?? 0,
        event.usersStatusDiscount?.novice ?? 0
      )

    const expectedMaxIncome =
      maxPartisipants !== null
        ? expectedIncome +
          ((maxPartisipants - eventParticipants.length) *
            maxPaymentPerParticipant) /
            100
        : null

    useEffect(() => {
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
          event.status === 'active' &&
          (totalIncome < expectedIncome || !isEventExpired),
      })
    }, [totalIncome, expectedIncome, event.status])

    const TotalFromParticipants = () => (
      <div className="flex flex-wrap gap-x-1">
        <span>Всего получено от участников:</span>
        <div className="flex gap-x-0.5 flex-nowrap">
          <span
            className={cn(
              'font-bold whitespace-nowrap',
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
          <span className="font-bold whitespace-nowrap">{`${paymentsToExpectFromParticipants} ₽`}</span>
          {sumOfCouponsOfEventFromParticipants > 0 && (
            <span className="font-bold whitespace-nowrap text-general">{` +${sumOfCouponsOfEventFromParticipants} ₽ купонами`}</span>
          )}
        </div>
      </div>
    )

    const TotalToAssistants = () => (
      <div className="flex flex-wrap gap-x-1">
        <span>Всего затрат на ведущих и ассистентов:</span>
        <span
          className={cn(
            'whitespace-nowrap',
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
      <div className="flex flex-wrap gap-x-1">
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

    const TotalFromEvent = () => (
      <div className="flex flex-wrap gap-x-1">
        <span>Всего доп. доходов от мероприятия:</span>
        <span
          className={cn(
            'font-bold',
            sumOfPaymentsFromEvent === 0
              ? 'text-gray_600'
              : sumOfPaymentsFromEvent > 0
              ? 'text-success'
              : 'text-danger'
          )}
        >{`${sumOfPaymentsFromEvent} ₽`}</span>
      </div>
    )

    return (
      <>
        {isLoggedUserAdmin && isEventClosed && (
          <P className="text-danger">
            Мероприятие закрыто, поэтому редактирование/добавление/удаление
            транзакций запрещено
          </P>
        )}
        <TabContext value="Участники">
          <TabPanel
            tabName="Участники"
            tabAddToLabel={`${sumOfPaymentsOfEventFromParticipants} ₽`}
          >
            <div className="flex flex-wrap items-center justify-between">
              <TotalFromParticipants />
              <div className="flex justify-end flex-1 gap-x-1">
                {!isEventClosed && (
                  <Button
                    name="Заполнить автоматически"
                    onClick={() => modalsFunc.payment.autoFill(eventId)}
                    classBgColor="bg-general"
                    thin
                  />
                )}
              </div>
            </div>
            <UsersPayments
              event={event}
              users={[...eventParticipants].sort(sortFunction)}
              defaultPayDirection="fromUser"
              readOnly={isEventClosed}
              eventUsers={eventParticipantsFull}
            />
          </TabPanel>
          {eventAssistants.length > 0 && (
            <TabPanel
              tabName="Ведущие"
              tabAddToLabel={`${sumOfPaymentsOfEventToAssistants} ₽`}
            >
              <TotalToAssistants />
              <UsersPayments
                event={event}
                users={[...eventAssistants].sort(sortFunction)}
                defaultPayDirection="toUser"
                noEventPriceForUser
                readOnly={isEventClosed}
                eventUsers={eventAssistantsFull}
              />
            </TabPanel>
          )}
          <TabPanel
            tabName="Мероприятие"
            tabAddToLabel={`${sumOfPaymentsToEvent + sumOfPaymentsFromEvent} ₽`}
          >
            <div className="flex flex-wrap items-center justify-between">
              <TotalToEvent />
              <div className="flex justify-end flex-1 gap-x-1">
                {!isEventClosed && (
                  <Button
                    name="Добавить затраты"
                    onClick={() =>
                      modalsFunc.payment.add(null, {
                        payDirection: 'toEvent',
                        eventId: event._id,
                      })
                    }
                    classBgColor="bg-danger"
                    thin
                  />
                )}
              </div>
            </div>
            {paymentsToEvent.length > 0 && (
              <div className="p-1 bg-opacity-50 border-t border-gray-700 rounded bg-general">
                {paymentsToEvent.map((payment) => (
                  <div
                    key={payment._id}
                    className="flex bg-white border-t border-l border-r border-gray-700 last:border-b-1"
                  >
                    <PaymentItem
                      item={payment}
                      noBorder
                      checkable={false}
                      onClick={() => modalsFunc.payment.edit(payment._id)}
                    />
                    {!isEventClosed && (
                      <div
                        className="flex items-center justify-center w-8 border-l border-gray-700 cursor-pointer group text-danger"
                        onClick={() => modalsFunc.payment.delete(payment._id)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className={cn(
                            'w-5 h-5 duration-300 group-hover:scale-125'
                          )}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between">
              <TotalFromEvent />
              <div className="flex justify-end flex-1 gap-x-1">
                {!isEventClosed && (
                  <Button
                    name="Добавить доходы"
                    onClick={() =>
                      modalsFunc.payment.add(null, {
                        payDirection: 'fromEvent',
                        eventId: event._id,
                      })
                    }
                    classBgColor="bg-success"
                    thin
                  />
                )}
              </div>
            </div>
            {paymentsFromEvent.length > 0 && (
              <div className="p-1 bg-opacity-50 border-t border-gray-700 rounded bg-general">
                {paymentsFromEvent.map((payment) => (
                  <div
                    key={payment._id}
                    className="flex bg-white border-t border-l border-r border-gray-700 last:border-b-1"
                  >
                    <PaymentItem
                      item={payment}
                      noBorder
                      checkable={false}
                      onClick={() => modalsFunc.payment.edit(payment._id)}
                    />
                    {!isEventClosed && (
                      <div
                        className="flex items-center justify-center w-8 border-l border-gray-700 cursor-pointer group text-danger"
                        onClick={() => modalsFunc.payment.delete(payment._id)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className={cn(
                            'w-5 h-5 duration-300 group-hover:scale-125'
                          )}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabPanel>
          <TabPanel tabName="Сводка" tabAddToLabel={`${totalIncome} ₽`}>
            <TotalFromParticipants />
            {eventAssistants.length > 0 && <TotalToAssistants />}
            <TotalToEvent />
            <TotalFromEvent />
            <div className="flex flex-wrap gap-x-1">
              <span>Текущая прибыль:</span>
              <span
                className={cn(
                  'font-bold',
                  totalIncome <= 0 ? 'text-danger' : 'text-success'
                )}
              >{`${totalIncome} ₽`}</span>
            </div>
            <div className="flex flex-wrap gap-x-1">
              <span>{'Ожидаемая прибыль:'}</span>
              <span
                className={cn(
                  'font-bold',
                  expectedIncome <= 0 ? 'text-danger' : 'text-success'
                )}
              >{`${expectedIncome} ₽`}</span>
            </div>
            {expectedMaxIncome !== null && (
              <div className="flex flex-wrap gap-x-1">
                <span>{'Максимально возможная прибыль:'}</span>
                <span
                  className={cn(
                    'font-bold',
                    expectedMaxIncome <= 0 ? 'text-danger' : 'text-success'
                  )}
                >{`${expectedMaxIncome} ₽`}</span>
              </div>
            )}
          </TabPanel>
        </TabContext>
      </>
    )
  }

  return {
    title: `Финансы мероприятия`,
    // confirmButtonName: 'Применить',
    closeButtonShow: true,
    Children: EventUsersPaymentsModal,
  }
}

export default eventUsersPaymentsFunc
