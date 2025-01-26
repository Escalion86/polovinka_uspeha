const phoneConfirmsSchema = {
  id: {
    type: Number,
    required: false,
  },
  ucaller_id: {
    type: Number,
    required: false,
  },
  callId: {
    type: Number,
    required: false,
  },
  phone: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: false,
  },
  status: {
    type: Boolean,
    required: false,
  },
  confirmed: {
    type: Boolean,
    required: false,
  },
  tryNum: {
    type: Number,
    required: false,
  },
}

export default phoneConfirmsSchema
