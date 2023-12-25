const directionsSchema = {
  title: {
    type: String,
    // required: [true, 'Введите название курса. Давай включи фантазию!'],
    // maxlength: [100, 'Название направления не может превышать 100 символов'],
    default: 'Новое направление',
  },
  shortDescription: {
    type: String,
    default: 'Короткое описание',
  },
  description: {
    type: String,
    // maxlength: [
    //   2000,
    //   'Описание не может превышать 2000 символов. Краткость - сестра таланта!',
    // ],
    default: 'Описание направления',
  },
  // image: {
  //   type: String,
  //   default: '',
  // },
  index: {
    type: Number,
    default: null,
  },
  showOnSite: {
    type: Boolean,
    default: true,
  },
  questionnaireId: {
    type: String,
  },
  rules: {
    userStatus: { type: String, default: 'select' },
    userRelationship: { type: String, default: 'select' },
  },
}

export default directionsSchema
