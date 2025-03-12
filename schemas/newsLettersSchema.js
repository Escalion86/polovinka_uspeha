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
        whatsappMessage: String,
        telegramMessage: String,
        whatsappMessageId: String,
        telegramMessageId: String,
        whatsappError: String,
        telegramError: String,
      },
    ],
  },
  status: {
    type: String,
    default: 'active',
  },
  message: {
    type: String,
    default: '',
  },
}

export default newsLettersSchema
