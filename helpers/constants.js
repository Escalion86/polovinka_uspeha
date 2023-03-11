import {
  faBan,
  faBirthdayCake,
  faCalendarDay,
  faCertificate,
  faCheck,
  faCheckCircle,
  faCircle,
  faClock,
  faComments,
  faCube,
  faGenderless,
  faGift,
  faHistory,
  faLock,
  faMars,
  faMarsDouble,
  faPhone,
  faPieChart,
  faPlay,
  faShop,
  faShoppingBag,
  faSignInAlt,
  faTimesCircle,
  faUnlink,
  faUserAlt,
  faUsers,
  faUserTimes,
  faVenus,
} from '@fortawesome/free-solid-svg-icons'
import isDevMode from './isDevMode'

import {
  faBug,
  faChartBar,
  faCog,
  faCubes,
  faFilter,
  faFire,
  faHome,
  faMoneyBill,
  faUser,
  faHeart,
} from '@fortawesome/free-solid-svg-icons'
import {
  faCalendar,
  faCalendarAlt,
  faCreditCard,
} from '@fortawesome/free-regular-svg-icons'

import ServicesContent from '@layouts/content/ServicesContent'
import DirectionsContent from '@layouts/content/DirectionsContent'
import ReviewsContent from '@layouts/content/ReviewsContent'
import EventsContent from '@layouts/content/EventsContent'
import AdditionalBlocksContent from '@layouts/content/AdditionalBlocksContent'
import QuestionnaireContent from '@layouts/content/QuestionnaireContent'
import UsersContent from '@layouts/content/UsersContent'
import MembersContent from '@layouts/content/MembersContent'

import ZodiacCapricorn from 'svg/zodiac/ZodiacCapricorn'
import ZodiacTaurus from 'svg/zodiac/ZodiacTaurus'
import ZodiacGemini from 'svg/zodiac/ZodiacGemini'
import ZodiacCancer from 'svg/zodiac/ZodiacCancer'
import ZodiacLeo from 'svg/zodiac/ZodiacLeo'
import ZodiacLibra from 'svg/zodiac/ZodiacLibra'
import ZodiacSagittarius from 'svg/zodiac/ZodiacSagittarius'
import ZodiacAries from 'svg/zodiac/ZodiacAries'
import ZodiacAquarius from 'svg/zodiac/ZodiacAquarius'
import ZodiacPisces from 'svg/zodiac/ZodiacPisces'
import ZodiacVirgo from 'svg/zodiac/ZodiacVirgo'
import ZodiacScorpio from 'svg/zodiac/ZodiacScorpio'
import PaymentsContent from '@layouts/content/PaymentsContent'
import ContactsContent from '@layouts/content/ContactsContent'
import DevContent from '@layouts/content/DevContent'
import HistoriesContent from '@layouts/content/HistoriesContent'
import BirthdaysContent from '@layouts/content/BirthdaysContent'
import StatisticsContent from '@layouts/content/StatisticsContent'
import badgePaymentsWithoutEventSelector from '@state/selectors/badgePaymentsWithoutEventSelector'
import SettingsContent from '@layouts/content/SettingsContent'
import PaymentsWithoutEventContent from '@layouts/content/PaymentsWithoutEventContent'
import badgePaymentsWithoutUserWritingToEventSelector from '@state/selectors/badgePaymentsWithoutUserWritingToEventSelector'
import PaymentsNotParticipantsEventContent from '@layouts/content/PaymentsNotParticipantsEventContent'

