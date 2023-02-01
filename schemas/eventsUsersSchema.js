const eventsUsersSchema = {
  eventId: {
    type: String,
    required: [true, 'Необходимо выбрать мероприятие'],
  },
  userId: {
    type: String,
    required: [true, 'Необходимо выбрать пользователя'],
  },
  status: {
    type: String,
    default: 'participant',
  },
  userStatus: {
    type: String,
    default: null,
  },
  eventSubtypeNum: {
    type: Number,
    default: 0,
  },
  comment: {
    type: String,
    default: '',
  },
}

export default eventsUsersSchema
