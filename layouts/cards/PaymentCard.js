import CardButtons from '@components/CardButtons'
import { CardWrapper } from '@components/CardWrapper'
import DateTimeEvent from '@components/DateTimeEvent'
import EventNameById from '@components/EventNameById'
import UserNameById from '@components/UserNameById'
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PAY_TYPES } from '@helpers/constants'
import dateToDateTimeStr from '@helpers/dateToDateTimeStr'
import formatDateTime from '@helpers/formatDateTime'
import { modalsFuncAtom } from '@state/atoms'
import loadingAtom from '@state/atoms/loadingAtom'
import paymentSelector from '@state/selectors/paymentSelector'
import userSelector from '@state/selectors/userSelector'
import cn from 'classnames'
import { useRecoilValue } from 'recoil'

const PaymentCard = ({ paymentId, hidden = false, style }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const payment = useRecoilValue(paymentSelector(paymentId))
  const loading = useRecoilValue(loadingAtom('payment' + paymentId))

  const payType = PAY_TYPES.find(
    (payTypeItem) => payTypeItem.value === payment.payType
  )

  return (
    <CardWrapper
      loading={loading}
      onClick={() => !loading && modalsFunc.payment.edit(payment._id)}
      flex={false}
      className="flex items-stretch h-10"
      hidden={hidden}
      style={style}
    >
      <div
        className={cn(
          'flex items-center justify-center w-8 text-white',
          payType ? 'bg-' + payType.color : 'bg-gray-400'
        )}
      >
        <FontAwesomeIcon icon={payType?.icon ?? faQuestion} className="w-6" />
      </div>
      <div className="flex flex-col items-start flex-1 h-full text-sm leading-4 overflow-x-clip justify-evenly gap-x-2 phoneH:text-base">
        <div className="leading-4 whitespace-nowrap">
          {formatDateTime(payment.payAt)}
        </div>
        {(payment.payDirection === 'toUser' ||
          payment.payDirection === 'fromUser') && (
          <UserNameById userId={payment.userId} noWrap className="font-bold" />
        )}
        {payment.payDirection === 'toEvent' && (
          <EventNameById
            eventId={payment.eventId}
            className="font-bold text-general"
          />
        )}
        {/* <div className="items-center flex-1">
          <div className="flex flex-col flex-wrap justify-between gap-x-4 phoneH:flex-row">
            <div>
              <span className="font-semibold">№ {payment.number}</span> от{' '}
              <span className="font-semibold">
                {formatDateTime(payment.payAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 italic">
          Заказ № {order.number} на {formatDateTime(order.deliveryDateFrom)}
        </div> */}
      </div>
      {/* <div className="text-right">
        <div className="font-bold">{payment.sum} ₽</div>
      </div> */}
      <div className="flex items-center justify-between">
        <div
          className={cn(
            'px-1 text-sm font-bold phoneH:text-base',
            payment.payDirection === 'toUser' ||
              payment.payDirection === 'toEvent'
              ? 'text-danger'
              : 'text-success'
          )}
        >
          {`${
            payment.payDirection === 'toUser' ||
            payment.payDirection === 'toEvent'
              ? '-'
              : ''
          }${payment.sum / 100} ₽`}
        </div>
        <CardButtons item={payment} typeOfItem="payment" alwaysCompactOnPhone />
      </div>
    </CardWrapper>
  )
}

export default PaymentCard
