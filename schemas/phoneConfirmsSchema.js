const phoneConfirmsSchema = {
  ucaller_id: {
    type: Number,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  confirmed: {
    type: Boolean,
    required: false,
  },
  tryNum: {
    type: Number,
    required: true,
    default: 1,
  },
}

export default phoneConfirmsSchema
