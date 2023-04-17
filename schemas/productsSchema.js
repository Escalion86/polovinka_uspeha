import {
  DEFAULT_USERS_STATUS_ACCESS,
  DEFAULT_USERS_STATUS_DISCOUNT,
} from '@helpers/constants'

const productsSchema = {
  title: {
    type: String,
    // required: [true, 'Введите название курса. Давай включи фантазию!'],
    // maxlength: [100, 'Название блока не может превышать 100 символов'],
    default: 'Новая услуга',
    // formOptions: {
    //   name: 'Название',
    //   type: 'text',
    // },
  },
  description: {
    type: String,
    // maxlength: [
    //   000,
    //   'Описание не может превышать 2000 символов. Краткость - сестра таланта!',
    // ],
    default: '',
    // formOptions: {
    //   name: 'Описание',
    //   type: 'editabletextarea',
    // },
  },
  shortDescription: {
    type: String,
    default: '',
  },
  // image: {
  //   type: String,
  //   default: '',
  // },
  images: {
    type: Array,
    default: [],
  },
  index: {
    type: Number,
    default: null,
  },
  menuName: {
    type: String,
    default: '',
    // formOptions: {
    //   name: 'Название в меню',
    //   type: 'menuName',
    // },
  },
  showOnSite: {
    type: Boolean,
    default: true,
    // formOptions: {
    //   name: 'Показывать на сайте',
    //   type: 'checkbox',
    // },
  },
  price: {
    type: Number,
    max: [99999999, 'Сумма не может превышать 999999,99 руб'],
    default: null,
  },
  usersStatusAccess: {
    type: Map,
    of: Boolean,
    default: DEFAULT_USERS_STATUS_ACCESS,
  },
  usersStatusDiscount: {
    type: Map,
    of: Number,
    default: DEFAULT_USERS_STATUS_DISCOUNT,
  },
  questionnaire: {
    type: Map,
    default: null,
  },
}

export default productsSchema
