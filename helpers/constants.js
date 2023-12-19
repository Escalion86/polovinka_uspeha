import {
  faBan,
  faBirthdayCake,
  faBriefcase,
  faCalendarDay,
  faCertificate,
  faCheck,
  faCheckCircle,
  faCircle,
  faClock,
  faComments,
  faCube,
  faEnvelope,
  faGenderless,
  faGift,
  faHandHoldingHeart,
  faHeartbeat,
  faHistory,
  faLock,
  faMars,
  faMarsDouble,
  faPhone,
  faPieChart,
  faPlay,
  faQuestion,
  faShop,
  faShoppingBag,
  faSignInAlt,
  faTimesCircle,
  faTools,
  faTrophy,
  faUnlink,
  faUpload,
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
  faCalendarAlt,
  faCreditCard,
  faFileText,
  faImage,
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
// import StatisticsContent from '@layouts/content/StatisticsContent'
import badgePaymentsOfEventWithoutEventIdSelector from '@state/selectors/badgePaymentsOfEventWithoutEventIdSelector'
import SettingsCodeSendServiceContent from '@layouts/content/SettingsCodeSendServiceContent'
import PaymentsWithoutEventContent from '@layouts/content/PaymentsWithoutEventContent'
// import badgePaymentsWithoutUserWritingToEventSelector from '@state/selectors/badgePaymentsWithoutUserWritingToEventSelector'
import PaymentsNotParticipantsEventContent from '@layouts/content/PaymentsNotParticipantsEventContent'
import ServicesUsersContent from '@layouts/content/ServicesUsersContent'
import ServicesLoggedUserContent from '@layouts/content/ServicesLoggedUserContent'
import badgeBirthdaysTodayCountSelector from '@state/selectors/badgeBirthdaysTodayCountSelector'
import ToolsAnonsContent from '@layouts/content/ToolsAnonsContent'
import ToolsExportContent from '@layouts/content/ToolsExportContent'
import StatisticsFinanceContent from '@layouts/content/StatisticsFinanceContent'
import StatisticsUsersContent from '@layouts/content/StatisticsUsersContent'
import StatisticsEventsContent from '@layouts/content/StatisticsEventsContent'
import ToolsEventAnonsContent from '@layouts/content/ToolsEventAnonsContent'
import {
  faInstagram,
  faTelegram,
  faVk,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons'
import ToolsTextEventsAnonsContent from '@layouts/content/ToolsTextEventsAnonsContent'
import UserStatisticsContent from '@layouts/content/UserStatisticsContent'
import ToolsNewsletterContent from '@layouts/content/ToolsNewsletterContent'
import LoggedUserNotificationsContent from '@layouts/content/LoggedUserNotificationsContent'
import SettingsFabMenuContent from '@layouts/content/SettingsFabMenuContent'
import SettingsRolesContent from '@layouts/content/SettingsRolesContent'

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
  'text-disabled',
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
  'hover:text-disabled',
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

export const TAILWIND_COLORS = [
  'blue-400',
  'green-400',
  'orange-400',
  'purple-400',
  'yellow-400',
  'amber-400',
  'general',
  'danger',
]

export const PASTEL_COLORS = [
  '#B6D8F2',
  '#CCD4BF',
  '#D0BCAC',
  '#F4CFDF',
  '#F7F6CF',
  // '#5784BA',
  '#9AC8EB',
  '#98D4BB',
  '#E7CBA9',
  '#EEBAB2',
  '#F5F3E7',
  '#F5BFD2',
  '#E5DB9C',
  '#F5E2E4',
  '#D0BCAC',
  '#BEB4C5',
  '#E6A57E',
  // '#218B82',
  '#9AD9DB',
  '#E5DBD9',
  '#EB96AA',
  '#C6C9D0',
  // '#C54B6C',
  '#E5B3BB',
  '#F9968B',
  // '#C47482',
  '#F27348',
  // '#26474E',
  '#76CDCD',
  // '#37667E',
  '#7B92AA',
  '#E4CEE0',
  // '#A15D98',
  '#DC828F',
  '#F7CE76',
  // '#8C7386',
  // '#9C9359',
  // '#A57283',
  '#E8D595',
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

export const DAYS_OF_WEEK_FULL = [
  'воскресенье',
  'понедельник',
  'вторник',
  'среда',
  'четверг',
  'пятница',
  'суббота',
]

export const DEFAULT_USERS_SECURITY = Object.freeze({
  fullSecondName: null,
  fullThirdName: null,
  showBirthday: null,
  // showAge: null,
  // showContacts: null,
  showPhone: null,
  showWhatsapp: null,
  showViber: null,
  showTelegram: null,
  showInstagram: null,
  showVk: null,
  showEmail: null,
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
  maxMansNovice: null,
  maxWomansNovice: null,
  maxMansMember: null,
  maxWomansMember: null,
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
  title: '',
  data: [],
})

export const DEFAULT_QUESTIONNAIRE_ITEM = {
  type: 'text',
  label: '',
  key: '',
  show: true,
  required: false,
}

export const DEFAULT_DIRECTION = Object.freeze({
  title: '',
  shortDescription: '',
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
  sector: 'event',
  payDirection: null,
  userId: null,
  eventId: null,
  serviceId: null,
  productId: null,
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
  menuName: '',
  index: null,
  showOnSite: true,
})

export const DEFAULT_SERVICE = Object.freeze({
  title: '',
  description: '',
  shortDescription: '',
  images: [],
  menuName: '',
  index: null,
  showOnSite: true,
  price: 0,
  questionnaire: null,
  usersStatusAccess: {},
  usersStatusDiscount: {},
})

export const DEFAULT_PRODUCT = Object.freeze({
  title: '',
  description: '',
  shortDescription: '',
  images: [],
  menuName: '',
  index: null,
  showOnSite: true,
  price: 0,
  questionnaire: null,
  usersStatusAccess: {},
  usersStatusDiscount: {},
})

export const DEFAULT_SERVICE_USER = Object.freeze({
  userId: '',
  serviceId: '',
  answers: {},
  status: 'active',
})

export const DEFAULT_SITE_SETTINGS = Object.freeze({
  email: '',
  phone: '',
  whatsapp: '',
  viber: '',
  telegram: '',
  instagram: '',
  vk: '',
  codeSendService: 'telefonip',
})

export const EVENT_STATUSES = [
  { value: 'active', name: 'Активно', color: 'blue-400', icon: faPlay },
  { value: 'canceled', name: 'Отменено', color: 'red-400', icon: faBan },
  { value: 'closed', name: 'Закрыто', color: 'green-400', icon: faLock },
]

export const SERVICE_USER_STATUSES = [
  { value: 'active', name: 'Активно', color: 'blue-400', icon: faPlay },
  { value: 'canceled', name: 'Отменено', color: 'red-400', icon: faBan },
  { value: 'closed', name: 'Закрыто', color: 'green-400', icon: faLock },
]

export const PRODUCT_USER_STATUSES = [
  { value: 'active', name: 'Активно', color: 'blue-400', icon: faPlay },
  { value: 'canceled', name: 'Отменено', color: 'red-400', icon: faBan },
  { value: 'closed', name: 'Закрыто', color: 'green-400', icon: faLock },
]

export const EVENT_STATUSES_WITH_TIME = [
  ...EVENT_STATUSES,
  { value: 'finished', name: 'Завершено', color: 'green-400', icon: faCheck },
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

export const DEFAULT_ROLES = [
  {
    _id: 'client',
    name: 'Пользователь',
    hidden: false,
    dev: false,
    seeMyStatistics: false,
    setSelfStatus: false,
    setSelfRole: false,
    hideFab: false,
    notifications: {
      // option: true,
      birthdays: false,
      newUserRegistred: false,
      eventRegistration: false,
      newEventsByTags: true,
      // eventUserMoves: false,
      // eventCancel: false,
    },
    events: {
      see: true,
      seeHidden: false,
      add: false,
      edit: false,
      delete: false,
      statusEdit: false,
      paymentsEdit: false,
      showProfitOnCard: false,
      statusFilterFull: false,
      eventUsersCounterAndAgeFull: false,
    },
    eventsUsers: {
      see: false, // member
      edit: false,
      copyListToClipboard: false,
    },
    users: {
      see: false,
      seeMembersOnly: false,
      seeFullNames: false,
      seeAllContacts: false,
      seeBirthday: false,
      seeUserEvents: false,
      seeUserPayments: false,
      setPassword: false,
      seeSumOfPaymentsWithoutEventOnCard: false,
      add: false,
      edit: false,
      setRole: false,
      setStatus: false,
      delete: false,
    },
    services: {
      see: true,
      seeHidden: false,
      add: false,
      edit: false,
      delete: false,
    },
    servicesUsers: {
      see: false,
      add: false,
      edit: false,
      delete: false,
      statusEdit: true,
    },
    products: {
      see: false,
      seeHidden: false,
      add: false,
      edit: false,
      delete: false,
    },
    productsUsers: {
      see: false,
      add: false,
      edit: false,
      delete: false,
      statusEdit: true,
    },
    payments: {
      see: false,
      add: false,
      edit: false,
      delete: false,
      paymentsNotParticipantsEvent: false,
      paymentsWithNoEvent: false,
    },
    statistics: {
      events: false,
      users: false,
      finances: false,
    },
    instruments: {
      anonsTextGenerator: false,
      anonsEventImageGenerator: false,
      anonsEventListImageGenerator: false,
      export: false,
      newsletter: false,
    },
    generalPage: {
      directions: false,
      additionalBlocks: false,
      reviews: false,
      contacts: false,
    },
    siteSettings: {
      phoneConfirmService: false,
      fabMenu: false,
      roles: false,
    },
    notices: {
      histories: false,
      birthdays: false,
    },
  },
  {
    _id: 'moder',
    name: 'Модератор',
    hidden: false,
    dev: false,
    seeMyStatistics: false,
    setSelfStatus: false,
    setSelfRole: false,
    hideFab: true,
    notifications: {
      // option: true,
      birthdays: false,
      newUserRegistred: false,
      eventRegistration: false,
      newEventsByTags: false,
      // eventUserMoves: false,
      // eventCancel: false,
    },
    events: {
      see: true,
      seeHidden: true,
      add: true,
      edit: true,
      delete: false,
      statusEdit: false,
      paymentsEdit: true,
      showProfitOnCard: false,
      statusFilterFull: true,
      eventUsersCounterAndAgeFull: true,
    },
    eventsUsers: {
      see: true, // member
      edit: true,
      copyListToClipboard: true,
    },
    users: {
      see: true,
      seeMembersOnly: false,
      seeFullNames: true,
      seeAllContacts: true,
      seeBirthday: true,
      seeUserEvents: true,
      seeUserPayments: false,
      setPassword: false,
      seeSumOfPaymentsWithoutEventOnCard: false,
      add: false,
      edit: false,
      setRole: false,
      setStatus: false,
      delete: false,
    },
    services: {
      see: true,
      seeHidden: true,
      add: false,
      edit: false,
      delete: false,
    },
    servicesUsers: {
      see: true,
      add: false,
      edit: false,
      delete: false,
      statusEdit: false,
    },
    products: {
      see: true,
      seeHidden: false,
      add: false,
      edit: false,
      delete: false,
    },
    productsUsers: {
      see: true,
      add: false,
      edit: false,
      delete: false,
      statusEdit: false,
    },
    payments: {
      see: false,
      add: false,
      edit: false,
      delete: false,
      paymentsNotParticipantsEvent: false,
      paymentsWithNoEvent: false,
    },
    statistics: {
      events: false,
      users: false,
      finances: false,
    },
    instruments: {
      anonsTextGenerator: true,
      anonsEventImageGenerator: true,
      anonsEventListImageGenerator: true,
      export: false,
      newsletter: false,
    },
    generalPage: {
      directions: true,
      additionalBlocks: true,
      reviews: true,
      contacts: false,
    },
    siteSettings: {
      phoneConfirmService: false,
      fabMenu: false,
      roles: false,
    },
    notices: {
      histories: true,
      birthdays: true,
    },
  },
  {
    _id: 'admin',
    name: 'Администратор',
    hidden: false,
    dev: false,
    seeMyStatistics: true,
    setSelfStatus: false,
    setSelfRole: false,
    hideFab: true,
    notifications: {
      // option: true,
      birthdays: true,
      newUserRegistred: true,
      eventRegistration: true,
      newEventsByTags: true,
      // eventUserMoves: false,
      // eventCancel: false,
    },
    events: {
      see: true,
      seeHidden: true,
      add: true,
      edit: true,
      delete: false,
      statusEdit: false,
      paymentsEdit: true,
      showProfitOnCard: false,
      statusFilterFull: true,
      eventUsersCounterAndAgeFull: true,
    },
    eventsUsers: {
      see: true, // member
      edit: true,
      copyListToClipboard: true,
    },
    users: {
      see: true,
      seeMembersOnly: false,
      seeFullNames: true,
      seeAllContacts: true,
      seeBirthday: true,
      seeUserEvents: true,
      seeUserPayments: true,
      setPassword: false,
      seeSumOfPaymentsWithoutEventOnCard: true,
      add: true,
      edit: true,
      setRole: false,
      setStatus: true,
      delete: false,
    },
    services: {
      see: true,
      seeHidden: true,
      add: true,
      edit: true,
      delete: false,
    },
    servicesUsers: {
      see: true,
      add: true,
      edit: true,
      delete: false,
      statusEdit: true,
    },
    products: {
      see: true,
      seeHidden: true,
      add: true,
      edit: true,
      delete: false,
    },
    productsUsers: {
      see: true,
      add: true,
      edit: true,
      delete: false,
      statusEdit: true,
    },
    payments: {
      see: true,
      add: true,
      edit: true,
      delete: true,
      paymentsNotParticipantsEvent: true,
      paymentsWithNoEvent: true,
    },
    statistics: {
      events: false,
      users: false,
      finances: false,
    },
    instruments: {
      anonsTextGenerator: true,
      anonsEventImageGenerator: false,
      anonsEventListImageGenerator: false,
      export: true,
      newsletter: false,
    },
    generalPage: {
      directions: true,
      additionalBlocks: true,
      reviews: true,
      contacts: true,
    },
    siteSettings: {
      phoneConfirmService: false,
      fabMenu: false,
      roles: false,
    },
    notices: {
      histories: true,
      birthdays: true,
    },
  },
  {
    _id: 'supervisor',
    name: 'Руководитель',
    hidden: false,
    dev: false,
    seeMyStatistics: true,
    setSelfStatus: true,
    setSelfRole: false,
    hideFab: true,
    notifications: {
      // option: true,
      birthdays: true,
      newUserRegistred: true,
      eventRegistration: true,
      newEventsByTags: true,
      // eventUserMoves: false,
      // eventCancel: false,
    },
    events: {
      see: true,
      seeHidden: true,
      add: true,
      edit: true,
      delete: true,
      statusEdit: true,
      paymentsEdit: true,
      showProfitOnCard: true,
      statusFilterFull: true,
      eventUsersCounterAndAgeFull: true,
    },
    eventsUsers: {
      see: true, // member
      edit: true,
      copyListToClipboard: true,
    },
    users: {
      see: true,
      seeMembersOnly: false,
      seeFullNames: true,
      seeAllContacts: true,
      seeBirthday: true,
      seeUserEvents: true,
      seeUserPayments: true,
      setPassword: true,
      seeSumOfPaymentsWithoutEventOnCard: true,
      add: true,
      edit: true,
      setRole: true,
      setStatus: true,
      delete: true,
    },
    services: {
      see: true,
      seeHidden: true,
      add: true,
      edit: true,
      delete: true,
    },
    servicesUsers: {
      see: true,
      add: true,
      edit: true,
      delete: true,
      statusEdit: true,
    },
    products: {
      see: true,
      seeHidden: true,
      add: true,
      edit: true,
      delete: true,
    },
    productsUsers: {
      see: true,
      add: true,
      edit: true,
      delete: true,
      statusEdit: true,
    },
    payments: {
      see: true,
      add: true,
      edit: true,
      delete: true,
      paymentsNotParticipantsEvent: true,
      paymentsWithNoEvent: true,
    },
    statistics: {
      events: true,
      users: true,
      finances: true,
    },
    instruments: {
      anonsTextGenerator: true,
      anonsEventImageGenerator: true,
      anonsEventListImageGenerator: true,
      export: true,
      newsletter: false,
    },
    generalPage: {
      directions: true,
      additionalBlocks: true,
      reviews: true,
      contacts: true,
    },
    siteSettings: {
      phoneConfirmService: false,
      fabMenu: true,
      roles: true,
    },
    notices: {
      histories: true,
      birthdays: true,
    },
  },
  {
    _id: 'dev',
    name: 'Разработчик',
    hidden: false,
    dev: true, //!
    seeMyStatistics: true, //!
    setSelfStatus: true, //!
    setSelfRole: true, //!
    hideFab: true, //!
    notifications: {
      //!
      // option: true,
      birthdays: true, //!
      newUserRegistred: true, //!
      eventRegistration: true, //!
      newEventsByTags: true, //!
      // eventUserMoves: false,
      // eventCancel: false,
    },
    events: {
      see: true, //!
      seeHidden: true, //!
      add: true, //!
      edit: true, //!
      delete: true, //!
      statusEdit: true, //!
      paymentsEdit: true, //!
      showProfitOnCard: true, //!
      statusFilterFull: true, //!
      eventUsersCounterAndAgeFull: true, //!
    },
    eventsUsers: {
      see: true, // ! member
      edit: true, //!
      copyListToClipboard: true, //!
    },
    users: {
      see: true, //!
      seeMembersOnly: false, //!
      seeFullNames: true, //!
      seeAllContacts: true, //!
      seeBirthday: true, //!
      seeUserEvents: true,
      seeUserPayments: true,
      setPassword: true,
      seeSumOfPaymentsWithoutEventOnCard: true, //!
      add: true,
      edit: true,
      setRole: true, //!
      setStatus: true, //!
      delete: true,
    },
    services: {
      see: true,
      seeHidden: true,
      add: true,
      edit: true,
      delete: true,
    },
    servicesUsers: {
      see: true,
      add: true,
      edit: true, // !
      delete: true,
      statusEdit: true,
    },
    products: {
      see: true,
      seeHidden: true,
      add: true,
      edit: true,
      delete: true,
    },
    productsUsers: {
      see: true,
      add: true,
      edit: true,
      delete: true,
      statusEdit: true,
    },
    payments: {
      see: true,
      add: true,
      edit: true,
      delete: true,
      paymentsNotParticipantsEvent: true,
      paymentsWithNoEvent: true,
    },
    statistics: {
      events: true,
      users: true,
      finances: true,
    },
    instruments: {
      anonsTextGenerator: true,
      anonsEventImageGenerator: true,
      anonsEventListImageGenerator: true,
      export: true,
      newsletter: true,
    },
    generalPage: {
      directions: true, //!
      additionalBlocks: true, //!
      reviews: true,
      contacts: true,
    },
    siteSettings: {
      phoneConfirmService: true,
      fabMenu: true,
      roles: true,
    },
    notices: {
      histories: true,
      birthdays: true,
    },
  },
]

export const SECTORS = [
  {
    name: 'Мероприятие',
    value: 'event',
    icon: faCalendarAlt,
    color: 'orange-400',
  },
  { name: 'Услуга', value: 'service', icon: faHeart, color: 'purple-400' },
  { name: 'Товар', value: 'product', icon: faShoppingBag, color: 'blue-400' },
  {
    name: 'Внутренние',
    value: 'internal',
    icon: faBriefcase,
    color: 'general',
  },
]

export const SECTORS2 = [
  {
    name: 'Главная страница',
    value: 'home',
    icon: faHome,
    color: 'general',
  },
  {
    name: 'Мероприятие',
    value: 'event',
    icon: faCalendarAlt,
    color: 'orange-400',
  },
  { name: 'Пользователь', value: 'user', icon: faUser, color: 'blue-400' },
  { name: 'Услуга', value: 'service', icon: faHeart, color: 'purple-400' },
  // { name: 'Товар', value: 'product', icon: faShoppingBag, color: 'blue-400' },
]

export const SOCIALS = [
  { name: 'Whatsapp', value: 'whatsapp', icon: faWhatsapp, color: 'green-500' },
  { name: 'VK', value: 'vk', icon: faVk, color: 'blue-500' },
  {
    name: 'Instagram',
    value: 'instagram',
    icon: faInstagram,
    color: 'general',
  },
  {
    name: 'Telegram',
    value: 'telegram',
    icon: faTelegram,
    color: 'blue-400',
  },
]

export const CONTENTS = {
  services: {
    Component: ServicesContent,
    name: 'Услуги / Список услуг',
    accessRoles: ['client', 'moder', 'admin', 'supervisor', 'dev'],
    roleAccess: (role) => role?.services?.see,
  },
  servicesUsers: {
    Component: ServicesUsersContent,
    name: 'Услуги / Заявки на услуги',
    accessRoles: ['supervisor', 'dev'],
    roleAccess: (role) => role?.servicesUsers?.see,
  },
  myServices: {
    Component: ServicesLoggedUserContent,
    name: 'Услуги / Мои заявки на услуги',
    accessRoles: ['client', 'moder', 'admin', 'dev'],
    roleAccess: (role) => role?.services?.see,
  },
  directions: {
    Component: DirectionsContent,
    name: 'Сайт / Направления',
    accessRoles: ['moder', 'supervisor', 'dev'],
    roleAccess: (role) => role?.generalPage?.directions,
  },
  reviews: {
    Component: ReviewsContent,
    name: 'Сайт / Отзывы',
    accessRoles: ['moder', 'supervisor', 'dev'],
    roleAccess: (role) => role?.generalPage?.reviews,
  },
  additionalBlocks: {
    Component: AdditionalBlocksContent,
    name: 'Сайт / Доп. блоки',
    accessRoles: ['moder', 'supervisor', 'dev'],
    roleAccess: (role) => role?.generalPage?.additionalBlocks,
  },
  contacts: {
    Component: ContactsContent,
    name: 'Сайт / Контакты на сайте',
    accessRoles: ['supervisor', 'dev'],
    roleAccess: (role) => role?.generalPage?.contacts,
  },
  events: {
    Component: EventsContent,
    name: 'Мероприятия',
    accessRoles: ['client', 'moder', 'admin', 'supervisor', 'dev'],
    roleAccess: (role) => role?.events?.see,
  },
  questionnaire: {
    Component: QuestionnaireContent,
    name: 'Мой профиль',
    accessRoles: ['client', 'moder', 'admin', 'supervisor', 'dev'],
    roleAccess: (role) => true,
  },
  notifications: {
    Component: LoggedUserNotificationsContent,
    name: 'Уведомления',
    accessRoles: ['client', 'moder', 'admin', 'supervisor', 'dev'],
    roleAccess: (role) =>
      role?.notifications?.newEventsByTags ||
      role?.notifications?.birthdays ||
      role?.notifications?.newUserRegistred ||
      role?.notifications?.eventRegistration,
  },
  users: {
    Component: UsersContent,
    name: 'Пользователи',
    accessRoles: ['moder', 'admin', 'supervisor', 'dev'],
    roleAccess: (role) => role?.users?.see && !role?.users?.seeMembersOnly,
  },
  members: {
    Component: MembersContent,
    name: 'Участники клуба',
    accessRoles: ['client'],
    accessStatuses: ['member'],
    roleAccess: (role, status) =>
      (role?.users?.see && role?.users?.seeMembersOnly) ||
      (status === 'member' && !role?.users?.see),
  },
  payments: {
    Component: PaymentsContent,
    name: 'Транзакции / Все транзакции',
    accessRoles: ['supervisor', 'dev'],
    roleAccess: (role) => role?.payments?.see,
  },
  paymentsWithNoEvent: {
    Component: PaymentsWithoutEventContent,
    name: 'Транзакции / Непривязанные транзакции',
    accessRoles: ['supervisor', 'dev'],
    roleAccess: (role) => role?.payments?.paymentsWithNoEvent,
  },
  paymentsNotParticipantsEvent: {
    Component: PaymentsNotParticipantsEventContent,
    name: 'Транзакции / Не пришли на мероприятие',
    accessRoles: ['supervisor', 'dev'],
    roleAccess: (role) => role?.payments?.paymentsNotParticipantsEvent,
  },
  dev: {
    Component: DevContent,
    name: 'Разработчик',
    accessRoles: ['dev'],
    roleAccess: (role) => role?.dev,
  },
  toolsTextEventsAnons: {
    Component: ToolsTextEventsAnonsContent,
    name: 'Инструменты / Генератор текста анонса мероприятий',
    accessRoles: ['moder', 'admin', 'supervisor', 'dev'],
    roleAccess: (role) => role?.instruments?.anonsTextGenerator,
  },
  toolsEventAnons: {
    Component: ToolsEventAnonsContent,
    name: 'Инструменты / Редактор анонса мероприятия',
    accessRoles: ['moder', 'supervisor', 'dev'],
    roleAccess: (role) => role?.instruments?.anonsEventImageGenerator,
  },
  toolsAnons: {
    Component: ToolsAnonsContent,
    name: 'Инструменты / Редактор анонса списка мероприятий',
    accessRoles: ['moder', 'supervisor', 'dev'],
    roleAccess: (role) => role?.instruments?.anonsEventListImageGenerator,
  },
  toolsExport: {
    Component: ToolsExportContent,
    name: 'Инструменты / Экспорт данных',
    accessRoles: ['supervisor', 'dev'],
    roleAccess: (role) => role?.instruments?.export,
  },
  newsletter: {
    Component: ToolsNewsletterContent,
    name: 'Инструменты / Рассылка',
    accessRoles: ['dev'],
    roleAccess: (role) => role?.instruments?.newsletter,
  },
  histories: {
    Component: HistoriesContent,
    name: 'События / Записи на мероприятия',
    accessRoles: ['moder', 'admin', 'supervisor', 'dev'],
    roleAccess: (role) => role?.notices?.histories,
  },
  birthdays: {
    Component: BirthdaysContent,
    name: 'События / Дни рождения',
    accessRoles: ['moder', 'admin', 'supervisor', 'dev'],
    roleAccess: (role) => role?.notices?.birthdays,
  },
  // statistics: {
  //   Component: StatisticsContent,
  //   name: 'Статистика',
  //   accessRoles: ['admin', 'dev'],
  // },
  statisticsFinance: {
    Component: StatisticsFinanceContent,
    name: 'Статистика / Финансы',
    accessRoles: ['supervisor', 'dev'],
    roleAccess: (role) => role?.statistics?.finances,
  },
  statisticsUsers: {
    Component: StatisticsUsersContent,
    name: 'Статистика / Пользователи',
    accessRoles: ['supervisor', 'dev'],
    roleAccess: (role) => role?.statistics?.users,
  },
  statisticsEvents: {
    Component: StatisticsEventsContent,
    name: 'Статистика / Мероприятия',
    accessRoles: ['supervisor', 'dev'],
    roleAccess: (role) => role?.statistics?.events,
  },
  settingsCodeSendService: {
    Component: SettingsCodeSendServiceContent,
    name: 'Настройки / Сервис подтверждения номера',
    accessRoles: ['supervisor', 'dev'],
    roleAccess: (role) => role?.siteSettings?.phoneConfirmService,
  },
  settingsFabMenu: {
    Component: SettingsFabMenuContent,
    name: 'Настройки / Меню "Вопрос"',
    accessRoles: ['supervisor', 'dev'],
    roleAccess: (role) => role?.siteSettings?.fabMenu,
  },
  settingsRoles: {
    Component: SettingsRolesContent,
    name: 'Настройки / Роли"',
    accessRoles: ['dev'],
    roleAccess: (role) => role?.siteSettings?.roles,
  },
  userStatistics: {
    Component: UserStatisticsContent,
    name: 'Моя статистика',
    accessRoles: ['client', 'admin', 'supervisor', 'dev'],
    accessStatuses: ['member'],
    roleAccess: (role, status) => role?.seeMyStatistics || status === 'member',
  },
}

export const pages = [
  {
    id: 0,
    group: 0,
    name: 'Моя статистика',
    href: 'userStatistics',
    icon: faTrophy,
    accessRoles: CONTENTS['userStatistics'].accessRoles,
    roleAccess: CONTENTS['userStatistics'].roleAccess,
  },
  {
    id: 1,
    group: 1,
    name: 'Услуги',
    href: 'services',
    icon: faHeart,
    accessRoles: CONTENTS['services'].accessRoles,
    roleAccess: CONTENTS['services'].roleAccess,
  },
  {
    id: 2,
    group: 1,
    name: 'Заявки на услуги',
    href: 'servicesUsers',
    icon: faHandHoldingHeart,
    accessRoles: CONTENTS['servicesUsers'].accessRoles,
    roleAccess: CONTENTS['servicesUsers'].roleAccess,
  },
  {
    id: 3,
    group: 1,
    name: 'Мои заявки на услуги',
    href: 'myServices',
    icon: faHandHoldingHeart,
    accessRoles: CONTENTS['myServices'].accessRoles,
    roleAccess: CONTENTS['myServices'].roleAccess,
  },
  {
    id: 4,
    group: 2,
    name: 'Мероприятия',
    href: 'events',
    icon: faCalendarAlt,
    accessRoles: CONTENTS['events'].accessRoles,
    roleAccess: CONTENTS['events'].roleAccess,
  },
  {
    id: 5,
    group: 3,
    name: 'Направления',
    href: 'directions',
    icon: faHeart,
    accessRoles: CONTENTS['directions'].accessRoles,
    roleAccess: CONTENTS['directions'].roleAccess,
  },
  {
    id: 6,
    group: 3,
    name: 'Доп. блоки',
    href: 'additionalBlocks',
    icon: faCube,
    accessRoles: CONTENTS['additionalBlocks'].accessRoles,
    roleAccess: CONTENTS['additionalBlocks'].roleAccess,
  },
  {
    id: 7,
    group: 3,
    name: 'Отзывы',
    href: 'reviews',
    icon: faComments,
    accessRoles: CONTENTS['reviews'].accessRoles,
    roleAccess: CONTENTS['reviews'].roleAccess,
  },
  {
    id: 8,
    group: 3,
    name: 'Контакты',
    href: 'contacts',
    icon: faPhone,
    accessRoles: CONTENTS['contacts'].accessRoles,
    roleAccess: CONTENTS['contacts'].roleAccess,
  },
  {
    id: 9,
    group: 4,
    name: 'Пользователи',
    href: 'users',
    icon: faUser,
    accessRoles: CONTENTS['users'].accessRoles,
    roleAccess: CONTENTS['users'].roleAccess,
  },
  {
    id: 10,
    group: 5,
    name: 'Транзакции',
    href: 'payments',
    icon: faMoneyBill,
    accessRoles: CONTENTS['payments'].accessRoles,
    roleAccess: CONTENTS['payments'].roleAccess,
  },
  {
    id: 11,
    group: 5,
    name: 'Непривязанные транзакции',
    href: 'paymentsWithNoEvent',
    icon: faUnlink,
    badge: badgePaymentsOfEventWithoutEventIdSelector,
    accessRoles: CONTENTS['paymentsWithNoEvent'].accessRoles,
    roleAccess: CONTENTS['paymentsWithNoEvent'].roleAccess,
  },

  {
    id: 12,
    group: 5,
    name: 'Не пришли на мероприятие',
    href: 'paymentsNotParticipantsEvent',
    icon: faUserTimes,
    // badge: badgePaymentsWithoutUserWritingToEventSelector,
    accessRoles: CONTENTS['paymentsNotParticipantsEvent'].accessRoles,
    roleAccess: CONTENTS['paymentsNotParticipantsEvent'].roleAccess,
  },

  {
    id: 13,
    group: 6,
    name: 'Записи на мероприятия',
    href: 'histories',
    icon: faUsers,
    accessRoles: CONTENTS['histories'].accessRoles,
    roleAccess: CONTENTS['histories'].roleAccess,
  },
  {
    id: 14,
    group: 6,
    name: 'Дни рождения',
    href: 'birthdays',
    icon: faBirthdayCake,
    accessRoles: CONTENTS['birthdays'].accessRoles,
    badge: badgeBirthdaysTodayCountSelector,
    roleAccess: CONTENTS['birthdays'].roleAccess,
  },
  // {
  //   id: 14,
  //   group: 6,
  //   name: 'Статистика',
  //   href: 'statistics',
  //   icon: faPieChart,
  //   accessRoles: CONTENTS['statistics'].accessRoles,
  // },
  {
    id: 15,
    group: 7,
    name: 'Мероприятия',
    href: 'statisticsEvents',
    icon: faCalendarAlt,
    accessRoles: CONTENTS['statisticsEvents'].accessRoles,
    roleAccess: CONTENTS['statisticsEvents'].roleAccess,
  },
  {
    id: 16,
    group: 7,
    name: 'Пользователи',
    href: 'statisticsUsers',
    icon: faUser,
    accessRoles: CONTENTS['statisticsUsers'].accessRoles,
    roleAccess: CONTENTS['statisticsUsers'].roleAccess,
  },
  {
    id: 17,
    group: 7,
    name: 'Финансы',
    href: 'statisticsFinance',
    icon: faMoneyBill,
    accessRoles: CONTENTS['statisticsFinance'].accessRoles,
    roleAccess: CONTENTS['statisticsFinance'].roleAccess,
  },
  {
    id: 50,
    group: 8,
    name: 'Участники клуба',
    href: 'members',
    icon: faUser,
    accessRoles: CONTENTS['members'].accessRoles,
    roleAccess: CONTENTS['members'].roleAccess,
  },
  {
    id: 70,
    group: 9,
    name: 'Генератор текста анонса мероприятий',
    href: 'toolsTextEventsAnons',
    icon: faFileText,
    accessRoles: CONTENTS['toolsTextEventsAnons'].accessRoles,
    roleAccess: CONTENTS['toolsTextEventsAnons'].roleAccess,
  },
  {
    id: 71,
    group: 9,
    name: 'Редактор анонса мероприятия',
    href: 'toolsEventAnons',
    icon: faImage,
    accessRoles: CONTENTS['toolsEventAnons'].accessRoles,
    roleAccess: CONTENTS['toolsEventAnons'].roleAccess,
  },
  {
    id: 72,
    group: 9,
    name: 'Редактор анонса списка мероприятий',
    href: 'toolsAnons',
    icon: faImage,
    accessRoles: CONTENTS['toolsAnons'].accessRoles,
    roleAccess: CONTENTS['toolsAnons'].roleAccess,
  },
  {
    id: 73,
    group: 9,
    name: 'Экспорт данных',
    href: 'toolsExport',
    icon: faUpload,
    accessRoles: CONTENTS['toolsExport'].accessRoles,
    roleAccess: CONTENTS['toolsExport'].roleAccess,
  },
  {
    id: 74,
    group: 9,
    name: 'Рассылки',
    href: 'newsletter',
    icon: faEnvelope,
    accessRoles: CONTENTS['newsletter'].accessRoles,
    roleAccess: CONTENTS['newsletter'].roleAccess,
  },
  {
    id: 80,
    group: 10,
    name: 'Сервис подтверждения номера',
    href: 'settingsCodeSendService',
    icon: faPhone,
    accessRoles: CONTENTS['settingsCodeSendService'].accessRoles,
    roleAccess: CONTENTS['settingsCodeSendService'].roleAccess,
  },
  {
    id: 81,
    group: 10,
    name: 'Меню "Вопрос"',
    href: 'settingsFabMenu',
    icon: faQuestion,
    accessRoles: CONTENTS['settingsFabMenu'].accessRoles,
    roleAccess: CONTENTS['settingsFabMenu'].roleAccess,
  },
  {
    id: 82,
    group: 10,
    name: 'Роли',
    href: 'settingsRoles',
    icon: faUsers,
    accessRoles: CONTENTS['settingsRoles'].accessRoles,
    roleAccess: CONTENTS['settingsRoles'].roleAccess,
  },
  {
    id: 99,
    group: 99,
    name: 'Разработчик',
    href: 'dev',
    icon: faBug,
    accessRoles: CONTENTS['dev'].accessRoles,
    roleAccess: CONTENTS['dev'].roleAccess,
  },
]

export const pagesGroups = [
  {
    id: 0,
    name: 'Моя статистика',
    icon: faTrophy,
    // accessRoles: ['client', 'moder', 'admin', 'supervisor', 'dev'],
    // accessStatuses: ['member'],
  },
  {
    id: 1,
    name: 'Услуги',
    icon: faHeart,
    // accessRoles: ['client', 'admin', 'supervisor', 'dev'],
  },
  {
    id: 2,
    name: 'Мероприятия',
    icon: faCalendarAlt,
    // accessRoles: ['client', 'moder', 'admin', 'supervisor', 'dev'],
  },
  {
    id: 3,
    name: 'Сайт',
    icon: faHome,
    // accessRoles: ['moder', 'supervisor', 'dev'],
  },
  {
    id: 4,
    name: 'Пользователи',
    icon: faUser,
    // accessRoles: ['moder', 'admin', 'supervisor', 'dev'],
  },
  {
    id: 5,
    name: 'Транзакции',
    icon: faMoneyBill,
    // accessRoles: ['supervisor', 'dev'],
  },
  {
    id: 6,
    name: 'События',
    icon: faHistory,
    // accessRoles: ['moder', 'admin', 'supervisor', 'dev'],
  },
  {
    id: 7,
    name: 'Статистика',
    icon: faPieChart,
    // accessRoles: ['supervisor', 'dev'],
  },
  {
    id: 8,
    name: 'Участники клуба',
    icon: faUser,
    // accessRoles: ['client'],
    // accessStatuses: ['member'],
  },
  {
    id: 9,
    name: 'Инструменты',
    icon: faTools,
    // accessRoles: ['moder', 'admin', 'supervisor', 'dev'],
  },
  {
    id: 10,
    name: 'Настройки',
    icon: faCog,
    // accessRoles: ['supervisor', 'dev'],
  },
  {
    id: 99,
    name: 'Разработчик',
    icon: faBug,
    // accessRoles: ['dev']
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
    icon: faMoneyBill, // faUserAlt,
  },
  {
    value: 'toEvent',
    name: 'Затраты организатора',
    color: 'red-400',
    icon: faMoneyBill, //faCalendar,
  },
  {
    value: 'fromUser',
    name: 'Оплата мероприятия',
    color: 'green-400',
    icon: faMoneyBill, //faUserAlt,
  },
  {
    value: 'fromEvent',
    name: 'Доп. доходы',
    color: 'green-400',
    icon: faMoneyBill, //faCalendar,
  },
]

export const EVENT_PAY_DIRECTIONS = [
  {
    value: 'toUser',
    name: 'Пользователю (за помощь)',
    color: 'red-400',
    icon: faMoneyBill, //faUserAlt,
  },
  {
    value: 'toEvent',
    name: 'Затраты на мероприятие',
    color: 'red-400',
    icon: faMoneyBill, //faCalendar,
  },
  {
    value: 'fromUser',
    name: 'Оплата мероприятия',
    color: 'green-400',
    icon: faMoneyBill, //faUserAlt,
  },
  {
    value: 'fromEvent',
    name: 'Доп. доходы',
    color: 'green-400',
    icon: faMoneyBill, //faCalendar,
  },
]

export const SERVICE_PAY_DIRECTIONS = [
  {
    value: 'toUser',
    name: 'Специалисту',
    color: 'red-400',
    icon: faMoneyBill, //faUserAlt,
  },
  {
    value: 'toService',
    name: 'Затраты на услугу',
    color: 'red-400',
    icon: faMoneyBill, //faHeart,
  },
  {
    value: 'fromUser',
    name: 'Оплата услуги',
    color: 'green-400',
    icon: faMoneyBill, //faUserAlt,
  },
  {
    value: 'fromService',
    name: 'Доп. доходы',
    color: 'green-400',
    icon: faMoneyBill, //faHeart,
  },
]

export const PRODUCT_PAY_DIRECTIONS = [
  // {
  //   value: 'toUser',
  //   name: 'Покупателю (возврат)',
  //   color: 'red-400',
  //   icon: faUserAlt,
  // },
  {
    value: 'toProduct',
    name: 'Затраты на продукт',
    color: 'red-400',
    icon: faMoneyBill, //faHeart,
  },
  {
    value: 'fromUser',
    name: 'Оплата товара',
    color: 'green-400',
    icon: faMoneyBill, //faUserAlt,
  },
  {
    value: 'fromProduct',
    name: 'Доп. доходы',
    color: 'green-400',
    icon: faMoneyBill, //faHeart,
  },
]

export const PRODUCT_PAY_INTERNAL = [
  {
    value: 'toInternal',
    name: 'Затраты',
    color: 'red-400',
    icon: faMoneyBill, //faBriefcase,
  },
  {
    value: 'toUser',
    name: 'Зарплата работнику',
    color: 'red-400',
    icon: faMoneyBill, //faUserAlt,
  },
  {
    value: 'fromInternal',
    name: 'Доп. доходы',
    color: 'green-400',
    icon: faMoneyBill, //faBriefcase,
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
  { value: 'moder', name: 'Модератор', color: 'green-400' },
  { value: 'admin', name: 'Администратор', color: 'orange-400' },
  { value: 'supervisor', name: 'Руководитель', color: 'general' },
  { value: 'dev', name: 'Разработчик', color: 'danger' },
]

export const UCALLER_VOICE = true
export const UCALLER_MIX = true
