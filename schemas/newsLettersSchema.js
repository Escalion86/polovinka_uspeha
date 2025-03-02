const newsLettersSchema = {
  name: {
    type: String,
    default: '',
  },
  newsletters: {
    type: Array,
    default: [
      {
        userId: String,
        message: String,
        whatsappMessageId: String,
        telegramMessageId: String,
      },
    ],
  },
  status: {
    type: String,
    default: 'active',
  },
}

export default newsLettersSchema
