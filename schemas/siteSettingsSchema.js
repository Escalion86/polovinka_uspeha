import { Schema } from 'mongoose'

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
  eventsTags: {
    type: [{ text: String, color: String }],
    default: [],
  },
  custom: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {},
  },
  fabMenu: {
    type: [{}],
    default: [],
  },
  supervisor: {
    type: { name: String, photo: String, quote: String, showOnSite: Boolean },
    default: {},
  },
  dateStartProject: {
    type: Date,
    default: null,
  },
  headerInfo: {
    type: {
      whatsapp: {
        type: Number,
        default: null,
      },
      telegram: {
        type: String,
        default: null,
      },
      memberChatLink: {
        type: String,
        default: null,
      },
    },
  },
}

export default siteSettingsSchema
