import HistoryItem from '@components/HistoryItem'
import { EventItemFromId, ServiceItemFromId } from '@components/ItemCards'
import UserNameById from '@components/UserNameById'
import compareObjectsWithDif from '@helpers/compareObjectsWithDif'
import { PAY_TYPES, SECTORS2 } from '@helpers/constants'
import formatDateTime from '@helpers/formatDateTime'
import { historiesOfPaymentSelector } from '@state/atoms/historiesOfPaymentAtom'
import paymentSelector from '@state/selectors/paymentSelector'
import { useRecoilValue } from 'recoil'

const paymentKeys = {
  sector: 'Сектор', //
  payDirection: 'Направление',
  userId: 'Пользователь', //
  eventId: 'Мероприятие', //
  serviceId: 'Услуга', //
  productId: 'Продукт',
  serviceUserId: 'Заявка на покупку услуги',
  productUserId: 'Заявка на покупку товара',
  payType: 'Тип оплаты', //
  sum: 'Сумма', //
  status: 'Статус',
  payAt: 'Дата и время оплаты', //
  comment: 'Комментарий', //
}

const payDirectionObj = {
  toUser: 'Оплата пользователю',
  fromUser: 'Оплата от пользователя',
  toEvent: 'Затраты на мероприятие',
  fromEvent: 'Доп. доходы с мероприятия',
  toService: 'Затраты на услугу',
  fromService: 'Доп. доходы с услуги',
  toProduct: 'Затраты на продукт',
  fromProduct: 'Доп. доходы с продукта',
  toInternal: 'Затраты',
  fromInternal: 'Доп. доходы с проекта',
}

const KeyValueItem = ({ objKey, value }) =>
  value === null || value === undefined ? (
    '[не указано]'
  ) : objKey === 'sector' ? (
    SECTORS2.find((item) => item.value === value)?.name
  ) : objKey === 'comment' ? (
    value
  ) : objKey === 'userId' ? (
    <UserNameById userId={value} thin trunc={1} />
  ) : objKey === 'payAt' ? (
    formatDateTime(value)
  ) : objKey === 'sum' ? (
    value / 100 + ' ₽'
  ) : objKey === 'eventId' ? (
    <EventItemFromId eventId={value} bordered />
  ) : objKey === 'serviceId' ? (
    <ServiceItemFromId serviceId={value} bordered />
  ) : objKey === 'payDirection' ? (
    payDirectionObj[value]
  ) : objKey === 'status' ? (
    value
  ) : // objKey=== 'productId' ? (value ? (
  //   <ProductItemFromId productId={value} bordered />
  // ) : (
  // 'не выбрано'
  // ) :
  objKey === 'payType' ? (
    PAY_TYPES.find((item) => item.value === value)?.name
  ) : typeof value === 'object' ? (
    <pre>{JSON.stringify(value)}</pre>
  ) : typeof value === 'boolean' ? (
    value ? (
      'Да'
    ) : (
      'Нет'
    )
  ) : (
    value
  )

const paymentHistoryFunc = (paymentId) => {
  const PaymentHistoryModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const payment = useRecoilValue(paymentSelector(paymentId))
    const paymentHistory = useRecoilValue(historiesOfPaymentSelector(paymentId))
    if (!payment || !paymentId)
      return (
        <div className="flex justify-center w-full text-lg ">
          ОШИБКА! Транзакция не найдена!
        </div>
      )

    return (
      <div className="flex flex-col items-center flex-1 gap-y-2">
        {/* <div className="text-lg font-bold">{event.title}</div> */}
        {/* <DateTimeEvent
          wrapperClassName="text-base laptop:text-lg font-bold leading-4 laptop:leading-5 justify-center laptop:justify-start"
          dateClassName="text-general"
          timeClassName="italic"
          durationClassName="italic text-base font-normal"
          event={event}
          showDayOfWeek
          fullMonth
        /> */}
        <div className="flex flex-col w-full gap-y-1">
          {paymentHistory.map(
            ({ action, data, userId, createdAt, _id }, index) => {
              const changes = compareObjectsWithDif(
                index > 0 ? paymentHistory[index - 1].data[0] : {},
                data[0]
              )

              // console.log('changes :>> ', changes)

              return (
                <HistoryItem
                  key={_id}
                  action={action}
                  changes={changes}
                  createdAt={createdAt}
                  userId={userId}
                  KeyValueItem={KeyValueItem}
                  keys={paymentKeys}
                />
              )
            }
          )}
        </div>
      </div>
    )
  }

  return {
    title: `История изменений транзакции`,
    Children: PaymentHistoryModal,
    declineButtonName: 'Закрыть',
    showDecline: true,
  }
}

export default paymentHistoryFunc
