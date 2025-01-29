import CardButtons from '@components/CardButtons'
import CardWrapper from '@components/CardWrapper'
import EventNameById from '@components/EventNameById'
import IconWithTooltip from '@components/IconWithTooltip'
import PayTypeIcon from '@components/PayTypeIcon'
import ProductNameById from '@components/ProductNameById'
import ServiceTitleById from '@components/ServiceTitleById'
import TextLinesLimiter from '@components/TextLinesLimiter'
import UserNameById from '@components/UserNameById'
import EventPayDirectionIconText from '@components/ValueIconText/EventPayDirectionIconText'
import InternalPayDirectionIconText from '@components/ValueIconText/InternalPayDirectionIconText'
import ProductPayDirectionIconText from '@components/ValueIconText/ProductPayDirectionIconText'
import ServicePayDirectionIconText from '@components/ValueIconText/ServicePayDirectionIconText'
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle'
import { faUnlink } from '@fortawesome/free-solid-svg-icons/faUnlink'
import { faUserTimes } from '@fortawesome/free-solid-svg-icons/faUserTimes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  PRODUCT_USER_STATUSES,
  SECTORS,
  SERVICE_USER_STATUSES,
} from '@helpers/constants'
import eventStatusFunc from '@helpers/eventStatus'
import formatDateTime from '@helpers/formatDateTime'
import paymentSectorFunc from '@helpers/paymentSector'
import serviceStatusFunc from '@helpers/serviceStatus'
import asyncEventsUsersByEventIdAtom from '@state/async/asyncEventsUsersByEventIdAtom'
import modalsFuncAtom from '@state/modalsFuncAtom'
import loadingAtom from '@state/atoms/loadingAtom'
// import eventFullAtomAsync from '@state/async/eventFullAtomAsync'
import paymentSelector from '@state/selectors/paymentSelector'
import serviceSelector from '@state/selectors/serviceSelector'
import cn from 'classnames'
import { Suspense } from 'react'
import { useAtomValue } from 'jotai'
import eventSelector from '@state/selectors/eventSelector'
import isEventClosedFunc from '@helpers/isEventClosed'

// const Status = ({ statusProps }) => {
//   if (!statusProps) return null
//   return (
//     <div
//       className={cn(
//         'flex items-center justify-center w-8 text-white',
//         statusProps ? 'bg-' + statusProps.color : 'bg-gray-400'
//       )}
//     >
//       <FontAwesomeIcon icon={statusProps?.icon ?? faQuestion} className="w-6" />
//     </div>
//   )
// }

// const EventStatusByEventId = ({ eventId }) => {
//   if (!eventId) return null
//   const event = useAtomValue(eventFullAtomAsync(eventId))
//   const eventStatus = eventStatusFunc(event)

//   const eventStatusProps = EVENT_STATUSES_WITH_TIME.find(
//     (payTypeItem) => payTypeItem.value === eventStatus
//   )
//   return (
//     <div
//       className={cn(
//         'flex items-center justify-center w-4',
//         eventStatusProps ? 'text-' + eventStatusProps.color : 'text-disabled'
//       )}
//     >
//       <FontAwesomeIcon
//         icon={eventStatusProps?.icon ?? faQuestion}
//         className="w-4 h-4"
//       />
//     </div>
//   )
// }

const PaySum = ({ payment }) => {
  const isExpenses = [
    'toUser',
    'toEvent',
    'toInternal',
    'toService',
    'toProduct',
  ].includes(payment.payDirection)
  return (
    <div
      className={cn(
        'px-1 text-sm text-right font-bold phoneH:text-base min-w-16',
        payment.payType === 'coupon'
          ? 'text-general'
          : isExpenses
            ? 'text-danger'
            : 'text-success'
      )}
    >
      {`${isExpenses ? '-' : ''}${payment.sum / 100} ₽`}
    </div>
  )
}