const colors = [
  'border-blue-400',
  'border-red-400',
  'border-yellow-400',
  'border-green-400',
  'border-purple-400',
  'border-orange-400',
  'border-gray-400',
  'border-amber-400',
  'text-red-400',
  'text-blue-400',
  'text-yellow-400',
  'text-green-400',
  'text-purple-400',
  'text-orange-400',
  'text-gray-400',
  'text-amber-400',
  'bg-blue-400',
  'bg-red-400',
  'bg-yellow-400',
  'bg-green-400',
  'bg-purple-400',
  'bg-orange-400',
  'bg-gray-400',
  'bg-amber-400',
  'border-blue-500',
  'border-red-500',
  'border-yellow-500',
  'border-green-500',
  'border-purple-500',
  'border-orange-500',
  'border-gray-500',
  'border-amber-500',
  'text-red-500',
  'text-blue-500',
  'text-yellow-500',
  'text-green-500',
  'text-purple-500',
  'text-orange-500',
  'text-gray-500',
  'text-amber-500',
  'bg-blue-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-gray-500',
  'bg-amber-500',
  'border-blue-600',
  'border-yellow-600',
  'border-red-600',
  'border-green-600',
  'border-purple-600',
  'border-orange-600',
  'border-gray-600',
  'border-amber-600',
  'border-amber-700',
  'text-gray-600',
  'text-blue-600',
  'text-yellow-600',
  'text-green-600',
  'text-purple-600',
  'text-orange-600',
  'text-gray-600',
  'text-amber-600',
  'text-amber-700',
  'bg-blue-600',
  'bg-red-600',
  'bg-yellow-600',
  'bg-green-600',
  'bg-purple-600',
  'bg-orange-600',
  'bg-gray-600',
  'bg-amber-600',
  'bg-amber-700',
  'hover:border-blue-400',
  'hover:border-red-400',
  'hover:border-yellow-400',
  'hover:border-green-400',
  'hover:border-purple-400',
  'hover:border-orange-400',
  'hover:border-gray-400',
  'hover:border-amber-400',
  'hover:text-red-400',
  'hover:text-blue-400',
  'hover:text-yellow-400',
  'hover:text-green-400',
  'hover:text-purple-400',
  'hover:text-orange-400',
  'hover:text-gray-400',
  'hover:text-amber-400',
  'hover:bg-blue-400',
  'hover:bg-red-400',
  'hover:bg-yellow-400',
  'hover:bg-green-400',
  'hover:bg-purple-400',
  'hover:bg-orange-400',
  'hover:bg-gray-400',
  'hover:bg-amber-400',
  'hover:border-blue-500',
  'hover:border-red-500',
  'hover:border-yellow-500',
  'hover:border-green-500',
  'hover:border-purple-500',
  'hover:border-orange-500',
  'hover:border-gray-500',
  'hover:border-amber-500',
  'hover:text-red-500',
  'hover:text-blue-500',
  'hover:text-yellow-500',
  'hover:text-green-500',
  'hover:text-purple-500',
  'hover:text-orange-500',
  'hover:text-gray-500',
  'hover:text-amber-500',
  'hover:text-amber-600',
  'hover:bg-blue-500',
  'hover:bg-red-500',
  'hover:bg-yellow-500',
  'hover:bg-green-500',
  'hover:bg-purple-500',
  'hover:bg-orange-500',
  'hover:bg-gray-500',
  'hover:bg-amber-500',
  'hover:border-blue-600',
  'hover:border-red-600',
  'hover:border-yellow-600',
  'hover:border-green-600',
  'hover:border-purple-600',
  'hover:border-orange-600',
  'hover:border-gray-600',
  'hover:border-amber-600',
  'hover:border-amber-700',
  'hover:text-red-600',
  'hover:text-blue-600',
  'hover:text-yellow-600',
  'hover:text-green-600',
  'hover:text-purple-600',
  'hover:text-orange-600',
  'hover:text-gray-600',
  'hover:text-amber-600',
  'hover:text-amber-700',
  'hover:bg-blue-600',
  'hover:bg-red-600',
  'hover:bg-yellow-600',
  'hover:bg-green-600',
  'hover:bg-purple-600',
  'hover:bg-orange-600',
  'hover:bg-gray-600',
  'hover:bg-amber-600',
  'hover:bg-amber-700',
]

export const GRADIENT_COLORS = ['#504436', '#84725A']

export const MONTHS = [
  'янв',
  'фев',
  'мар',
  'апр',
  'май',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек',
]

export const MONTHS_FULL_1 = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
]

export const MONTHS_FULL = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
]

export const DAYS_OF_WEEK = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ']

export const DEFAULT_USERS_SECURITY = Object.freeze({
  fullSecondName: null,
  fullThirdName: null,
  showBirthday: null,
  showAge: null,
  showContacts: null,
})

export const DEFAULT_USERS_NOTIFICATIONS = Object.freeze({
  telegram: { active: false, userName: null, id: null },
})

export const DEFAULT_USER = Object.freeze({
  firstName: '',
  secondName: '',
  thirdName: '',
  password: '',
  email: '',
  phone: null,
  whatsapp: null,
  viber: null,
  telegram: '',
  vk: '',
  instagram: '',
  birthday: null,
  gender: null,
  images: [],
  role: 'client',
  interests: '',
  profession: '',
  orientation: null,
  status: 'novice',
  lastActivityAt: null,
  prevActivityAt: null,
  archive: false,
  haveKids: null,
  security: DEFAULT_USERS_SECURITY,
  notifications: DEFAULT_USERS_NOTIFICATIONS,
})

