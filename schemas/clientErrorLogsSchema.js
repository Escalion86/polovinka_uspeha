const clientErrorLogsSchema = {
  message: {
    type: String,
    default: '',
  },
  stack: {
    type: String,
    default: '',
  },
  componentStack: {
    type: String,
    default: '',
  },
  url: {
    type: String,
    default: '',
  },
  userAgent: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  userInfo: {
    type: Object,
    default: null,
  },
  meta: {
    type: Object,
    default: null,
  },
}

export default clientErrorLogsSchema
