const historiesSchema = {
  schema: {
    type: String,
  },
  action: {
    type: String,
  },
  data: {
    type: [{}],
    default: undefined,
  },
  userId: {
    type: String,
  },
  difference: {
    type: Boolean,
    default: false,
  },
}

export default historiesSchema