export const DEFAULT_ADDRESS = Object.freeze({
  town: '',
  street: '',
  house: '',
  entrance: '',
  floor: '',
  flat: '',
  comment: '',
})

export const DEFAULT_EVENT = Object.freeze({
  directionId: null,
  organizerId: null,
  title: '',
  description: '',
  // date: null,
  dateStart: null,
  dateEnd: null,
  address: DEFAULT_ADDRESS,
  status: 'active',
  images: [],
  showOnSite: true,
  // duration: 60,
  price: 0,
  maxParticipants: null,
  maxMans: null,
  maxWomans: null,
  minMansAge: 35,
  minWomansAge: 30,
  maxMansAge: 50,
  maxWomansAge: 45,
  usersStatusAccess: {},
  usersStatusDiscount: {},
  isReserveActive: true,
  report: '',
  reportImages: [],
  warning: false,
})

export const DEFAULT_QUESTIONNAIRE = Object.freeze({
  name: '',
  data: [],
})

export const DEFAULT_QUESTIONNAIRE_ITEM = {
  type: 'text',
  question: '',
  key: '',
  show: true,
  required: true,
}

export const DEFAULT_DIRECTION = Object.freeze({
  title: '',
  description: '',
  image: null,
  showOnSite: true,
})

export const DEFAULT_REVIEW = Object.freeze({
  author: '',
  review: '',
  authorAge: null,
  showOnSite: true,
})

export const DEFAULT_PAYMENT = Object.freeze({
  payDirection: null,
  userId: null,
  eventId: null,
  payType: null,
  sum: 0,
  status: 'created',
  payAt: undefined,
  comment: '',
})

export const DEFAULT_ADDITIONAL_BLOCK = Object.freeze({
  title: '',
  description: '',
  image: null,
  menuName: null,
  index: null,
  showOnSite: true,
})

export const DEFAULT_SERVICE = Object.freeze({
  title: '',
  description: '',
  image: null,
  menuName: null,
  index: null,
  showOnSite: true,
  price: 0,
})

export const DEFAULT_SITE_SETTINGS = Object.freeze({
  email: null,
  phone: null,
  whatsapp: null,
  viber: null,
  telegram: null,
  instagram: null,
  vk: null,
  codeSendService: 'telefonip',
})

export const EVENT_STATUSES = [
  { value: 'active', name: 'Активно', color: 'blue-400', icon: faPlay },
  { value: 'canceled', name: 'Отменено', color: 'red-400', icon: faBan },
  { value: 'closed', name: 'Закрыто', color: 'green-400', icon: faLock },
]

export const EVENT_STATUSES_WITH_TIME = [
  ...EVENT_STATUSES,
  { value: 'finished', name: 'Завершено', color: 'general', icon: faCheck },
  { value: 'inProgress', name: 'В процессе', color: 'blue-400', icon: faClock },
]

export const EVENT_USER_STATUSES = [
  { value: 'participant', name: 'Участник', color: 'green-400' },
  { value: 'assistant', name: 'Ведущий', color: 'blue-400' },
  { value: 'reserve', name: 'Резерв', color: 'yellow-400' },
  { value: 'ban', name: 'Бан', color: 'red-400' },
]

export const GENDERS = [
  { value: 'male', name: 'Мужчина', color: 'blue-400', icon: faMars },
  { value: 'famale', name: 'Женщина', color: 'red-400', icon: faVenus },
]

export const GENDERS_WITH_NO_GENDER = [
  ...GENDERS,
  { value: 'null', name: 'Не выбрано', color: 'gray-400', icon: faGenderless },
]

export const ORIENTATIONS = [
  { value: 'getero', name: 'Гетеросексуал', color: 'blue-400' },
  { value: 'bi', name: 'Бисексуал', color: 'purple-400' },
  { value: 'homo', name: 'Гомосексуал', color: 'red-400' },
]

export const CODE_SEND_SERVICES = [
  { value: 'telefonip', name: 'TelefonIP', color: 'orange-400' },
  { value: 'ucaller', name: 'UCaller', color: 'blue-400' },
]

