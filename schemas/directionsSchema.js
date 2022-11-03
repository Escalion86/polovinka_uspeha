const directionsSchema = {
  title: {
    type: String,
    // required: [true, 'Введите название курса. Давай включи фантазию!'],
    // maxlength: [100, 'Название направления не может превышать 100 символов'],
    default: 'Новое направление',
    formOptions: {
      name: 'Название',
      type: 'text',
    },
  },
  description: {
    type: String,
    // maxlength: [
    //   2000,
    //   'Описание не может превышать 2000 символов. Краткость - сестра таланта!',
    // ],
    default: 'Описание направления',
    formOptions: {
      name: 'Описание',
      type: 'editabletextarea',
    },
  },
  image: {
    type: String,
    default: '',
    formOptions: {
      name: 'Картинка',
      type: 'image',
    },
  },
  index: {
    type: Number,
    default: null,
  },
  showOnSite: {
    type: Boolean,
    default: true,
    formOptions: {
      name: 'Показывать на сайте',
      type: 'checkbox',
    },
  },
  questionnaireId: {
    type: String,
  },
}

export default directionsSchema
