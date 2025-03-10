const individualWeddingsSchema = {
  userId: {
    type: String,
    required: [true, 'Необходимо выбрать пользователя'],
  },
  aiResponse: {
    type: String,
  },
  usersFilter: {
    type: {},
    default: {},
  },
  allCandidatesIds: {
    type: [String],
    default: [],
  },
  chosenCandidatesIds: {
    type: [String],
    default: [],
  },
}

export default individualWeddingsSchema