export const ZODIAC = [
  {
    name: 'Овен',
    component: ZodiacAries,
    element: 'Огонь',
    dateFrom: '21.03',
    dateTo: '19.04',
  },
  {
    name: 'Телец',
    component: ZodiacTaurus,
    element: 'Земля',
    dateFrom: '20.04',
    dateTo: '20.05',
  },
  {
    name: 'Близнецы',
    component: ZodiacGemini,
    element: 'Воздух',
    dateFrom: '21.05',
    dateTo: '20.06',
  },
  {
    name: 'Рак',
    component: ZodiacCancer,
    element: 'Вода',
    dateFrom: '21.06',
    dateTo: '22.07',
  },
  {
    name: 'Лев',
    component: ZodiacLeo,
    element: 'Огонь',
    dateFrom: '23.07',
    dateTo: '22.08',
  },
  {
    name: 'Дева',
    component: ZodiacVirgo,
    element: 'Земля',
    dateFrom: '23.08',
    dateTo: '22.09',
  },
  {
    name: 'Весы',
    component: ZodiacLibra,
    element: 'Воздух',
    dateFrom: '23.09',
    dateTo: '22.10',
  },
  {
    name: 'Скорпион',
    component: ZodiacScorpio,
    element: 'Вода',
    dateFrom: '23.10',
    dateTo: '21.11',
  },
  {
    name: 'Стрелец',
    component: ZodiacSagittarius,
    element: 'Огонь',
    dateFrom: '22.11',
    dateTo: '21.12',
  },
  {
    name: 'Козерог',
    component: ZodiacCapricorn,
    element: 'Земля',
    dateFrom: '22.12',
    dateTo: '19.01',
  },
  {
    name: 'Водолей',
    component: ZodiacAquarius,
    element: 'Воздух',
    dateFrom: '20.01',
    dateTo: '18.02',
  },
  {
    name: 'Рыбы',
    component: ZodiacPisces,
    element: 'Вода',
    dateFrom: '19.02',
    dateTo: '20.03',
  },
]

export const CLOUDINARY_FOLDER = isDevMode
  ? 'polovinka_uspeha'
  : 'polovinka_uspeha'

export const CONTENTS = {
  services: { Component: ServicesContent, name: 'Услуги' },
  directions: { Component: DirectionsContent, name: 'Сайт / Направления' },
  reviews: { Component: ReviewsContent, name: 'Сайт / Отзывы' },
  additionalBlocks: {
    Component: AdditionalBlocksContent,
    name: 'Сайт / Доп. блоки',
  },
  events: { Component: EventsContent, name: 'Мероприятия' },
  questionnaire: { Component: QuestionnaireContent, name: 'Моя анкета' },
  users: { Component: UsersContent, name: 'Пользователи' },
  members: { Component: MembersContent, name: 'Участники клуба' },
  payments: { Component: PaymentsContent, name: 'Транзакции' },
  paymentsWithNoEvent: {
    Component: PaymentsWithoutEventContent,
    name: 'Непривязанные транзакции',
  },
  paymentsNotParticipantsEvent: {
    Component: PaymentsNotParticipantsEventContent,
    name: 'Не пришли на мероприятие',
  },
  contacts: { Component: ContactsContent, name: 'Контакты на сайте' },
  dev: { Component: DevContent, name: 'Разработчик' },
  histories: {
    Component: HistoriesContent,
    name: 'События / Участники мероприятий',
  },
  birthdays: { Component: BirthdaysContent, name: 'События / Дни рождения' },
  statistics: { Component: StatisticsContent, name: 'Статистика' },
  settings: { Component: SettingsContent, name: 'Настройки' },
}

