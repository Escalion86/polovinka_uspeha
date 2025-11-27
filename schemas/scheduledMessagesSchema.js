const scheduledMessagesSchema = {
  name: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
  sendTime: {
    type: String,
    required: true,
  },
  sendDate: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: 'needCheck',
  },
  sentAt: {
    type: Date,
    default: null,
  },
  channel: {
    type: {
      channelId: {
        type: String,
        default: '',
      },
      name: {
        type: String,
        default: '',
      },
      telegramId: {
        type: String,
        default: '',
      },
    },
    default: null,
  },
}

export default scheduledMessagesSchema
