const individualWeddingsSchema = {
  userId: {
    type: String,
    required: [true, 'Необходимо выбрать пользователя'],
  },
  aiResponse: {
    type: String,
  },
  candidates: {
    type: [String],
    default: [],
  },
}

export default individualWeddingsSchema
