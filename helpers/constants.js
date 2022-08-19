import {
  faBan,
  faCalendarDay,
  faCheckCircle,
  faCircle,
  faClock,
  faComments,
  faCube,
  faGift,
  faMars,
  faMarsDouble,
  faPhone,
  faPlay,
  faSignInAlt,
  faTimesCircle,
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
import DirectionsContent from '@layouts/content/DirectionsContent'
import ReviewsContent from '@layouts/content/ReviewsContent'
import EventsContent from '@layouts/content/EventsContent'
import AdditionalBlocksContent from '@layouts/content/AdditionalBlocksContent'
import QuestionnaireContent from '@layouts/content/QuestionnaireContent'
import UsersContent from '@layouts/content/UsersContent'

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

const colors = [
  'border-blue-400',
  'border-red-400',
  'border-yellow-400',
  'border-green-400',
  'border-purple-400',
  'border-orange-400',
  'border-gray-400',
  'text-red-400',
  'text-blue-400',
  'text-yellow-400',
  'text-green-400',
  'text-purple-400',
  'text-orange-400',
  'text-gray-400',
  'bg-blue-400',
  'bg-red-400',
  'bg-yellow-400',
  'bg-green-400',
  'bg-purple-400',
  'bg-orange-400',
  'bg-gray-400',
  'border-blue-500',
  'border-red-500',
  'border-yellow-500',
  'border-green-500',
  'border-purple-500',
  'border-orange-500',
  'border-gray-500',
  'text-red-500',
  'text-blue-500',
  'text-yellow-500',
  'text-green-500',
  'text-purple-500',
  'text-orange-500',
  'text-gray-500',
  'bg-blue-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-gray-500',
  'border-blue-600',
  'border-yellow-600',
  'border-red-600',
  'border-green-600',
  'border-purple-600',
  'border-orange-600',
  'border-orange-600',
  'text-gray-600',
  'text-blue-600',
  'text-yellow-600',
  'text-green-600',
  'text-purple-600',
  'text-orange-600',
  'text-gray-600',
  'bg-blue-600',
  'bg-red-600',
  'bg-yellow-600',
  'bg-green-600',
  'bg-purple-600',
  'bg-orange-600',
  'bg-gray-600',
  'hover:border-blue-400',
  'hover:border-red-400',
  'hover:border-yellow-400',
  'hover:border-green-400',
  'hover:border-purple-400',
  'hover:border-orange-400',
  'hover:border-gray-400',
  'hover:text-red-400',
  'hover:text-blue-400',
  'hover:text-yellow-400',
  'hover:text-green-400',
  'hover:text-purple-400',
  'hover:text-orange-400',
  'hover:text-gray-400',
  'hover:bg-blue-400',
  'hover:bg-red-400',
  'hover:bg-yellow-400',
  'hover:bg-green-400',
  'hover:bg-purple-400',
  'hover:bg-orange-400',
  'hover:bg-gray-400',
  'hover:border-blue-500',
  'hover:border-red-500',
  'hover:border-yellow-500',
  'hover:border-green-500',
  'hover:border-purple-500',
  'hover:border-orange-500',
  'hover:border-gray-500',
  'hover:text-red-500',
  'hover:text-blue-500',
  'hover:text-yellow-500',
  'hover:text-green-500',
  'hover:text-purple-500',
  'hover:text-orange-500',
  'hover:text-gray-500',
  'hover:bg-blue-500',
  'hover:bg-red-500',
  'hover:bg-yellow-500',
  'hover:bg-green-500',
  'hover:bg-purple-500',
  'hover:bg-orange-500',
  'hover:bg-gray-500',
  'hover:border-blue-600',
  'hover:border-red-600',
  'hover:border-yellow-600',
  'hover:border-green-600',
  'hover:border-purple-600',
  'hover:border-orange-600',
  'hover:border-gray-600',
  'hover:text-red-600',
  'hover:text-blue-600',
  'hover:text-yellow-600',
  'hover:text-green-600',
  'hover:text-purple-600',
  'hover:text-orange-600',
  'hover:text-gray-600',
  'hover:bg-blue-600',
  'hover:bg-red-600',
  'hover:bg-yellow-600',
  'hover:bg-green-600',
  'hover:bg-purple-600',
  'hover:bg-orange-600',
  'hover:bg-gray-600',
]

export const DEFAULT_USER = Object.freeze({
  name: '',
  secondName: '',
  thirdName: '',
  password: '',
  email: null,
  phone: null,
  whatsapp: null,
  viber: null,
  telegram: null,
  vk: null,
  instagram: null,
  birthday: null,
  gender: null,
  image: null,
  role: 'client',
  interests: '',
  profession: '',
  orientation: null,
  lastActivityAt: null,
  prevActivityAt: null,
  archive: false,
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
  title: '',
  description: '',
  date: null,
  address: DEFAULT_ADDRESS,
  status: '',
  image: null,
  showOnSite: true,
})

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
  userId: null,
  payType: 'card',
  sum: 0,
  status: 'created',
  payAt: null,
})

