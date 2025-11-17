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
        whatsappPhone: Number,
        // whatsappMessage: String,
        // telegramMessage: String,
        whatsappMessageId: String,
        telegramMessageId: String,
        whatsappSuccess: Boolean,
        telegramSuccess: Boolean,
        whatsappStatus: String,
        telegramStatus: String,
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
  sendType: {
    type: String,
    default: 'whatsapp-only',
  },
  message: {
    type: String,
    default: '',
  },
}

export default newsLettersSchema
