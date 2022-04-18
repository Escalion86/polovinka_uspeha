const directionsSchema = {
  title: {
    type: String,
    // required: [true, 'Введите название курса. Давай включи фантазию!'],
    maxlength: [100, 'Название направления не может превышать 100 символов'],
    default: 'Новое направление',
  },
  description: {
    type: String,
    maxlength: [
      600,
      'Описание не может превышать 600 символов. Краткость - сестра таланта!',
    ],
    default: 'Описание направления',
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

export default directionsSchema
