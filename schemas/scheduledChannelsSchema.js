const scheduledChannelsSchema = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  telegramId: {
    type: String,
    required: true,
    trim: true,
  },
}

export default scheduledChannelsSchema
