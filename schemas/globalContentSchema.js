const aboutSpaceCardSchema = {
  id: String,
  title: String,
  text: String,
  wide: Boolean,
  tone: String,
  bgMode: String,
  bgColor1: String,
  bgColor2: String,
  index: Number,
}

const cityPolicySchema = {
  status: {
    type: String,
    enum: ['active', 'closing', 'archived'],
    default: 'active',
  },
  allowRegistration: {
    type: Boolean,
    default: true,
  },
  allowLogin: {
    type: Boolean,
    default: true,
  },
  allowEventSignup: {
    type: Boolean,
    default: true,
  },
  allowEventManagement: {
    type: Boolean,
    default: true,
  },
  allowPublicListing: {
    type: Boolean,
    default: true,
  },
  allowVkAuth: {
    type: Boolean,
    default: false,
  },
  allowTelegramAuth: {
    type: Boolean,
    default: true,
  },
}

const citySchema = {
  slug: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['active', 'closing', 'archived'],
    default: 'active',
  },
  isVisibleInPublicSelector: {
    type: Boolean,
    default: true,
  },
  timeZone: {
    type: String,
    default: null,
  },
  contactPhone: {
    type: String,
    default: null,
  },
  contactTelegram: {
    type: String,
    default: null,
  },
  allowRegistration: {
    type: Boolean,
    default: true,
  },
  allowLogin: {
    type: Boolean,
    default: true,
  },
  allowEventSignup: {
    type: Boolean,
    default: true,
  },
  allowEventManagement: {
    type: Boolean,
    default: true,
  },
  allowPublicListing: {
    type: Boolean,
    default: true,
  },
  allowVkAuth: {
    type: Boolean,
    default: false,
  },
  allowTelegramAuth: {
    type: Boolean,
    default: true,
  },
  index: {
    type: Number,
    default: 0,
  },
}

const globalContentSchema = {
  key: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  aboutSpaceCards: {
    type: [aboutSpaceCardSchema],
    default: [],
  },
  cityPolicies: {
    type: Map,
    of: cityPolicySchema,
    default: {},
  },
  cities: {
    type: [citySchema],
    default: [],
  },
  updatedBy: {
    type: String,
    default: null,
  },
}

export default globalContentSchema
