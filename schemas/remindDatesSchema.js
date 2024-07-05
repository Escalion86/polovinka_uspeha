const remindDatesSchema = {
  name: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: null,
  },
  comment: {
    type: String,
    default: '',
  },
}

export default remindDatesSchema
