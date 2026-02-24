import { Schema } from 'mongoose'

const cityProfileSchema = new Schema(
  {
    userId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: 'active',
    },
    role: {
      type: String,
      default: 'client',
    },
    linkedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
)

const globalUsersSchema = {
  phone: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  profile: {
    type: {
      firstName: { type: String, default: '' },
      secondName: { type: String, default: '' },
      thirdName: { type: String, default: '' },
      email: { type: String, default: '' },
      whatsapp: { type: Number, default: null },
      ok: { type: String, default: '' },
      telegram: { type: String, default: '' },
      instagram: { type: String, default: '' },
      vk: { type: String, default: '' },
      gender: { type: String, default: null },
      birthday: { type: Date, default: null },
      relationship: { type: Boolean, default: null },
      haveKids: { type: Boolean, default: null },
      security: { type: Schema.Types.Mixed, default: null },
      images: { type: Array, default: [] },
    },
    default: {},
  },
  cities: {
    type: [String],
    default: [],
    index: true,
  },
  cityProfiles: {
    type: Map,
    of: cityProfileSchema,
    default: {},
  },
  password: {
    type: String,
    default: '',
  },
  personalStatus: {
    type: String,
    default: '',
  },
  registrationType: {
    type: String,
    default: 'phone',
  },
  referrerId: {
    type: String,
    default: null,
  },
  lastActivityAt: {
    type: Date,
    default: null,
  },
  archive: {
    type: Boolean,
    default: false,
  },
  town: {
    type: String,
    default: null,
  },
  authProviders: {
    type: {
      telegram: {
        type: {
          id: { type: Number, default: null, index: true },
        },
        default: {},
      },
    },
    default: {},
  },
  notifications: {
    type: {
      settings: {
        type: Schema.Types.Mixed,
        default: {},
      },
      consentToMailing: {
        type: Boolean,
        default: false,
      },
    },
    default: {},
  },
  meta: {
    type: {
      source: {
        type: String,
        default: 'migration',
      },
      version: {
        type: Number,
        default: 1,
      },
    },
    default: {},
  },
}

export default globalUsersSchema
