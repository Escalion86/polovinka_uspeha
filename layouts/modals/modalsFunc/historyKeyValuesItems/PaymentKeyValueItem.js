import { EventItemFromId, ServiceItemFromId } from '@components/ItemCards'
import UserNameById from '@components/UserNameById'
import { PAY_TYPES, SECTORS2 } from '@helpers/constants'
import formatDateTime from '@helpers/formatDateTime'

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

const PaymentKeyValueItem = ({ objKey, value }) =>
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

export default PaymentKeyValueItem
