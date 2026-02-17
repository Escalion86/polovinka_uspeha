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
      gender: { type: String, default: null },
      birthday: { type: Date, default: null },
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
