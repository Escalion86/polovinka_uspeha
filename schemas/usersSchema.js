import {
  DEFAULT_USERS_NOTIFICATIONS,
  DEFAULT_USERS_SECURITY,
} from '@helpers/constants'
import { Schema } from 'mongoose'

const usersSchema = {
  firstName: {
    type: String,
    maxlength: [
      100,
      'Имя не может быть больше 100 символов. Или это "Напу-Амо-Хала-Она-Она-Анека-Вехи-Вехи-Она-Хивеа-Нена-Вава-Кехо-Онка-Кахе-Хеа-Леке-Еа-Она-Ней-Нана-Ниа-Кеко-Оа-Ога-Ван-Ика-Ванао"? Тут 102 буквы, можешь загуглить....',
    ],
    default: '',
  },
  secondName: {
    type: String,
    maxlength: [
      100,
      'Фамилия не может быть больше 100 символов. Или это "Напу-Амо-Хала-Она-Она-Анека-Вехи-Вехи-Она-Хивеа-Нена-Вава-Кехо-Онка-Кахе-Хеа-Леке-Еа-Она-Ней-Нана-Ниа-Кеко-Оа-Ога-Ван-Ика-Ванао"? Тут 102 буквы, можешь загуглить....',
    ],
    default: '',
  },
  thirdName: {
    type: String,
    maxlength: [
      100,
      'Отчество не может быть больше 100 символов. Или это "Напу-Амо-Хала-Она-Она-Анека-Вехи-Вехи-Она-Хивеа-Нена-Вава-Кехо-Онка-Кахе-Хеа-Леке-Еа-Она-Ней-Нана-Ниа-Кеко-Оа-Ога-Ван-Ика-Ванао"? Тут 102 буквы, можешь загуглить....',
    ],
    default: '',
  },
  email: {
    type: String,
    lowercase: true,
    default: '',
  },
  password: {
    type: String,
    default: '',
  },
  // image: {
  //   type: String,
  //   default: null,
  // },
  images: {
    type: Array,
    default: [],
  },
  gender: {
    type: String,
    default: null,
  },
  about: {
    type: String,
    default: '',
  },
  interests: {
    type: String,
    default: '',
  },
  profession: {
    type: String,
    default: '',
  },
  orientation: {
    type: String,
    default: null,
  },
  phone: {
    type: Number,
    required: [true, 'Введите Телефон'],
    default: null,
  },
  whatsapp: {
    type: Number,
    default: null,
  },
  viber: {
    type: Number,
    default: null,
  },
  telegram: {
    type: String,
    default: '',
  },
  instagram: {
    type: String,
    default: '',
  },
  vk: {
    type: String,
    default: '',
  },
  birthday: {
    type: Date,
    default: null,
  },
  role: {
    type: String,
    default: 'client',
  },
  status: {
    type: String,
    default: 'novice',
  },
  lastActivityAt: {
    type: Date,
    default: () => Date.now(),
  },
  prevActivityAt: {
    type: Date,
    default: () => Date.now(),
  },
  archive: {
    type: Boolean,
    default: false,
  },
  haveKids: {
    type: Boolean,
    default: null,
  },
  security: {
    type: Map,
    // of: Any,
    default: DEFAULT_USERS_SECURITY,
  },
  notifications: {
    type: Map,
    of: Schema.Types.Mixed,
    default: DEFAULT_USERS_NOTIFICATIONS,
  },
}

export default usersSchema
