const siteSettingsSchema = {
  email: {
    type: String,
    lowercase: true,
    default: null,
  },
  phone: {
    type: Number,
    default: null,
  },
  whatsapp: {
    type: Number,
    default: null,
  },
  viber: {
    type: Number,
    default: null,
  },
  telegram: {
    type: String,
    default: null,
  },
  instagram: {
    type: String,
    default: null,
  },
  vk: {
    type: String,
    default: null,
  },
  codeSendService: {
    type: String,
    default: 'telefonip',
  },
}

export default siteSettingsSchema