const PayText = ({ payment, sector }) => {
  return (
    <div className="flex flex-col items-start flex-1 h-full ml-1 text-sm leading-4 overflow-x-clip justify-evenly gap-x-2 phoneH:text-base">
      {sector === 'event' && (
        <EventPayDirectionIconText value={payment.payDirection} />
      )}
      {sector === 'event' && payment.eventId && (
        <EventNameById
          eventId={payment.eventId}
          className="font-bold text-general"
          showStatus
        />
      )}
      {sector === 'service' && (
        <ServicePayDirectionIconText value={payment.payDirection} />
      )}
      {sector === 'service' && payment.serviceId && (
        <div className="font-bold leading-4 text-general">
          <ServiceTitleById serviceId={payment.serviceId} />
        </div>
      )}
      {sector === 'product' && (
        <ProductPayDirectionIconText value={payment.payDirection} />
      )}
      {sector === 'product' && payment.productId && (
        <ProductNameById
          productId={payment.productId}
          className="font-bold text-general"
        />
      )}
      {sector === 'internal' && (
        <InternalPayDirectionIconText value={payment.payDirection} />
      )}
      {sector === 'internal' &&
        ['toInternal', 'fromInternal'].includes(payment.payDirection) &&
        payment.comment && (
          <TextLinesLimiter
            lines={2}
            className="text-xs leading-3"
            textCenter={false}
          >
            {payment.comment}
          </TextLinesLimiter>
        )}
      {payment.userId && (
        <UserNameById
          showStatus
          userId={payment.userId}
          className="font-bold"
          trunc
        />
      )}
    </div>
  )
}

const PayCardWrapper = ({ sector, payment, children, cardButtonsProps }) => {
  return (
    <div className="flex flex-1">
      <PayText payment={payment} sector={sector} />
      <div className="flex items-center justify-between">
        <div className="flex gap-x-3">
          {children}
          {!sector && (
            <IconWithTooltip
              icon={faTimesCircle}
              className="text-danger"
              tooltip="Транзакция не привязана к сектору"
            />
          )}
          {sector === 'event' && !payment.eventId && (
            <IconWithTooltip
              icon={faUnlink}
              className="text-danger"
              tooltip="Транзакция не привязана к мероприятию"
            />
          )}
          {sector === 'service' && !payment.serviceId && (
            <IconWithTooltip
              icon={faUnlink}
              className="text-danger"
              tooltip="Транзакция не привязана к услуге"
            />
          )}
          {sector === 'product' && !payment.productId && (
            <IconWithTooltip
              icon={faUnlink}
              className="text-danger"
              tooltip="Транзакция не привязана к продукту"
            />
          )}
        </div>

        <div className="flex flex-col items-end">
          <div className="text-sm leading-4 whitespace-nowrap">
            {formatDateTime(
              payment.payAt,
              false,
              false,
              false,
              false,
              false,
              true,
              false
            )}
          </div>
          <div className="flex items-center justify-between">
            <PaySum payment={payment} />
            <PayTypeIcon payment={payment} />
          </div>
        </div>
        <CardButtons
          item={payment}
          typeOfItem="payment"
          alwaysCompact
          {...cardButtonsProps}
        />
      </div>
    </div>
  )
}

const PaymentEventUserLeftComponent = ({ payment, event }) => {
  const eventUsers = useAtomValue(asyncEventsUsersByEventIdAtom(event?._id))
  const eventUser = eventUsers.find(
    (eventUser) => eventUser.userId === payment.userId
  )

  if (eventUser) return null
  return (
    <IconWithTooltip
      icon={faUserTimes}
      className="text-danger"
      tooltip="Участник не пришёл"
    />
  )
}

const PaymentEventUserLeft = (props) => (
  <Suspense>
    <PaymentEventUserLeftComponent {...props} />
  </Suspense>
)

const PaymentEvent = ({ payment }) => {
  const event = useAtomValue(eventSelector(payment.eventId))
  const eventStatus = eventStatusFunc(event)
  // console.log('!payment.eventId :>> ', payment.eventId)
  // console.log('!event :>> ', event)

  const isEventClosed = isEventClosedFunc(event)

  // const eventStatusProps = EVENT_STATUSES_WITH_TIME.find(
  //   (payTypeItem) => payTypeItem.value === eventStatus
  // )

  return (
    <PayCardWrapper
      sector="event"
      payment={payment}
      cardButtonsProps={{
        showEditButton: eventStatus !== 'closed',
        showDeleteButton: eventStatus !== 'closed',
        itemProps: isEventClosed ? { eventId: null } : undefined,
      }}
    >
      {(payment.payDirection === 'toUser' ||
        payment.payDirection === 'fromUser') &&
        payment.eventId && (
          <PaymentEventUserLeft payment={payment} event={event} />
        )}
    </PayCardWrapper>
  )
}

