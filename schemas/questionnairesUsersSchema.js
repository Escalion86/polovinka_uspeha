const questionnairesUsersSchema = {
  userId: {
    type: String,
    required: [true, 'Необходимо выбрать пользователя'],
  },
  questionnaireId: {
    type: String,
    required: [true, 'Необходимо выбрать анкету'],
  },
  data: {
    type: [{}],
    default: undefined,
  },
}

export default questionnairesUsersSchema
