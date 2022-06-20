const eventsUsersSchema = {
  eventId: {
    type: String,
    required: [true, 'Необходимо выбрать мероприятие'],
  },
  userId: {
    type: String,
    required: [true, 'Необходимо выбрать пользователя'],
  },
  // role: {
  //   type: String, // participant -участник
  //   required: [true, 'Необходимо выбрать роль пользователя на мероприятии'],
  // },
}

export default eventsUsersSchema
