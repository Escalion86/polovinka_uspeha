const questionnairesSchema = {
  name: {
    type: String,
    required: true,
  },
  data: {
    type: [{}],
    default: undefined,
  },
}

export default questionnairesSchema
