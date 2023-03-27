const servicesUsersSchema = {
  serviceId: {
    type: String,
    required: [true, 'Необходимо выбрать услугу'],
  },
  userId: {
    type: String,
    required: [true, 'Необходимо выбрать пользователя'],
  },
  answers: {
    type: Map,
    default: null,
  },
  status: {
    type: String,
    default: 'active',
  },
  props: {
    type: Map,
    default: null,
  },
}

export default servicesUsersSchema
