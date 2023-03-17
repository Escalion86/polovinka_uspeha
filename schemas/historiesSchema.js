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
}

export default historiesSchema
