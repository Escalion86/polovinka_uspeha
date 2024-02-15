import Button from '@components/Button'
import CardButton from '@components/CardButton'
import InputWrapper from '@components/InputWrapper'
import { PaymentItem, UserItem, UserItemFromId } from '@components/ItemCards'
import TabContext from '@components/Tabs/TabContext'
import TabPanel from '@components/Tabs/TabPanel'
import Tooltip from '@components/Tooltip'
import UserStatusIcon from '@components/UserStatusIcon'
import { P } from '@components/tags'
import {
  faAngleDown,
  faCertificate,
  faLink,
  faPlus,
  faTrash,
  faUnlink,
  faWarning,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EVENT_STATUSES } from '@helpers/constants'
import eventPricesWithStatus from '@helpers/eventPricesWithStatus'
import isEventClosedFunc from '@helpers/isEventClosed'
import { modalsFuncAtom } from '@state/atoms'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import eventSelector from '@state/selectors/eventSelector'
import eventsUsersFullByEventIdSelector from '@state/selectors/eventsUsersFullByEventIdSelector'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import paymentsByEventIdSelector from '@state/selectors/paymentsByEventIdSelector'
import paymentsOfEventWithoutEventIdByUserIdSelector from '@state/selectors/paymentsOfEventWithoutEventIdByUserIdSelector'
import cn from 'classnames'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'

const income = (payments) =>
  payments.reduce(
    (p, payment) =>
      p +
      (payment.sum ?? 0) *
        ([
          'toEvent',
          // 'toService',
          // 'toProduct',
          // 'toInternal',
          'toUser',
        ].includes(payment.payDirection)
          ? -1
          : 1),
    0
  ) / 100

