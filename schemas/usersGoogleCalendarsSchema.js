const usersGoogleCalendarsSchema = {
  userId: {
    type: String,
    required: [true, 'Необходимо выбрать пользователя'],
  },
  connected: {
    type: Boolean,
    default: false,
  },
  calendarId: {
    type: String,
    default: null,
  },
  calendarSummary: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    lowercase: true,
    default: null,
  },
  tokens: {
    type: Object,
    default: null,
  },
  oauthState: {
    type: String,
    default: null,
  },
}

export default usersGoogleCalendarsSchema
