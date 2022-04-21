const eventsSchema = {
  title: {
    type: String,
    // required: [true, 'Введите название курса. Давай включи фантазию!'],
    maxlength: [100, 'Название мероприятия не может превышать 100 символов'],
    default: 'Новое мероприятие',
  },
  description: {
    type: String,
    maxlength: [
      2000,
      'Описание не может превышать 2000 символов. Краткость - сестра таланта!',
    ],
    default: 'Описание мероприятия',
  },
  date: {
    type: Date,
    default: null,
  },
  address: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  showOnSite: {
    type: Boolean,
    default: true,
  },
}

export default eventsSchema
