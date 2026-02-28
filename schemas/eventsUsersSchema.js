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
  comment: {
    type: String,
    default: '',
  },
  likes: {
    type: Array,
    default: () => {
      return null
    },
  },
  seeLikesResult: {
    type: Boolean,
    default: false,
  },
  likeSortNum: {
    type: Number,
    default: null,
  },
  subEventId: {
    type: String,
    default: null,
  },
  googleCalendarUserEventId: {
    type: String,
    default: null,
  },
  googleCalendarUserCalendarId: {
    type: String,
    default: null,
  },
  googleCalendarSyncedAt: {
    type: Date,
    default: null,
  },
}

export default eventsUsersSchema