export const DEFAULT_ADDITIONAL_BLOCK = Object.freeze({
  title: '',
  description: '',
  image: null,
  menuName: null,
  index: 0,
  showOnSite: true,
})

export const EVENT_STATUSES = [
  { value: 'active', name: 'Активно', color: 'green-400', icon: faPlay },
  { value: 'canceled', name: 'Отменено', color: 'red-400', icon: faBan },
]

export const GENDERS = [
  { value: 'male', name: 'Мужчина', color: 'blue-400', icon: faMars },
  { value: 'famale', name: 'Женщина', color: 'red-400', icon: faVenus },
]

export const ORIENTATIONS = [
  { value: 'getero', name: 'Гетеросексуал', color: 'blue-400' },
  { value: 'bi', name: 'Бисексуал', color: 'purple-400' },
  { value: 'homo', name: 'Гомосексуал', color: 'red-400' },
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

// import {
//   BtnAddClient,
//   BtnAddDevToDo,
//   BtnAddInvitation,
//   BtnAddOrder,
//   BtnAddPayment,
//   BtnAddProduct,
//   BtnAddProductCirculation,
//   BtnAddProductType,
//   BtnAddSet,
//   BtnAddSetType,
//   BtnTest,
//   BtnAddDistrict,
// } from '@admincomponents/TitleButtons'

// import {
//   InvitationsContent,
//   ProductCirculationsContent,
//   ProductsContent,
//   ProductTypesContent,
//   SetsContent,
//   SettingsContent,
//   SetTypesContent,
//   TestContent,
//   UserContent,
//   UsersContent,
//   OverviewContent,
//   ClientsContent,
//   OrdersContent,
//   PaymentsContent,
//   DistrictsContent,
// } from './content'
// import DevToDoContent from './content/DevToDoContent'

export const CONTENTS = {
  directions: { Component: DirectionsContent, name: 'Сайт / Направления' },
  reviews: { Component: ReviewsContent, name: 'Сайт / Отзывы' },
  additionalBlocks: {
    Component: AdditionalBlocksContent,
    name: 'Сайт / Доп. блоки',
  },
  events: { Component: EventsContent, name: 'Мероприятия' },
  questionnaire: { Component: QuestionnaireContent, name: 'Моя анкета' },
  users: { Component: UsersContent, name: 'Пользователи' },
  payments: { Component: PaymentsContent, name: 'Транзакции' },
  contacts: { Component: ContactsContent, name: 'Контакты на сайте' },
  dev: { Component: DevContent, name: 'Разработчик' },
}

export const pages = [
  {
    id: 0,
    group: 0,
    name: 'Мероприятия',
    href: 'events',
    icon: faCalendar,
  },
  {
    id: 1,
    group: 1,
    name: 'Направления',
    href: 'directions',
    icon: faHeart,
  },
  {
    id: 2,
    group: 1,
    name: 'Доп. блоки',
    href: 'additionalBlocks',
    icon: faCube,
  },
  {
    id: 3,
    group: 1,
    name: 'Отзывы',
    href: 'reviews',
    icon: faComments,
  },
  {
    id: 4,
    group: 1,
    name: 'Контакты',
    href: 'contacts',
    icon: faPhone,
  },
  {
    id: 5,
    group: 2,
    name: 'Пользователи',
    href: 'users',
    icon: faCalendar,
  },
  // {
  //   id: 6,
  //   group: 3,
  //   name: 'Транзакции',
  //   href: 'payments',
  //   icon: faMoneyBill,
  // },
  {
    id: 99,
    group: 99,
    name: 'Разработчик',
    href: 'dev',
    icon: faBug,
  },
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
]

export const pagesGroups = [
  { id: 0, name: 'Мероприятия', icon: faCalendarAlt, access: 'all' },
  { id: 1, name: 'Сайт', icon: faHome, access: 'admin' },
  { id: 2, name: 'Пользователи', icon: faUser, access: 'admin' },
  { id: 3, name: 'Транзакции', icon: faMoneyBill, access: 'admin' },
  { id: 99, name: 'Разработчик', icon: faBug, access: 'dev' },
  // { id: 2, name: 'Заказы', icon: faFire },
  // { id: 1, name: 'Склад', icon: faCubes },
  // { id: 3, name: 'Клиенты', icon: faUser },
  // { id: 4, name: 'Оплата', icon: faMoneyBill },
  // { id: 6, name: 'Настройки', icon: faCog, bottom: true },
  // { id: 10, name: 'Разработка', icon: faBug, bottom: true },
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
  { value: 'novice', name: 'Новичок', color: 'blue-400' },
  { value: 'member', name: 'Участник клуба', color: 'green-400' },
  { value: 'ban', name: 'Бан', color: 'danger' },
]
