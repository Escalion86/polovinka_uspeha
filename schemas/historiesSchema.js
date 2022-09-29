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
}

export default historiesSchema
