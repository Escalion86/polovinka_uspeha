const paymentsSchema = {
  sector: {
    type: String,
    required: [
      true,
      'Необходимо указать сферу транзакции. Мероприятие, товар, услуга или внутренние транзакции?',
    ],
  },
  payDirection: {
    type: String,
    required: [
      true,
      'Необходимо указать направление транзакции. Кто кому платит то?',
    ],
  },
  userId: {
    type: String,
    // required: [
    //   true,
    //   'Необходимо указать пользователя. А то с кем потом связываться то? С Папой Римским?',
    // ],
  },
  eventId: {
    type: String,
  },
  serviceId: {
    type: String,
  },
  productId: {
    type: String,
  },
  serviceUserId: {
    type: String,
  },
  productUserId: {
    type: String,
  },
  payType: {
    type: String,
    required: [
      true,
      'Необходимо указать тип оплаты. Не бартером же с тобой расплатились...',
    ],
  },
  sum: {
    type: Number,
    min: [0, 'Сумма не может быть меньше нуля'],
    // min: [
    //   1,
    //   'Сумма не может быть равна нулю. Или ты из своих карманных расплатился?',
    // ],
    max: [
      99999999,
      'Сумма не может превышать 999999,99 руб. Или ты в черную работаешь?',
    ],
    default: null,
  },
  status: {
    type: String,
    required: [true, 'Необходимо указать статус'],
    default: 'created',
  },
  payAt: {
    type: Date,
    default: () => Date.now(),
  },
  comment: {
    type: String,
    default: '',
  },
}

export default paymentsSchema
