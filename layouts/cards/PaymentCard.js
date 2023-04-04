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
import productSelector from '@state/selectors/productSelector'
import ServiceNameById from '@components/ServiceNameById'
import ProductNameById from '@components/ProductNameById'

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

const PayText = ({ payment }) => (
  <div className="flex flex-col items-start flex-1 h-full ml-1 text-sm leading-4 overflow-x-clip justify-evenly gap-x-2 phoneH:text-base">
    <div className="leading-4 whitespace-nowrap">
      {formatDateTime(payment.payAt)}
    </div>
    {(payment.payDirection === 'toUser' ||
      payment.payDirection === 'fromUser') && (
      <UserNameById userId={payment.userId} noWrap className="font-bold" />
    )}
    {(payment.payDirection === 'toEvent' ||
      payment.payDirection === 'fromEvent') && (
      <EventNameById
        eventId={payment.eventId}
        className="font-bold leading-[14px] text-general"
      />
    )}
    {(payment.payDirection === 'toService' ||
      payment.payDirection === 'fromService') && (
      <ServiceNameById
        serviceId={payment.serviceId}
        className="font-bold leading-[14px] text-general"
      />
    )}
    {(payment.payDirection === 'toProduct' ||
      payment.payDirection === 'fromProduct') && (
      <ProductNameById
        productId={payment.productId}
        className="font-bold leading-[14px] text-general"
      />
    )}
  </div>
)

const PayCardWrapper = ({
  sector,
  statusProps,
  payment,
  children,
  cardButtonsProps,
}) => {
  return (
    <div className="flex flex-1">
      <Status statusProps={statusProps} />
      <PayText payment={payment} />
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

        <PaySum payment={payment} />
        <PayTypeIcon payment={payment} />
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

  const eventStatusProps = EVENT_STATUSES_WITH_TIME.find(
    (payTypeItem) => payTypeItem.value === eventStatus
  )

  return (
    <PayCardWrapper
      sector="event"
      statusProps={eventStatusProps}
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
      className="flex items-stretch h-12"
      flex={false}
      hidden={hidden}
      style={style}
      gap={false}
    >
      <div
        className={cn(
          'flex items-center justify-center w-8 text-white',
          sectorProps ? 'bg-' + sectorProps.color : 'bg-gray-400'
        )}
      >
        <FontAwesomeIcon
          icon={sectorProps?.icon ?? faQuestion}
          className="w-6"
        />
      </div>
      {paymentSector === 'event' && <PaymentEvent payment={payment} />}
      {paymentSector === 'service' && <PaymentService payment={payment} />}
      {paymentSector === 'product' && <PaymentProduct payment={payment} />}
      {!paymentSector && <PayCardWrapper payment={payment} />}
    </CardWrapper>
  )
}

export default PaymentCard
