const notificationsHistorySchema = {
  scope: {
    type: String,
    default: 'shared',
    index: true,
  },
  location: {
    type: String,
    default: null,
    index: true,
  },
  notificationId: {
    type: String,
    required: [true, 'Необходимо указать идентификатор уведомления'],
    index: true,
  },
  type: {
    type: String,
    default: 'unknown',
    index: true,
  },
  types: {
    type: [String],
    default: [],
  },
  title: {
    type: String,
    default: 'Половинка успеха',
  },
  body: {
    type: String,
    default: '',
  },
  url: {
    type: String,
    default: '',
  },
  tag: {
    type: String,
    default: '',
  },
  channels: {
    type: Map,
    of: Object,
    default: {},
  },
  audience: {
    type: Object,
    default: {},
  },
  deliveredAt: {
    type: Date,
    default: () => new Date(),
    index: true,
  },
}

export default notificationsHistorySchema
