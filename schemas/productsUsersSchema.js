const productsUsersSchema = {
  productId: {
    type: String,
    required: [true, 'Необходимо выбрать продукт'],
  },
  userId: {
    type: String,
    required: [true, 'Необходимо выбрать пользователя'],
  },
  answers: {
    type: Map,
    default: null,
  },
  status: {
    type: String,
    default: 'active',
  },
  closeDate: {
    type: Date,
    default: null,
  },
  props: {
    type: Map,
    default: null,
  },
}

export default productsUsersSchema
