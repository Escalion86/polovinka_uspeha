import {
  DEFAULT_USERS_STATUS_ACCESS,
  DEFAULT_USERS_STATUS_DISCOUNT,
} from '@helpers/constants'

const eventsSchema = {
  directionId: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    // required: [true, 'Введите название курса. Давай включи фантазию!'],
    // maxlength: [100, 'Название мероприятия не может превышать 100 символов'],
    default: 'Новое мероприятие',
  },
  description: {
    type: String,
    // maxlength: [
    //   2000,
    //   'Описание не может превышать 2000 символов. Краткость - сестра таланта!',
    // ],
    default: 'Описание мероприятия',
  },
  // date: {
  //   type: Date,
  //   default: null,
  // },
  dateStart: {
    type: Date,
    default: null,
  },
  dateEnd: {
    type: Date,
    default: null,
  },
  // duration: {
  //   type: Number,
  //   default: 60, // минут
  // },
  address: {
    type: Map,
    of: String,
  },
  status: {
    type: String,
    default: 'active',
  },
  images: {
    type: Array,
    default: [],
  },
  organizerId: {
    type: String,
    default: null,
  },
  price: {
    type: Number,
    max: [99999999, 'Сумма не может превышать 999999,99 руб'],
    default: null,
  },
  maxParticipants: {
    type: Number,
    default: null,
  },
  maxMans: {
    type: Number,
    default: null,
  },
  maxWomans: {
    type: Number,
    default: null,
  },
  maxMansNovice: {
    type: Number,
    default: null,
  },
  maxWomansNovice: {
    type: Number,
    default: null,
  },
  maxMansMember: {
    type: Number,
    default: null,
  },
  maxWomansMember: {
    type: Number,
    default: null,
  },
  minMansAge: {
    type: Number,
    default: null,
  },
  maxMansAge: {
    type: Number,
    default: null,
  },
  minWomansAge: {
    type: Number,
    default: null,
  },
  maxWomansAge: {
    type: Number,
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
  isReserveActive: {
    type: Boolean,
    default: true,
  },
  showOnSite: {
    type: Boolean,
    default: true,
  },
  report: {
    type: String,
    default: '',
  },
  reportImages: {
    type: Array,
    default: [],
  },
  warning: {
    type: Boolean,
    default: false,
  },
}

export default eventsSchema
