const emailConfirmationsSchema = {
  email: {
    type: String,
    lowercase: true,
    required: [true, 'Введите EMail'],
  },
  password: {
    type: String,
    required: [true, 'Введите Пароль'],
  },
  token: {
    type: String,
    required: [true, 'Введите токен'],
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
}

export default emailConfirmationsSchema
