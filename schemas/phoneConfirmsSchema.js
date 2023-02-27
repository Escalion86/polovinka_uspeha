const phoneConfirmsSchema = {
  id: {
    type: Number,
    required: false,
  },
  ucaller_id: {
    type: Number,
    required: false,
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