export const pages = [
  {
    id: 0,
    group: 0,
    name: 'Услуги',
    href: 'services',
    icon: faShoppingBag,
  },
  {
    id: 2,
    group: 1,
    name: 'Мероприятия',
    href: 'events',
    icon: faCalendar,
  },
  {
    id: 3,
    group: 2,
    name: 'Направления',
    href: 'directions',
    icon: faHeart,
  },
  {
    id: 4,
    group: 2,
    name: 'Доп. блоки',
    href: 'additionalBlocks',
    icon: faCube,
  },
  {
    id: 5,
    group: 2,
    name: 'Отзывы',
    href: 'reviews',
    icon: faComments,
  },
  {
    id: 6,
    group: 2,
    name: 'Контакты',
    href: 'contacts',
    icon: faPhone,
  },
  {
    id: 7,
    group: 3,
    name: 'Пользователи',
    href: 'users',
    icon: faCalendar,
  },
  {
    id: 8,
    group: 4,
    name: 'Транзакции',
    href: 'payments',
    icon: faMoneyBill,
  },
  {
    id: 9,
    group: 4,
    name: 'Непривязанные транзакции',
    href: 'paymentsWithNoEvent',
    icon: faUnlink,
    badge: badgePaymentsWithoutEventSelector,
  },

  {
    id: 10,
    group: 4,
    name: 'Не пришли на мероприятие',
    href: 'paymentsNotParticipantsEvent',
    icon: faUserTimes,
    badge: badgePaymentsWithoutUserWritingToEventSelector,
  },

  {
    id: 11,
    group: 5,
    name: 'Участники мероприятий',
    href: 'histories',
    icon: faUsers,
  },
  {
    id: 12,
    group: 5,
    name: 'Дни рождения',
    href: 'birthdays',
    icon: faBirthdayCake,
  },
  {
    id: 13,
    group: 6,
    name: 'Статистика',
    href: 'statistics',
    icon: faPieChart,
  },
  {
    id: 50,
    group: 7,
    name: 'Участники клуба',
    href: 'members',
    icon: faCalendar,
  },
  {
    id: 13,
    group: 8,
    name: 'Настройки',
    href: 'settings',
    icon: faCog,
  },
  {
    id: 99,
    group: 99,
    name: 'Разработчик',
    href: 'dev',
    icon: faBug,
  },
]

export const pagesGroups = [
  { id: 0, name: 'Услуги', icon: faShoppingBag, access: 'dev' },
  { id: 1, name: 'Мероприятия', icon: faCalendarAlt, access: 'all' },
  { id: 2, name: 'Сайт', icon: faHome, access: 'admin' },
  { id: 3, name: 'Пользователи', icon: faUser, access: 'admin' },
  { id: 4, name: 'Транзакции', icon: faMoneyBill, access: 'admin' },
  { id: 5, name: 'События', icon: faHistory, access: 'admin' },
  { id: 6, name: 'Статистика', icon: faPieChart, access: 'admin' },
  { id: 7, name: 'Участники клуба', icon: faUser, access: 'member' },
  { id: 8, name: 'Настройки', icon: faCog, access: 'admin' },
  { id: 99, name: 'Разработчик', icon: faBug, access: 'dev' },
]

export const PAY_TYPES = [
  { value: 'card', name: 'Картой', color: 'blue-400', icon: faCreditCard },
  { value: 'cash', name: 'Наличными', color: 'green-400', icon: faMoneyBill },
  {
    value: 'remittance',
    name: 'Перевод',
    color: 'yellow-400',
    icon: faSignInAlt,
  },
  {
    value: 'coupon',
    name: 'Купон',
    color: 'general',
    icon: faCertificate,
  },
]
// var arr = [{key:"11", value:"1100"},{key:"22", value:"2200"}];
// var object = arr.reduce(
//   (obj, item) => Object.assign(obj, { [item.key]: item.value }), {})

export const PAY_TYPES_OBJECT = PAY_TYPES.reduce(
  (obj, item) => Object.assign(obj, { [item.value]: item.name }),
  {}
)

export const PAY_DIRECTIONS = [
  {
    value: 'toUser',
    name: 'Пользователю (за помощь / возврат)',
    color: 'red-400',
    icon: faUserAlt,
  },
  {
    value: 'toEvent',
    name: 'Затраты организатора (на мероприятие)',
    color: 'red-400',
    icon: faCalendar,
  },
  {
    value: 'fromUser',
    name: 'Организатору (от участника)',
    color: 'green-400',
    icon: faUserAlt,
  },
  {
    value: 'fromEvent',
    name: 'Доп. доходы (от мероприятия)',
    color: 'green-400',
    icon: faCalendar,
  },
]

export const DEFAULT_USERS_STATUS_ACCESS = {
  noReg: true,
  novice: true,
  member: true,
}

export const DEFAULT_USERS_STATUS_DISCOUNT = {
  novice: 0,
  member: 0,
}

export const USERS_STATUSES = [
  { value: 'novice', name: 'Новичок', color: 'green-400', icon: faUser },
  {
    value: 'member',
    name: 'Участник клуба',
    color: 'blue-400',
    imageSrc: '/img/svg_icons/medal.svg',
  },
  { value: 'ban', name: 'Бан', color: 'danger', icon: faBan },
]

export const USERS_ROLES = [
  { value: 'client', name: 'Пользователь', color: 'blue-400' },
  { value: 'admin', name: 'Администратор', color: 'orange-400' },
  { value: 'dev', name: 'Разработчик', color: 'danger' },
]

export const UCALLER_VOICE = true
export const UCALLER_MIX = true
