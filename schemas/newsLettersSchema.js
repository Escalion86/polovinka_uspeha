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
        telegramId: String,
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
  sendingStatus: {
    type: String,
    default: 'sent',
  },
  sendMode: {
    type: String,
    default: 'immediate',
  },
  plannedSendDate: {
    type: String,
    default: '',
  },
  plannedSendTime: {
    type: String,
    default: '',
  },
  sendType: {
    type: String,
    default: 'whatsapp-only',
  },
  image: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
}

export default newsLettersSchema
