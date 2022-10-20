import CardButtons from '@components/CardButtons'
import { CardWrapper } from '@components/CardWrapper'
import DateTimeEvent from '@components/DateTimeEvent'
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PAY_TYPES } from '@helpers/constants'
import dateToDateTimeStr from '@helpers/dateToDateTimeStr'
import formatDateTime from '@helpers/formatDateTime'
import { modalsFuncAtom } from '@state/atoms'
import loadingAtom from '@state/atoms/loadingAtom'
import paymentSelector from '@state/selectors/paymentSelector'
import cn from 'classnames'
import { useRecoilValue } from 'recoil'

const PaymentCard = ({ paymentId, hidden = false }) => {
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
      className="flex items-stretch"
      hidden={hidden}
    >
      <div
        className={cn(
          'flex items-center justify-center w-8 text-white',
          payType ? 'bg-' + payType.color : 'bg-gray-400'
        )}
      >
        <FontAwesomeIcon icon={payType?.icon ?? faQuestion} className="w-6" />
      </div>
      <div className="flex items-center justify-between flex-1 gap-x-2">
        <div className="">{formatDateTime(payment.payAt)}</div>
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
        <div className="px-1 font-bold">{payment.sum / 100} ₽</div>
        <CardButtons item={payment} typeOfItem="payment" alwaysCompactOnPhone />
      </div>
    </CardWrapper>
  )
}

export default PaymentCard
