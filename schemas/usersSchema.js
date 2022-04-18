const usersSchema = {
  name: {
    type: String,
    maxlength: [
      100,
      'Имя не может быть больше 100 символов. Или это "Напу-Амо-Хала-Она-Она-Анека-Вехи-Вехи-Она-Хивеа-Нена-Вава-Кехо-Онка-Кахе-Хеа-Леке-Еа-Она-Ней-Нана-Ниа-Кеко-Оа-Ога-Ван-Ика-Ванао"? Тут 102 буквы, можешь загуглить....',
    ],
    default: 'Шарик Обнимашкин',
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, 'Введите EMail'],
  },
  password: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  phone: {
    type: Number,
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
    default: null,
  },
  instagram: {
    type: String,
    default: null,
  },
  vk: {
    type: String,
    default: null,
  },
  birthday: {
    type: Date,
    default: null,
  },
  gender: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    default: 'client',
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
}

export default usersSchema
