const toolsTemplatesSchema = {
  tool: {
    type: String,
    lowercase: true,
    default: null,
  },
  name: {
    type: String,
    default: null,
  },
  creatorId: {
    type: String,
    default: null,
  },
  template: {
    type: {},
    default: {},
  },
}

export default toolsTemplatesSchema
