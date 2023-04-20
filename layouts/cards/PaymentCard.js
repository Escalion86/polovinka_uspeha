import { useRecoilValue } from 'recoil'
import { modalsFuncAtom } from '@state/atoms'
import loadingAtom from '@state/atoms/loadingAtom'
import paymentSelector from '@state/selectors/paymentSelector'

import CardButtons from '@components/CardButtons'
import { CardWrapper } from '@components/CardWrapper'
import EventNameById from '@components/EventNameById'
import UserNameById from '@components/UserNameById'
import {
  faCalendarTimes,
  faQuestion,
  faTimesCircle,
  faUserTimes,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  EVENT_STATUSES_WITH_TIME,
  PAY_TYPES,
  PAY_TYPES_OBJECT,
  PRODUCT_PAY_INTERNAL,
  PRODUCT_USER_STATUSES,
  SECTORS,
  SERVICE_USER_STATUSES,
} from '@helpers/constants'
import formatDateTime from '@helpers/formatDateTime'
import cn from 'classnames'
// import isEventClosedFunc from '@helpers/isEventClosed'
import eventStatusFunc from '@helpers/eventStatus'
import serviceStatusFunc from '@helpers/serviceStatus'
import eventSelector from '@state/selectors/eventSelector'
import eventsUsersByEventIdSelector from '@state/selectors/eventsUsersByEventIdSelector'
import Tooltip from '@components/Tooltip'
import paymentSectorFunc from '@helpers/paymentSector'
import serviceSelector from '@state/selectors/serviceSelector'
// import productSelector from '@state/selectors/productSelector'
import ServiceNameById from '@components/ServiceNameById'
import ProductNameById from '@components/ProductNameById'
import InternalPayDirectionIconText from '@components/ValueIconText/InternalPayDirectionIconText'
import ProductPayDirectionIconText from '@components/ValueIconText/ProductPayDirectionIconText'
import ServicePayDirectionIconText from '@components/ValueIconText/ServicePayDirectionIconText'
import EventPayDirectionIconText from '@components/ValueIconText/EventPayDirectionIconText'
import TextLinesLimiter from '@components/TextLinesLimiter'

const Icon = ({ className, icon, tooltip }) => (
  <Tooltip title={tooltip}>
    <div className={cn('flex items-center justify-center w-5', className)}>
      <FontAwesomeIcon icon={icon} className="w-5" />
    </div>
  </Tooltip>
)

const Status = ({ statusProps }) => {
  if (!statusProps) return null
  return (
    <div
      className={cn(
        'flex items-center justify-center w-8 text-white',
        statusProps ? 'bg-' + statusProps.color : 'bg-gray-400'
      )}
    >
      <FontAwesomeIcon icon={statusProps?.icon ?? faQuestion} className="w-6" />
    </div>
  )
}

const EventStatusByEventId = ({ eventId }) => {
  if (!eventId) return null
  const event = useRecoilValue(eventSelector(eventId))
  const eventStatus = eventStatusFunc(event)

  const eventStatusProps = EVENT_STATUSES_WITH_TIME.find(
    (payTypeItem) => payTypeItem.value === eventStatus
  )
  return (
    <div
      className={cn(
        'flex items-center justify-center w-4',
        eventStatusProps ? 'text-' + eventStatusProps.color : 'text-gray-400'
      )}
    >
      <FontAwesomeIcon
        icon={eventStatusProps?.icon ?? faQuestion}
        className="w-4 h-4"
      />
    </div>
  )
}

const PayTypeIcon = ({ payment }) => {
  const payType = PAY_TYPES.find(
    (payTypeItem) => payTypeItem.value === payment.payType
  )
  return (
    <Icon
      icon={payType?.icon ?? faQuestion}
      className={payType ? 'text-' + payType.color : 'text-gray-400'}
      tooltip={PAY_TYPES_OBJECT[payType.value]}
    />
  )
}

const PaySum = ({ payment }) => (
  <div
    className={cn(
      'px-1 text-sm text-right font-bold phoneH:text-base min-w-16',
      payment.payType === 'coupon'
        ? 'text-general'
        : payment.payDirection === 'toUser' ||
          payment.payDirection === 'toEvent'
        ? 'text-danger'
        : 'text-success'
    )}
  >
    {`${
      payment.payDirection === 'toUser' || payment.payDirection === 'toEvent'
        ? '-'
        : ''
    }${payment.sum / 100} ₽`}
  </div>
)

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
        <ServiceNameById
          serviceId={payment.serviceId}
          className="font-bold text-general"
        />
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
          <TextLinesLimiter lines={2} className="text-xs leading-3">
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
            <Icon
              icon={faTimesCircle}
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

const PaymentEvent = ({ payment }) => {
  const event = useRecoilValue(eventSelector(payment.eventId))
  const eventStatus = eventStatusFunc(event)

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
      }}
    >
      {(payment.payDirection === 'toUser' ||
        payment.payDirection === 'fromUser') &&
        payment.eventId &&
        (() => {
          const eventUsers = useRecoilValue(
            eventsUsersByEventIdSelector(event?._id)
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
        })()}
    </PayCardWrapper>
  )
}

const PaymentService = ({ payment }) => {
  const service = useRecoilValue(serviceSelector(payment.serviceId))
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
          const eventUsers = useRecoilValue(
            eventsUsersByEventIdSelector(event?._id)
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
  const product = useRecoilValue(serviceSelector(payment.productId))
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
          const eventUsers = useRecoilValue(
            eventsUsersByEventIdSelector(event?._id)
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
          const eventUsers = useRecoilValue(
            eventsUsersByEventIdSelector(event?._id)
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
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const payment = useRecoilValue(paymentSelector(paymentId))
  const loading = useRecoilValue(loadingAtom('payment' + paymentId))
  const paymentSector = paymentSectorFunc(payment)
  // const selector =
  //   paymentSector === 'event'
  //     ? eventSelector(payment.eventId)
  //     : paymentSector === 'service'
  //     ? serviceSelector(payment.serviceId)
  //     : paymentSector === 'product'
  //     ? productSelector(payment.productId)
  //     : null

  const sectorProps = SECTORS.find((sector) => sector.value === paymentSector)

  // const item = selector ? useRecoilValue(selector) : null

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
