const additionalBlocksSchema = {
  title: {
    type: String,
    // required: [true, 'Введите название курса. Давай включи фантазию!'],
    // maxlength: [100, 'Название блока не может превышать 100 символов'],
    default: 'Новый блок',
    formOptions: {
      name: 'Название',
      type: 'text',
    },
  },
  description: {
    type: String,
    // maxlength: [
    //   000,
    //   'Описание не может превышать 2000 символов. Краткость - сестра таланта!',
    // ],
    default: '',
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
  menuName: {
    type: String,
    default: '',
    formOptions: {
      name: 'Название в меню',
      type: 'menuName',
    },
  },
  showOnSite: {
    type: Boolean,
    default: true,
    formOptions: {
      name: 'Показывать на сайте',
      type: 'checkbox',
    },
  },
}

export default additionalBlocksSchema
