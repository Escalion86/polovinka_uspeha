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
}

export default eventsUsersSchema
