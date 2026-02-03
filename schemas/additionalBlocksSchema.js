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
  showOnIndex2: {
    type: Boolean,
    default: false,
  },
  tiles: {
    type: Array,
    default: [],
  },
  blockBgMode: {
    type: String,
    default: 'solid',
  },
  blockBgColor1: {
    type: String,
    default: '#ffffff',
  },
  blockBgColor2: {
    type: String,
    default: '#f6f3f1',
  },
}

export default additionalBlocksSchema
