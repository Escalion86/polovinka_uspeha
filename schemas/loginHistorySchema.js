const loginHistorySchema = {
  userId: {
    type: String,
    required: [true, 'Необходимо выбрать пользователя'],
  },
  browser: {
    type: Map,
  },
}

export default loginHistorySchema
