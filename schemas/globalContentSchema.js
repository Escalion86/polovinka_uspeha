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
  updatedBy: {
    type: String,
    default: null,
  },
}

export default globalContentSchema
