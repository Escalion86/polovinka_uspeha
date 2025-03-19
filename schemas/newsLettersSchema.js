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
        // whatsappMessage: String,
        // telegramMessage: String,
        whatsappMessageId: String,
        telegramMessageId: String,
        whatsappSuccess: Boolean,
        telegramSuccess: Boolean,
        whatsappError: String,
        telegramError: String,
        variables: Object,
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