const UserPayment = ({
  // id,
  user,
  event,
  subEvent,
  userStatus,
  // eventSubtypeNum,
  // comment,
  noEventPriceForUser,
  usersIds,
  readOnly,
  defaultPayDirection,
}) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const paymentsOfEvent = useRecoilValue(paymentsByEventIdSelector(event._id))
  const itemsFunc = useRecoilValue(itemsFuncAtom)
  const setPaymentLink = itemsFunc.payment.link
  const setPaymentUnlink = itemsFunc.payment.unlink
  const paymentsWithoutEventOfUser = useRecoilValue(
    paymentsOfEventWithoutEventIdByUserIdSelector(user._id)
  )

  const [isCollapsed, setIsCollapsed] = useState(true)

  // const sumOfPaymentsWithoutEventOfUser = useRecoilValue(
  //   sumOfPaymentsWithoutEventIdByUserIdSelector(user._id)
  // )

  const allPaymentsOfUser = paymentsOfEvent.filter(
    (payment) =>
      payment.userId === user._id &&
      (payment.payDirection === 'toUser' || payment.payDirection === 'fromUser')
  )

  const couponsOfUser = allPaymentsOfUser.filter(
    (payment) => payment.payType === 'coupon'
  )
  const paymentsOfUser = allPaymentsOfUser.filter(
    (payment) => payment.payType !== 'coupon'
  )

  const sumOfCoupons = income(couponsOfUser)
  const sumOfPayments = income(paymentsOfUser)

  const userDiscount = userStatus
    ? (subEvent ?? event).usersStatusDiscount[userStatus]
    : 0

  const eventPriceForUser = noEventPriceForUser
    ? 0
    : ((subEvent ?? event).price -
        (typeof userDiscount === 'number' ? userDiscount : 0)) /
        100 -
      sumOfCoupons

  const sumToPay = eventPriceForUser - sumOfPayments

  useEffect(() => {
    if (paymentsOfUser.length === 0) setIsCollapsed(true)
  }, [paymentsOfUser.length])

  const isCollapsingActive =
    allPaymentsOfUser.length > 0 || paymentsWithoutEventOfUser.length > 0

  return (
    <div
      // key={'payment' + user._id}
      className="overflow-hidden border border-gray-700 rounded"
    >
      <div className="flex">
        <div className="flex-1">
          {usersIds ? (
            <UserItemFromId
              userId={user._id}
              onClick={() => modalsFunc.user.view(user._id)}
              noBorder
            />
          ) : (
            <UserItem
              item={user}
              onClick={() => modalsFunc.user.view(user._id)}
              noBorder
            />
          )}
        </div>
        {/* {sumOfPaymentsWithoutEventOfUser > 0 && (
                  <div
                    onClick={() => convertPayment()}
                    className="flex items-center self-stretch px-1 text-white border-l border-gray-700 bg-success"
                  >
                    {`${sumOfPaymentsWithoutEventOfUser} ₽`}
                  </div>
                )} */}
        <div
          className={cn(
            ' flex flex-col items-center justify-center text-sm leading-4 border-l border-gray-700 min-w-[80px]',
            usersIds ? '' : 'hover:bg-blue-200 cursor-pointer'
          )}
          onClick={
            usersIds
              ? null
              : () =>
                  modalsFunc.eventUser.editStatus({
                    eventId: event._id,
                    userId: user._id,
                  })
          }
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
                sector: 'event',
                payDirection: defaultPayDirection,
                sum: noEventPriceForUser ? 0 : sumToPay * 100,
                userId: user._id,
                eventId: event._id,
                fixedSector: true,
                fixedUserId: true,
                fixedEventId: true,
                fixedPayDirection: true,
              })
            }}
          >
            <FontAwesomeIcon
              icon={faPlus}
              className={cn('w-5 h-5 duration-300 group-hover:scale-125')}
            />
          </div>
        )}
        <div
          className={cn(
            'relative flex items-center justify-center w-8 border-l border-gray-700',
            isCollapsingActive
              ? 'text-black cursor-pointer'
              : 'text-disabled cursor-not-allowed'
          )}
          onClick={() => {
            isCollapsingActive && setIsCollapsed((state) => !state)
          }}
        >
          {paymentsWithoutEventOfUser.length > 0 && (
            <div className="absolute top-0.5 w-3 h-3 text-yellow-500">
              <FontAwesomeIcon icon={faWarning} size="sm" />
            </div>
          )}
          <div
            className={cn('w-4 duration-300 transition-transform', {
              'rotate-180': isCollapsed,
            })}
          >
            <FontAwesomeIcon icon={faAngleDown} size="lg" />
          </div>
        </div>
      </div>
      {isCollapsingActive && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: isCollapsed ? 0 : 'auto' }}
        >
          <div className="p-1 border-t border-gray-700 rounded-b bg-opacity-30 bg-general">
            {paymentsWithoutEventOfUser.length > 0 && (
              <div className="mb-2">
                <div className="flex items-center gap-x-1">
                  <div className="w-4 h-4 text-yellow-300">
                    <FontAwesomeIcon icon={faWarning} size="sm" />
                  </div>
                  <span>
                    Транзакции пользователя, НЕ привязанные ни к какому
                    мероприятию
                  </span>
                </div>
                {paymentsWithoutEventOfUser.map((payment) => (
                  <div
                    key={payment._id}
                    className="flex bg-white border-t border-l border-r border-gray-700 last:border-b-1"
                  >
                    <PaymentItem
                      item={payment}
                      noBorder
                      checkable={false}
                      onClick={() => modalsFunc.payment.edit(payment._id)}
                      showUser={false}
                      showEvent={false}
                    />
                    {!readOnly && (
                      <Tooltip title="Привязать транзакцию к этому мероприятию">
                        <div
                          className="flex items-center justify-center w-8 border-l border-gray-700 cursor-pointer group text-success"
                          onClick={() => {
                            // modalsFunc.payment.link(
                            //   payment._id,
                            //   event._id
                            // )
                            setPaymentLink(payment._id, event._id)
                          }}
                        >
                          {/* <span>привязать</span> */}
                          <FontAwesomeIcon
                            icon={faLink}
                            className={cn(
                              'w-4 h-4 duration-300 group-hover:scale-125'
                            )}
                          />
                        </div>
                      </Tooltip>
                    )}
                  </div>
                ))}
              </div>
            )}
            {allPaymentsOfUser.length > 0 && (
              <>
                <span>
                  Транзакции пользователя привязанные к этому мероприятию
                </span>
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
                      showUser={false}
                      showEvent={false}
                    />
                    {!readOnly && (
                      <>
                        <Tooltip title="Отвязать транзакцию от мероприятия">
                          <div
                            className="flex items-center justify-center w-8 border-l border-gray-700 cursor-pointer group text-danger"
                            onClick={() => setPaymentUnlink(payment._id)}
                          >
                            {/* <span>привязать</span> */}
                            <FontAwesomeIcon
                              icon={faUnlink}
                              className={cn(
                                'w-4 h-4 duration-300 group-hover:scale-125'
                              )}
                            />
                          </div>
                        </Tooltip>
                        <Tooltip title="Удалить транзакцию">
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
                        </Tooltip>
                      </>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

const UsersPayments = ({
  event,
  subEvent,
  usersIds,
  eventUsers,
  defaultPayDirection,
  noEventPriceForUser,
  readOnly = false,
}) => {
  // const modalsFunc = useRecoilValue(modalsFuncAtom)
  // const paymentsOfEvent = useRecoilValue(paymentsByEventIdSelector(event._id))
  // const itemsFunc = useRecoilValue(itemsFuncAtom)
  // const setPaymentLink = itemsFunc.payment.link
  // const setPaymentUnlink = itemsFunc.payment.unlink
  // const paymentsFromNotParticipants = useRecoilValue(
  //   paymentsOfEventFromNotParticipantsSelector(event._id)
  // )
  const arrayOfUsers = usersIds
    ? usersIds.map((_id) => ({ user: { _id } }))
    : eventUsers

  return (
    <div className="flex flex-col gap-y-1">
      {arrayOfUsers.map((props) => {
        const {
          _id,
          user,
          // event,
          userStatus,
          // eventSubtypeNum,
          // comment,
        } = props
        return (
          <UserPayment
            key={user._id}
            // id={_id}
            noEventPriceForUser={noEventPriceForUser}
            event={event}
            subEvent={subEvent}
            user={user}
            userStatus={userStatus}
            // eventSubtypeNum={eventSubtypeNum}
            // comment={comment}
            usersIds={usersIds}
            readOnly={readOnly}
            defaultPayDirection={defaultPayDirection}
          />
        )
      })}
    </div>
  )
}

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
    setTopLeftComponent,
  }) => {
    const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleSelector)
    const statusEdit = loggedUserActiveRole?.events?.statusEdit
    const paymentsEdit = loggedUserActiveRole?.events?.paymentsEdit

    const event = useRecoilValue(eventSelector(eventId))
    const isEventClosed = isEventClosedFunc(event)
    const modalsFunc = useRecoilValue(modalsFuncAtom)

    const paymentsOfEvent = useRecoilValue(paymentsByEventIdSelector(event._id))

    const paymentsToEvent = paymentsOfEvent.filter(
      (payments) => payments.payDirection === 'toEvent'
    )
    const paymentsFromEvent = paymentsOfEvent.filter(
      (payments) => payments.payDirection === 'fromEvent'
    )

    const eventUsers = useRecoilValue(eventsUsersFullByEventIdSelector(eventId))

    const eventParticipants = useMemo(
      () =>
        [...eventUsers.filter(({ status }) => status === 'participant')].sort(
          sortByFirstNameAndGenderFunctionEventUser
        ),
      [eventUsers]
    )
    const eventAssistants = useMemo(
      () =>
        [...eventUsers.filter(({ status }) => status === 'assistant')].sort(
          sortByFirstNameAndGenderFunctionEventUser
        ),
      [eventUsers]
    )

    const eventParticipantsIds = eventParticipants.map(
      (eventUser) => eventUser.userId
    )
    const eventAssistantsIds = eventAssistants.map(
      (eventUser) => eventUser.userId
    )

    const paymentsOfEventOfParticipants = paymentsOfEvent.filter(
      (payment) =>
        payment.userId && eventParticipantsIds.includes(payment.userId)
    )
    const paymentsOfEventOfAssistants = paymentsOfEvent.filter(
      (payment) => payment.userId && eventAssistantsIds.includes(payment.userId)
    )

    const paymentsOfEventOfParticipantsWitoutCoupons =
      paymentsOfEventOfParticipants.filter((item) => item.payType !== 'coupon')
    const paymentsOfEventOfParticipantsCouponsOnly =
      paymentsOfEventOfParticipants.filter((item) => item.payType === 'coupon')
    const paymentsOfEventOfAssistantsWitoutCoupons =
      paymentsOfEventOfAssistants.filter((item) => item.payType !== 'coupon')

    const sumOfPaymentsOfEventFromParticipants = income(
      paymentsOfEventOfParticipantsWitoutCoupons
    )
    const sumOfCouponsOfEventFromParticipants = income(
      paymentsOfEventOfParticipantsCouponsOnly
    )
    const sumOfPaymentsOfEventToAssistants = income(
      paymentsOfEventOfAssistantsWitoutCoupons
    )

    const participantsPlusAssistantsIds = [
      ...eventParticipantsIds,
      ...eventAssistantsIds,
    ]
    const paymentsFromNotParticipants = paymentsOfEvent.filter(
      ({ userId, payDirection }) =>
        ['toUser', 'fromUser'].includes(payDirection) &&
        !participantsPlusAssistantsIds.includes(userId)
    )
    const paymentsFromNotParticipantsWhisoutCoupons =
      paymentsFromNotParticipants.filter(({ payType }) => payType !== 'coupon')

    const sumOfPaymentsFromNotParticipants = income(
      paymentsFromNotParticipantsWhisoutCoupons
    )
    const usersNotParticipantsIds = [
      ...new Set(paymentsFromNotParticipants.map(({ userId }) => userId)),
    ]

    const sumOfPaymentsToEvent =
      paymentsToEvent.reduce((p, payment) => p - payment.sum, 0) / 100
    const sumOfPaymentsFromEvent =
      paymentsFromEvent.reduce((p, payment) => p + payment.sum, 0) / 100

    const membersOfEvent = eventParticipants.filter(
      ({ userStatus }) => userStatus === 'member'
    )
    const noviceOfEvent = eventParticipants.filter(
      ({ userStatus }) => userStatus === 'novice'
    )
    const membersOfEventCount = membersOfEvent.length
    const noviceOfEventCount = noviceOfEvent.length

    const eventPrices = {}
    event.subEvents.forEach(
      (subEvent) => (eventPrices[subEvent.id] = eventPricesWithStatus(subEvent))
    )

    const sumOfPaymentsToExpectFromParticipants =
      event.subEvents.reduce((sum, { id }) => {
        const res =
          eventPrices[id].member *
            membersOfEvent.filter(({ subEventId }) => subEventId === id)
              .length +
          eventPrices[id].novice *
            noviceOfEvent.filter(({ subEventId }) => subEventId === id).length
        return sum + res
      }, 0) /
        100 -
      sumOfCouponsOfEventFromParticipants

    const totalIncome =
      sumOfPaymentsOfEventFromParticipants +
      sumOfPaymentsOfEventToAssistants +
      sumOfPaymentsToEvent +
      sumOfPaymentsFromEvent +
      sumOfPaymentsFromNotParticipants

    const expectedIncome =
      sumOfPaymentsToExpectFromParticipants +
      sumOfPaymentsOfEventToAssistants +
      sumOfPaymentsToEvent

    const noviceFullPaidCount = noviceOfEvent.filter(({ user, subEventId }) => {
      const userPayments = paymentsOfEventOfParticipants.filter(
        ({ userId }) => userId === user._id
      )
      const sumOfPayments = userPayments.reduce(
        (sum, payment) => sum + payment.sum,
        0
      )
      return sumOfPayments >= eventPrices[subEventId].novice
    }).length

    const membersFullPaidCount = membersOfEvent.filter(
      ({ user, subEventId }) => {
        const userPayments = paymentsOfEventOfParticipants.filter(
          ({ userId }) => userId === user._id
        )
        const sumOfPayments = userPayments.reduce(
          (sum, payment) => sum + payment.sum,
          0
        )
        return sumOfPayments >= eventPrices[subEventId].member
      }
    ).length

    // const maxPartisipants =
    //   event.maxMans !== null && event.maxWomans !== null
    //     ? Math.min(event.maxMans + event.maxWomans, event.maxParticipants)
    //     : event.maxParticipants !== null
    //     ? event.maxParticipants
    //     : null

    // const maxPaymentPerParticipant =
    //   event.price -
    //   Math.min(
    //     event.usersStatusDiscount?.member ?? 0,
    //     event.usersStatusDiscount?.novice ?? 0
    //   )

    // const expectedMaxIncome =
    //   maxPartisipants !== null
    //     ? expectedIncome +
    //       ((maxPartisipants - eventParticipants.length) *
    //         maxPaymentPerParticipant) /
    //         100
    //     : null

    useEffect(() => {
      if (statusEdit && setTopLeftComponent)
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
          </div>
        ))
    }, [statusEdit, setTopLeftComponent, event])

    // useEffect(() => {
    //   setBottomLeftButtonProps({
    //     name:
    //       event.status === 'closed'
    //         ? 'Активировать мероприятие'
    //         : 'Закрыть мероприятие',
    //     classBgColor: event.status === 'closed' ? 'bg-general' : 'bg-success',
    //     icon: event.status === 'closed' ? faPlay : faLock,
    //     onClick: () =>
    //       setEvent({
    //         _id: eventId,
    //         status: event.status === 'closed' ? 'active' : 'closed',
    //       }),
    //     disabled:
    //       event.status === 'active' &&
    //       (isHaveUserWithoutFullPay || !isEventExpired),
    //   })
    // }, [isHaveUserWithoutFullPay, event.status])

    const TotalFromParticipants = ({ className }) => (
      <div className={cn('flex flex-wrap gap-x-1', className)}>
        <span>Всего получено от участников:</span>
        <div className="flex gap-x-0.5 flex-nowrap">
          <span
            className={cn(
              'font-bold whitespace-nowrap',
              sumOfPaymentsOfEventFromParticipants ===
                sumOfPaymentsToExpectFromParticipants
                ? 'text-success'
                : sumOfPaymentsOfEventFromParticipants <
                    sumOfPaymentsToExpectFromParticipants
                  ? sumOfPaymentsOfEventFromParticipants === 0
                    ? 'text-danger'
                    : 'text-orange-500'
                  : 'text-blue-700'
            )}
          >{`${sumOfPaymentsOfEventFromParticipants} ₽`}</span>
          <span>/</span>
          <span className="font-bold whitespace-nowrap">{`${sumOfPaymentsToExpectFromParticipants} ₽`}</span>
          {sumOfCouponsOfEventFromParticipants > 0 && (
            <span className="font-bold whitespace-nowrap text-general">{` +${sumOfCouponsOfEventFromParticipants} ₽ купонами`}</span>
          )}
        </div>
      </div>
    )

    const TotalFromNotParticipants = ({ className }) => (
      <div className={cn('flex flex-wrap gap-x-1', className)}>
        <span>Оплатили, но не пришли:</span>
        <span
          className={cn(
            'whitespace-nowrap',
            'font-bold',
            sumOfPaymentsFromNotParticipants === 0
              ? 'text-success'
              : sumOfPaymentsFromNotParticipants > 0
                ? 'text-blue-700'
                : 'text-danger'
          )}
        >{`${sumOfPaymentsFromNotParticipants} ₽`}</span>
      </div>
    )

    const TotalToAssistants = ({ className }) => (
      <div className={cn('flex flex-wrap gap-x-1', className)}>
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

    const TotalToEvent = ({ className }) => (
      <div className={cn('flex flex-wrap gap-x-1', className)}>
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

    const TotalFromEvent = ({ className }) => (
      <div className={cn('flex flex-wrap gap-x-1', className)}>
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
        {paymentsEdit && isEventClosed && (
          <P className="text-danger">
            Мероприятие закрыто, поэтому редактирование/добавление/удаление
            транзакций запрещено
          </P>
        )}
        <TabContext value="Участники">
          <TabPanel
            tabName="Участники"
            tabAddToLabel={`${eventParticipants.length} чел. / ${sumOfPaymentsOfEventFromParticipants} ₽`}
          >
            <div className="flex flex-wrap items-center justify-between mb-1">
              <div>
                <TotalFromParticipants />
                <div className="flex flex-wrap items-center gap-x-1">
                  <span>Оплатили:</span>
                  <div className="flex items-center gap-x-2">
                    <div className="flex items-center gap-x-1">
                      <UserStatusIcon status="member" size="s" />
                      <span
                        className={cn(
                          'font-bold',
                          membersFullPaidCount === membersOfEventCount
                            ? 'text-success'
                            : 'text-danger'
                        )}
                      >
                        {membersFullPaidCount}
                      </span>{' '}
                      / {membersOfEventCount} чел
                    </div>
                    <div className="flex items-center gap-x-1">
                      <UserStatusIcon status="novice" size="s" />
                      <span
                        className={cn(
                          'font-bold',
                          noviceFullPaidCount === noviceOfEventCount
                            ? 'text-success'
                            : 'text-danger'
                        )}
                      >
                        {noviceFullPaidCount}
                      </span>{' '}
                      / {noviceOfEventCount} чел
                    </div>
                  </div>
                </div>
              </div>
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
            <div className="flex flex-col mt-2 gap-y-5">
              {event.subEvents.map((subEvent) => {
                const { id, title } = subEvent

                return (
                  <Wrapper
                    key={'Участники' + id}
                    label={title || 'Основной тип участия'}
                  >
                    <UsersPayments
                      event={event}
                      subEvent={subEvent}
                      // users={[...eventParticipants].sort(sortFunction)}
                      defaultPayDirection="fromUser"
                      readOnly={isEventClosed}
                      eventUsers={eventParticipants.filter(
                        ({ subEventId }) => subEventId === id
                      )}
                    />
                  </Wrapper>
                )
              })}
            </div>
          </TabPanel>
          {eventAssistants.length > 0 && (
            <TabPanel
              tabName="Ведущие"
              tabAddToLabel={`${eventAssistants.length} чел. / ${sumOfPaymentsOfEventToAssistants} ₽`}
            >
              <TotalToAssistants className="mb-1" />
              <UsersPayments
                event={event}
                // users={[...eventAssistants].sort(sortFunction)}
                defaultPayDirection="toUser"
                noEventPriceForUser
                readOnly={isEventClosed}
                eventUsers={eventAssistants}
              />
            </TabPanel>
          )}
          <TabPanel
            tabName="Оплатили, но не пришли"
            tabAddToLabel={`${usersNotParticipantsIds.length} чел. / ${sumOfPaymentsFromNotParticipants} ₽`}
          >
            <TotalFromNotParticipants className="mb-1" />
            <UsersPayments
              event={event}
              usersIds={usersNotParticipantsIds}
              defaultPayDirection="toUser"
              noEventPriceForUser
              readOnly={isEventClosed}
              // eventUsers={[...eventNotParticipantsWithPayments].sort(
              //   sortFunction
              // )}
            />
          </TabPanel>
          <TabPanel
            tabName="Мероприятие"
            tabAddToLabel={`${sumOfPaymentsToEvent + sumOfPaymentsFromEvent} ₽`}
          >
            <div className="flex flex-wrap items-center justify-between mb-1">
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
                      showUser={false}
                      showEvent={false}
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
            <div className="flex flex-wrap items-center justify-between my-1">
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
                      showUser={false}
                      showEvent={false}
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
            <TotalFromNotParticipants />
            <div className="flex flex-wrap gap-x-1">
              <span>Текущая прибыль:</span>
              <span
                className={cn(
                  'font-bold',
                  totalIncome <= 0
                    ? 'text-danger'
                    : // : totalIncome > expectedMaxIncome
                      // ? 'text-blue-700'
                      'text-success'
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
            {/* {expectedMaxIncome !== null && (
              <div className="flex flex-wrap gap-x-1">
                <span>{'Максимально возможная прибыль:'}</span>
                <span
                  className={cn(
                    'font-bold',
                    expectedMaxIncome <= 0 ? 'text-danger' : 'text-success'
                  )}
                >{`${expectedMaxIncome} ₽`}</span>
              </div>
            )} */}
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