const PaymentService = ({ payment }) => {
  const service = useAtomValue(serviceSelector(payment.serviceId))
  const serviceStatus = serviceStatusFunc(service)

  const serviceStatusProps = SERVICE_USER_STATUSES.find(
    (payTypeItem) => payTypeItem.value === serviceStatus
  )

  return (
    <PayCardWrapper
      sector="service"
      statusProps={serviceStatusProps}
      payment={payment}
      // cardButtonsProps={{
      //   showEditButton: eventStatus !== 'closed',
      //   showDeleteButton: eventStatus !== 'closed',
      // }}
    >
      {/* {(payment.payDirection === 'toUser' ||
        payment.payDirection === 'fromUser') &&
        payment.eventId &&
        (() => {
          const eventUsers = useAtomValue(
            asyncEventsUsersByEventIdAtom(event?._id)
          )
          const eventUser = eventUsers.find(
            (eventUser) => eventUser.userId === payment.userId
          )
          if (eventUser) return null
          return (
            <Icon
              icon={faUserTimes}
              className="text-danger"
              tooltip="Участник не пришёл"
            />
          )
        })()} */}
    </PayCardWrapper>
  )
}

const PaymentProduct = ({ payment }) => {
  const product = useAtomValue(serviceSelector(payment.productId))
  const productStatus = serviceStatusFunc(product)

  const productStatusProps = PRODUCT_USER_STATUSES.find(
    (payTypeItem) => payTypeItem.value === productStatus
  )

  return (
    <PayCardWrapper
      sector="product"
      statusProps={productStatusProps}
      payment={payment}
      // cardButtonsProps={{
      //   showEditButton: eventStatus !== 'closed',
      //   showDeleteButton: eventStatus !== 'closed',
      // }}
    >
      {/* {(payment.payDirection === 'toUser' ||
        payment.payDirection === 'fromUser') &&
        payment.eventId &&
        (() => {
          const eventUsers = useAtomValue(
            asyncEventsUsersByEventIdAtom(event?._id)
          )
          const eventUser = eventUsers.find(
            (eventUser) => eventUser.userId === payment.userId
          )
          if (eventUser) return null
          return (
            <Icon
              icon={faUserTimes}
              className="text-danger"
              tooltip="Участник не пришёл"
            />
          )
        })()} */}
    </PayCardWrapper>
  )
}

const PaymentInternal = ({ payment }) => {
  return (
    <PayCardWrapper
      sector="internal"
      // statusProps={eventStatusProps}
      payment={payment}
      // cardButtonsProps={{
      //   showEditButton: eventStatus !== 'closed',
      //   showDeleteButton: eventStatus !== 'closed',
      // }}
    >
      {/* {(payment.payDirection === 'toUser' ||
        payment.payDirection === 'fromUser') &&
        payment.eventId &&
        (() => {
          const eventUsers = useAtomValue(
            asyncEventsUsersByEventIdAtom(event?._id)
          )
          const eventUser = eventUsers.find(
            (eventUser) => eventUser.userId === payment.userId
          )
          if (eventUser) return null
          return (
            <Icon
              icon={faUserTimes}
              className="text-danger"
              tooltip="Участник не пришёл"
            />
          )
        })()} */}
    </PayCardWrapper>
  )
}

const PaymentCard = ({ paymentId, hidden = false, style }) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const payment = useAtomValue(paymentSelector(paymentId))
  const loading = useAtomValue(loadingAtom('payment' + paymentId))
  const paymentSector = paymentSectorFunc(payment)
  // const selector =
  //   paymentSector === 'event'
  //     ? eventFullAtomAsync(payment.eventId)
  //     : paymentSector === 'service'
  //     ? serviceSelector(payment.serviceId)
  //     : paymentSector === 'product'
  //     ? productSelector(payment.productId)
  //     : null

  const sectorProps = SECTORS.find((sector) => sector.value === paymentSector)

  // const item = selector ? useAtomValue(selector) : null

  return (
    <CardWrapper
      loading={loading}
      onClick={() => !loading && modalsFunc.payment.edit(payment._id)}
      className="flex items-stretch h-14 tablet:h-16"
      flex={false}
      hidden={hidden}
      style={style}
      gap={false}
    >
      <div
        className={cn(
          'flex items-center justify-center w-7 tablet:w-8 text-white',
          sectorProps ? 'bg-' + sectorProps.color : 'bg-gray-400'
        )}
      >
        <FontAwesomeIcon
          icon={sectorProps?.icon ?? faQuestion}
          className="w-5 tablet:w-6"
        />
      </div>
      {paymentSector === 'event' && <PaymentEvent payment={payment} />}
      {paymentSector === 'service' && <PaymentService payment={payment} />}
      {paymentSector === 'product' && <PaymentProduct payment={payment} />}
      {paymentSector === 'internal' && <PaymentInternal payment={payment} />}
      {!paymentSector && <PayCardWrapper payment={payment} />}
    </CardWrapper>
  )
}

export default PaymentCard
