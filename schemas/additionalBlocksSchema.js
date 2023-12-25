const additionalBlocksSchema = {
  title: {
    type: String,
    // required: [true, 'Введите название курса. Давай включи фантазию!'],
    // maxlength: [100, 'Название блока не может превышать 100 символов'],
    default: 'Новый блок',
  },
  description: {
    type: String,
    // maxlength: [
    //   000,
    //   'Описание не может превышать 2000 символов. Краткость - сестра таланта!',
    // ],
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  index: {
    type: Number,
    default: null,
  },
  menuName: {
    type: String,
    default: '',
  },
  showOnSite: {
    type: Boolean,
    default: true,
  },
}

export default additionalBlocksSchema
