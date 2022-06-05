import CardButtons from '@components/CardButtons'
import { CardWrapper } from '@components/CardWrapper'
import Fab from '@components/Fab'
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PAY_TYPES } from '@helpers/constants'
import formatDateTime from '@helpers/formatDateTime'

import { modalsFuncAtom } from '@state/atoms'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import loadingAtom from '@state/atoms/loadingAtom'
import paymentsAtom from '@state/atoms/paymentsAtom'
import paymentSelector from '@state/selectors/paymentSelector'
import cn from 'classnames'
import { useRecoilValue } from 'recoil'

const PaymentCard = ({ paymentId }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const payment = useRecoilValue(paymentSelector(paymentId))
  const loading = useRecoilValue(loadingAtom('payment' + paymentId))
  const itemFunc = useRecoilValue(itemsFuncAtom)

  const payType = PAY_TYPES.find(
    (payTypeItem) => payTypeItem.value === payment.payType
  )

  return (
    <CardWrapper
      loading={loading}
      onClick={() => !loading && modalsFunc.payment.edit(payment._id)}
    >
      <div
        className={cn(
          'duration-500 flex justify-center items-center w-8 text-white',
          payType ? 'bg-' + payType.color : 'bg-gray-400'
        )}
      >
        <FontAwesomeIcon icon={payType?.icon ?? faQuestion} className="w-6" />
      </div>
      <div className="flex justify-between flex-1 gap-2 p-2">
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

        <div className="items-center flex-1">
          <div className="flex flex-col gap-y-1">
            <div className="whitespace-nowrap">
              {/* <span className="font-semibold">№ {payment.number}</span> от{' '} */}
              <span className="font-semibold">
                {formatDateTime(payment.payAt)}
              </span>
            </div>
            {/* {order ? (
              <div className="flex-1 italic">
                Заказ № {order.number} на{' '}
                {formatDateTime(order.deliveryDateFrom)}
              </div>
            ) : (
              <div className="flex-1 italic text-red-600">Заказ не найден</div>
            )} */}
          </div>
        </div>
      </div>
      {/* <div className="text-right">
        <div className="font-bold">{payment.sum} ₽</div>
      </div> */}
      <div className="flex flex-col-reverse items-end justify-between laptop:flex-row laptop:items-center">
        <div className="px-1 font-bold">{payment.sum / 100} ₽</div>
        <CardButtons item={payment} typeOfItem="payment" />
      </div>
    </CardWrapper>
  )
}

const PaymentsContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const payments = useRecoilValue(paymentsAtom)

  return (
    <>
      {payments?.length > 0 ? (
        payments.map((payment) => (
          <PaymentCard key={payment._id} paymentId={payment._id} />
        ))
      ) : (
        <div className="flex justify-center p-2">Нет транзакций</div>
      )}
      <Fab onClick={() => modalsFunc.payments.edit()} show />
    </>
  )
}

export default PaymentsContent
