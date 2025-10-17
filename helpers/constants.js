import { faBan } from '@fortawesome/free-solid-svg-icons/faBan'
import { faBirthdayCake } from '@fortawesome/free-solid-svg-icons/faBirthdayCake'
import { faBriefcase } from '@fortawesome/free-solid-svg-icons/faBriefcase'
import { faCertificate } from '@fortawesome/free-solid-svg-icons/faCertificate'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock'
import { faComments } from '@fortawesome/free-solid-svg-icons/faComments'
import { faCube } from '@fortawesome/free-solid-svg-icons/faCube'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope'
import { faGenderless } from '@fortawesome/free-solid-svg-icons/faGenderless'
import { faHands } from '@fortawesome/free-solid-svg-icons/faHands'
import { faHandshake } from '@fortawesome/free-solid-svg-icons/faHandshake'
import { faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons/faHandHoldingHeart'
import { faHistory } from '@fortawesome/free-solid-svg-icons/faHistory'
import { faGift } from '@fortawesome/free-solid-svg-icons/faGift'
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock'
import { faMars } from '@fortawesome/free-solid-svg-icons/faMars'
import { faMedal } from '@fortawesome/free-solid-svg-icons/faMedal'
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone'
import { faPieChart } from '@fortawesome/free-solid-svg-icons/faPieChart'
import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay'
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion'
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons/faShoppingBag'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt'
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import { faTools } from '@fortawesome/free-solid-svg-icons/faTools'
import { faTrophy } from '@fortawesome/free-solid-svg-icons/faTrophy'
import { faUpload } from '@fortawesome/free-solid-svg-icons/faUpload'
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers'
import { faUserTie } from '@fortawesome/free-solid-svg-icons/faUserTie'
import { faUserTimes } from '@fortawesome/free-solid-svg-icons/faUserTimes'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons/faUserPlus'
import { faVenus } from '@fortawesome/free-solid-svg-icons/faVenus'
import { faBug } from '@fortawesome/free-solid-svg-icons/faBug'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome'
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons/faMoneyBill'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart'

import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons/faCalendarAlt'
import { faCreditCard } from '@fortawesome/free-regular-svg-icons/faCreditCard'
import { faFileText } from '@fortawesome/free-regular-svg-icons/faFileText'
import { faImage } from '@fortawesome/free-regular-svg-icons/faImage'

import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram'
import { faTelegram } from '@fortawesome/free-brands-svg-icons/faTelegram'
import { faVk } from '@fortawesome/free-brands-svg-icons/faVk'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp'

import { faImages } from '@fortawesome/free-solid-svg-icons/faImages'
import { faSquare } from '@fortawesome/free-regular-svg-icons/faSquare'
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons/faCheckSquare'

import { faHeartCircleCheck } from '@fortawesome/free-solid-svg-icons/faHeartCircleCheck'
import { faHeading } from '@fortawesome/free-solid-svg-icons/faHeading'

import dynamic from 'next/dynamic'
const ServicesContent = dynamic(
  () => import('@layouts/content/ServicesContent')
)
const DirectionsContent = dynamic(
  () => import('@layouts/content/DirectionsContent')
)
const ReviewsContent = dynamic(() => import('@layouts/content/ReviewsContent'))
const EventsContent = dynamic(() => import('@layouts/content/EventsContent'))
const AdditionalBlocksContent = dynamic(
  () => import('@layouts/content/AdditionalBlocksContent')
)
const QuestionnaireContent = dynamic(
  () => import('@layouts/content/QuestionnaireContent')
)
const UsersContent = dynamic(() => import('@layouts/content/UsersContent'))
const MembersContent = dynamic(() => import('@layouts/content/MembersContent'))

const PaymentsContent = dynamic(
  () => import('@layouts/content/PaymentsContent')
)
const DevContent = dynamic(() => import('@layouts/content/DevContent'))
const ContactsContent = dynamic(
  () => import('@layouts/content/ContactsContent')
)
const TitleBlockContent = dynamic(
  () => import('@layouts/content/TitleBlockContent')
)
const HistoriesContent = dynamic(
  () => import('@layouts/content/HistoriesContent')
)
const BirthdaysContent = dynamic(
  () => import('@layouts/content/BirthdaysContent')
)
const SettingsCodeSendServiceContent = dynamic(
  () => import('@layouts/content/SettingsCodeSendServiceContent')
)
const PaymentsNotParticipantsEventContent = dynamic(
  () => import('@layouts/content/PaymentsNotParticipantsEventContent')
)
const PaymentsForNotExistedEventsContent = dynamic(
  () => import('@layouts/content/PaymentsForNotExistedEventsContent')
)
const PaymentsFromNotExistedUsersContent = dynamic(
  () => import('@layouts/content/PaymentsFromNotExistedUsersContent')
)
const ServicesUsersContent = dynamic(
  () => import('@layouts/content/ServicesUsersContent')
)
const ServicesLoggedUserContent = dynamic(
  () => import('@layouts/content/ServicesLoggedUserContent')
)
const ToolsAnonsContent = dynamic(
  () => import('@layouts/content/ToolsAnonsContent')
)
const ToolsExportContent = dynamic(
  () => import('@layouts/content/ToolsExportContent')
)
const StatisticsFinanceContent = dynamic(
  () => import('@layouts/content/StatisticsFinanceContent')
)
const StatisticsUsersContent = dynamic(
  () => import('@layouts/content/StatisticsUsersContent')
)
const StatisticsEventsContent = dynamic(
  () => import('@layouts/content/StatisticsEventsContent')
)
const ToolsEventAnonsInstagramContent = dynamic(
  () => import('@layouts/content/ToolsEventAnonsInstagramContent')
)
const ToolsTextEventsAnonsContent = dynamic(
  () => import('@layouts/content/ToolsTextEventsAnonsContent')
)
const UserStatisticsContent = dynamic(
  () => import('@layouts/content/UserStatisticsContent')
)
const ToolsNewsletterContent = dynamic(
  () => import('@layouts/content/ToolsNewsletterContent')
)
const LoggedUserNotificationsContent = dynamic(
  () => import('@layouts/content/LoggedUserNotificationsContent')
)
const SettingsFabMenuContent = dynamic(
  () => import('@layouts/content/SettingsFabMenuContent')
)
const SettingsReferralSystemContent = dynamic(
  () => import('@layouts/content/SettingsReferralSystemContent')
)
const SettingsRolesContent = dynamic(
  () => import('@layouts/content/SettingsRolesContent')
)
const SupervisorBlockContent = dynamic(
  () => import('@layouts/content/SupervisorBlockContent')
)
const SettingsDateStartProjectContent = dynamic(
  () => import('@layouts/content/SettingsDateStartProjectContent')
)
const HeaderInfoContactsContent = dynamic(
  () => import('@layouts/content/HeaderInfoContactsContent')
)
const ToolsImageConstructorContent = dynamic(
  () => import('@layouts/content/ToolsImageConstructorContent')
)
const ToolsEventAnonsVkContent = dynamic(
  () => import('@layouts/content/ToolsEventAnonsVkContent')
)
const IndividualWeddingsContent = dynamic(
  () => import('@layouts/content/IndividualWeddingsContent')
)
const SettingsAchievementsContent = dynamic(
  () => import('@layouts/content/SettingsAchievementsContent')
)

import ZodiacCapricorn from '@svg/zodiac/ZodiacCapricorn'
import ZodiacTaurus from '@svg/zodiac/ZodiacTaurus'
import ZodiacGemini from '@svg/zodiac/ZodiacGemini'
import ZodiacCancer from '@svg/zodiac/ZodiacCancer'
import ZodiacLeo from '@svg/zodiac/ZodiacLeo'
import ZodiacLibra from '@svg/zodiac/ZodiacLibra'
import ZodiacSagittarius from '@svg/zodiac/ZodiacSagittarius'
import ZodiacAries from '@svg/zodiac/ZodiacAries'
import ZodiacAquarius from '@svg/zodiac/ZodiacAquarius'
import ZodiacPisces from '@svg/zodiac/ZodiacPisces'
import ZodiacVirgo from '@svg/zodiac/ZodiacVirgo'
import ZodiacScorpio from '@svg/zodiac/ZodiacScorpio'

import badgeBirthdaysTodayCountSelector from '@state/selectors/badgeBirthdaysTodayCountSelector'

import { uid } from 'uid'
import ImagesServerContent from '@layouts/content/ImagesServerContent'
import LikesContent from '@layouts/content/LikesContent'
import ReferralsAdminContent from '@layouts/content/ReferralsAdminContent'
import ReferralsContent from '@layouts/content/ReferralsContent'
import badgeLoggedUserLikesToSeeSelector from '@state/selectors/badgeLoggedUserLikesToSeeSelector'
import badgeUnviewedAchievementsSelector from '@state/selectors/badgeUnviewedAchievementsSelector'
import RemindDatesContent from '@layouts/content/RemindDatesContent'
import WhatsappMessagesContent from '@layouts/content/WhatsappMessagesContent'
// const colors = [
//   'border-blue-400',
//   'border-red-400',
//   'border-yellow-400',
//   'border-green-400',
//   'border-purple-400',
//   'border-orange-400',
//   'border-gray-400',
//   'border-amber-400',
//   'border-pink-400',
//   'text-red-400',
//   'text-blue-400',
//   'text-yellow-400',
//   'text-green-400',
//   'text-purple-400',
//   'text-orange-400',
//   'text-disabled',
//   'text-amber-400',
//   'text-pink-400',
//   'bg-blue-400',
//   'bg-red-400',
//   'bg-yellow-400',
//   'bg-green-400',
//   'bg-purple-400',
//   'bg-orange-400',
//   'bg-gray-400',
//   'bg-amber-400',
//   'bg-pink-400',
//   'border-blue-500',
//   'border-red-500',
//   'border-yellow-500',
//   'border-green-500',
//   'border-purple-500',
//   'border-orange-500',
//   'border-gray-500',
//   'border-amber-500',
//   'border-pink-500',
//   'text-red-500',
//   'text-blue-500',
//   'text-yellow-500',
//   'text-green-500',
//   'text-purple-500',
//   'text-orange-500',
//   'text-gray-500',
//   'text-amber-500',
//   'text-pink-500',
//   'bg-blue-500',
//   'bg-red-500',
//   'bg-yellow-500',
//   'bg-green-500',
//   'bg-purple-500',
//   'bg-orange-500',
//   'bg-gray-500',
//   'bg-amber-500',
//   'bg-pink-500',
//   'border-blue-600',
//   'border-yellow-600',
//   'border-red-600',
//   'border-green-600',
//   'border-purple-600',
//   'border-orange-600',
//   'border-gray-600',
//   'border-amber-600',
//   'border-pink-600',
//   'border-amber-700',
//   'border-orange-700',
//   'text-gray-600',
//   'text-blue-600',
//   'text-yellow-600',
//   'text-green-600',
//   'text-purple-600',
//   'text-orange-600',
//   'text-gray-600',
//   'text-amber-600',
//   'text-pink-600',
//   'text-amber-700',
//   'text-orange-700',
//   'bg-blue-600',
//   'bg-red-600',
//   'bg-yellow-600',
//   'bg-green-600',
//   'bg-purple-600',
//   'bg-orange-600',
//   'bg-gray-600',
//   'bg-amber-600',
//   'bg-pink-600',
//   'bg-amber-700',
//   'bg-orange-700',
//   'hover:border-blue-400',
//   'hover:border-red-400',
//   'hover:border-yellow-400',
//   'hover:border-green-400',
//   'hover:border-purple-400',
//   'hover:border-orange-400',
//   'hover:border-gray-400',
//   'hover:border-amber-400',
//   'hover:border-pink-400',
//   'hover:text-red-400',
//   'hover:text-blue-400',
//   'hover:text-yellow-400',
//   'hover:text-green-400',
//   'hover:text-purple-400',
//   'hover:text-orange-400',
//   'hover:text-disabled',
//   'hover:text-amber-400',
//   'hover:text-pink-400',
//   'hover:bg-blue-400',
//   'hover:bg-red-400',
//   'hover:bg-yellow-400',
//   'hover:bg-green-400',
//   'hover:bg-purple-400',
//   'hover:bg-orange-400',
//   'hover:bg-gray-400',
//   'hover:bg-amber-400',
//   'hover:bg-pink-400',
//   'hover:border-blue-500',
//   'hover:border-red-500',
//   'hover:border-yellow-500',
//   'hover:border-green-500',
//   'hover:border-purple-500',
//   'hover:border-orange-500',
//   'hover:border-gray-500',
//   'hover:border-amber-500',
//   'hover:border-pink-500',
//   'hover:text-red-500',
//   'hover:text-blue-500',
//   'hover:text-yellow-500',
//   'hover:text-green-500',
//   'hover:text-purple-500',
//   'hover:text-orange-500',
//   'hover:text-gray-500',
//   'hover:text-amber-500',
//   'hover:text-pink-500',
//   'hover:text-amber-600',
//   'hover:bg-blue-500',
//   'hover:bg-red-500',
//   'hover:bg-yellow-500',
//   'hover:bg-green-500',
//   'hover:bg-purple-500',
//   'hover:bg-orange-500',
//   'hover:bg-gray-500',
//   'hover:bg-amber-500',
//   'hover:bg-pink-500',
//   'hover:border-blue-600',
//   'hover:border-red-600',
//   'hover:border-yellow-600',
//   'hover:border-green-600',
//   'hover:border-purple-600',
//   'hover:border-orange-600',
//   'hover:border-gray-600',
//   'hover:border-amber-600',
//   'hover:border-pink-600',
//   'hover:border-amber-700',
//   'hover:border-orange-700',
//   'hover:text-red-600',
//   'hover:text-blue-600',
//   'hover:text-yellow-600',
//   'hover:text-green-600',
//   'hover:text-purple-600',
//   'hover:text-orange-600',
//   'hover:text-gray-600',
//   'hover:text-amber-600',
//   'hover:text-pink-600',
//   'hover:text-amber-700',
//   'hover:text-orange-700',
//   'hover:bg-blue-600',
//   'hover:bg-red-600',
//   'hover:bg-yellow-600',
//   'hover:bg-green-600',
//   'hover:bg-purple-600',
//   'hover:bg-orange-600',
//   'hover:bg-gray-600',
//   'hover:bg-amber-600',
//   'hover:bg-pink-600',
//   'hover:bg-amber-700',
//   'hover:bg-orange-700',
// ]

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

export const LOCATIONS = {
  // dev: {
  //   townRu: 'тестовый город',
  //   roditPadeg: 'тестового города',
  //   // domen: 'https://половинкауспеха.рф',
  //   // short: 'krsk',
  //   imageFolder: 'polovinka_uspeha_dev',
  //   telegramBotName: 'polovinka_uspeha_bot',
  //   towns: [
  //     'Тест',
  //     // 'Сосновоборск',
  //     // 'Дивногорск',
  //     // 'Железногорск',
  //     // 'Дрокино',
  //     // 'Емельяново',
  //   ],
  //   hidden: true,
  // },
  krsk: {
    townRu: 'красноярск',
    roditPadeg: 'красноярского',
    // domen: 'https://половинкауспеха.рф',
    // short: 'krsk',
    imageFolder: 'polovinka_uspeha',
    // telegramBotName: 'polovinka_uspeha_bot',
    towns: [
      'Красноярск',
      'Сосновоборск',
      'Дивногорск',
      'Железногорск',
      'Дрокино',
      'Емельяново',
    ],
    hidden: false,
  },
  nrsk: {
    townRu: 'норильск',
    roditPadeg: 'норильского',
    // domen: 'https://nrsk.половинкауспеха.рф',
    // short: 'nrsk',
    imageFolder: 'polovinka_uspeha_nrsk',
    // telegramBotName: 'polovinka_uspeha_nrsk_bot',
    towns: ['Норильск', 'Талнах', 'Кайеркан', 'Оганер', 'Дудинка', 'Алыкель'],
    hidden: false,
  },
  ekb: {
    townRu: 'екатеринбург',
    roditPadeg: 'екатеринбуржского',
    // domen: 'https://nrsk.половинкауспеха.рф',
    // short: 'nrsk',
    imageFolder: 'polovinka_uspeha_ekb',
    // telegramBotName: 'polovinka_uspeha_ekb_bot',
    towns: [
      'Екатеринбург',
      'Среднеуральск',
      'Нижний Тагил',
      'Полевской',
      'Верхняя Пышма',
      'Березовский',
    ],
    hidden: false,
  },
}

export const LOCATIONS_KEYS_VISIBLE = Object.keys(LOCATIONS).filter(
  (location) => !LOCATIONS[location].hidden
)

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
  fullSecondName: true,
  fullThirdName: true,
  showBirthday: true,
  // showAge: null,
  // showContacts: null,
  showPhone: false,
  showWhatsapp: false,
  showViber: false,
  showTelegram: false,
  showInstagram: false,
  showVk: false,
  showEmail: false,
})

export const DEFAULT_USERS_NOTIFICATIONS = Object.freeze({
  telegram: { active: false, userName: null, id: null },
  whatsapp: { active: true },
  push: { active: false, subscriptions: [] },
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
  // interests: '',
  // profession: '',
  // orientation: null,
  relationship: null,
  town: '',
  personalStatus: '',
  status: 'novice',
  lastActivityAt: null,
  prevActivityAt: null,
  archive: false,
  haveKids: null,
  security: DEFAULT_USERS_SECURITY,
  notifications: DEFAULT_USERS_NOTIFICATIONS,
})

const DEFAULT_ADDRESS = Object.freeze({
  town: '',
  street: '',
  house: '',
  entrance: '',
  floor: '',
  flat: '',
  comment: '',
  link2Gis: '',
  linkYandexNavigator: '',
  link2GisShow: true,
  linkYandexShow: true,
})

export const DEFAULT_REMIND_DATE = Object.freeze({
  name: '',
  date: null,
  comment: '',
})

export const DEFAULT_EVENT = Object.freeze({
  directionId: null,
  organizerId: null,
  title: '',
  description: '',
  dateStart: null,
  dateEnd: null,
  address: DEFAULT_ADDRESS,
  status: 'active',
  images: [],
  showOnSite: true,
  report: '',
  reportImages: [],
  warning: false,
  likes: false,
  likesProcessActive: true,
  blank: false,
})

export const DEFAULT_SUBEVENT = Object.freeze({
  title: '',
  description: '',
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
  usersRelationshipAccess: 'yes',
  isReserveActive: true,
})

export const DEFAULT_QUESTIONNAIRE = Object.freeze({
  title: '',
  data: [],
})

export const DEFAULT_QUESTIONNAIRE_ITEM = Object.freeze({
  type: 'text',
  label: '',
  key: '',
  show: true,
  required: false,
})

export const DEFAULT_IMAGE_CONSTRUCTOR_ITEM = Object.freeze({
  type: 'text',
  key: '',
  show: true,
})

export const DEFAULT_DIRECTION = Object.freeze({
  title: '',
  shortDescription: '',
  description: '',
  image: null,
  showOnSite: true,
  rules: {
    userStatus: 'select',
    userRelationship: 'select',
  },
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
  isReferralCoupon: false,
  referralReward: null,
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
  referralProgram: {
    enabled: false,
    enabledForCenter: false,
    enabledForClub: false,
    referrerCouponAmount: 0,
    referralCouponAmount: 0,
    requirePaidEvent: false,
  },
})

export const EVENT_RELATIONSHIP_ACCESS = [
  { value: 'yes', name: 'Всем', color: 'green-400' },
  { value: 'no', name: 'Без пары', color: 'blue-400' },
  { value: 'only', name: 'Только с парой', color: 'red-400' },
]

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
  { value: 'reserve', name: 'Резерв', color: 'orange-400' },
  { value: 'assistant', name: 'Ведущий', color: 'blue-400' },
  { value: 'ban', name: 'Бан', color: 'red-400' },
]

export const GENDERS = [
  { value: 'male', name: 'Мужчина', color: 'blue-400', icon: faMars },
  { value: 'famale', name: 'Женщина', color: 'red-400', icon: faVenus },
]

export const CHECKED_BUTTONS = [
  { value: 'checked', name: 'Выбрано', color: 'general', icon: faCheckSquare },
  { value: 'unchecked', name: 'Не выбрано', color: 'gray-500', icon: faSquare },
]

export const GENDERS_WITH_NO_GENDER = [
  ...GENDERS,
  { value: 'null', name: 'Не выбрано', color: 'gray-400', icon: faGenderless },
]

// export const ORIENTATIONS = [
//   { value: 'getero', name: 'Гетеросексуал', color: 'blue-400' },
//   { value: 'bi', name: 'Бисексуал', color: 'purple-400' },
//   { value: 'homo', name: 'Гомосексуал', color: 'red-400' },
// ]

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
      serviceRegistration: false,
      newEventsByTags: true,
      remindDates: false,
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
      seeReserveOnCard: false,
      eventUsersCounterAndAgeFull: false,
      seeHistory: false,
      editLikes: false,
      sendNotifications: false,
    },
    eventsUsers: {
      see: false, // member
      edit: false,
      copyListToClipboard: false,
      seeHistory: false,
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
      seeHistory: false,
      seeActionsHistory: false,
      seeNotificationIconOnCard: false,
    },
    services: {
      see: true,
      seeHidden: false,
      add: false,
      edit: false,
      delete: false,
      seeHistory: false,
    },
    servicesUsers: {
      see: false,
      add: false,
      edit: false,
      delete: false,
      statusEdit: false,
    },
    products: {
      see: false,
      seeHidden: false,
      add: false,
      edit: false,
      delete: false,
      seeHistory: false,
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
      seeHistory: false,
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
      imageConstructor: false,
      individualWeddings: false,
    },
    newsletters: {
      see: false,
      add: false,
      delete: false,
    },
    generalPage: {
      directions: false,
      additionalBlocks: false,
      reviews: false,
      supervisor: false,
      contacts: false,
      siteTitleSettings: false,
    },
    siteSettings: {
      phoneConfirmService: false,
      fabMenu: false,
      referralSystem: false,
      achievements: false,
      roles: false,
      dateStartProject: false,
      headerInfo: false,
      remindDatesEdit: false,
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
      serviceRegistration: false,
      newEventsByTags: false,
      remindDates: true,
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
      seeReserveOnCard: true,
      eventUsersCounterAndAgeFull: true,
      seeHistory: false,
      editLikes: false,
      sendNotifications: false,
    },
    eventsUsers: {
      see: true, // member
      edit: true,
      copyListToClipboard: true,
      seeHistory: true,
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
      add: true,
      edit: true,
      setRole: false,
      setStatus: true,
      delete: false,
      seeHistory: false,
      seeActionsHistory: false,
      seeNotificationIconOnCard: true,
    },
    services: {
      see: true,
      seeHidden: true,
      add: false,
      edit: false,
      delete: false,
      seeHistory: false,
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
      seeHistory: false,
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
      seeHistory: false,
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
      export: true,
      imageConstructor: false,
      individualWeddings: false,
    },
    newsletters: {
      see: false,
      add: false,
      delete: false,
    },
    generalPage: {
      directions: true,
      additionalBlocks: true,
      reviews: true,
      supervisor: false,
      contacts: false,
      siteTitleSettings: false,
    },
    siteSettings: {
      phoneConfirmService: false,
      fabMenu: false,
      referralSystem: false,
      achievements: false,
      roles: false,
      dateStartProject: false,
      headerInfo: false,
      remindDatesEdit: false,
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
      serviceRegistration: true,
      newEventsByTags: true,
      remindDates: true,
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
      seeReserveOnCard: true,
      eventUsersCounterAndAgeFull: true,
      seeHistory: false,
      editLikes: false,
      sendNotifications: false,
    },
    eventsUsers: {
      see: true, // member
      edit: true,
      copyListToClipboard: true,
      seeHistory: true,
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
      seeHistory: false,
      seeActionsHistory: false,
      seeNotificationIconOnCard: true,
    },
    services: {
      see: true,
      seeHidden: true,
      add: true,
      edit: true,
      delete: false,
      seeHistory: false,
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
      seeHistory: false,
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
      seeHistory: false,
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
      export: true,
      imageConstructor: false,
      individualWeddings: false,
    },
    newsletters: {
      see: false,
      add: false,
      delete: false,
    },
    generalPage: {
      directions: true,
      additionalBlocks: true,
      reviews: true,
      supervisor: false,
      contacts: true,
      siteTitleSettings: false,
    },
    siteSettings: {
      phoneConfirmService: false,
      fabMenu: false,
      referralSystem: false,
      achievements: false,
      roles: false,
      dateStartProject: false,
      headerInfo: false,
      remindDatesEdit: true,
    },
    notices: {
      histories: true,
      birthdays: true,
    },
  },
  {
    _id: 'supervisor',
    name: 'Руководитель филиала',
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
      serviceRegistration: true,
      newEventsByTags: true,
      remindDates: true,
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
      seeReserveOnCard: true,
      eventUsersCounterAndAgeFull: true,
      seeHistory: true,
      editLikes: true,
      sendNotifications: true,
    },
    eventsUsers: {
      see: true, // member
      edit: true,
      copyListToClipboard: true,
      seeHistory: true,
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
      seeHistory: true,
      seeActionsHistory: true,
      seeNotificationIconOnCard: true,
    },
    services: {
      see: true,
      seeHidden: true,
      add: true,
      edit: true,
      delete: true,
      seeHistory: true,
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
      seeHistory: true,
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
      seeHistory: true,
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
      imageConstructor: false,
      individualWeddings: false,
    },
    newsletters: {
      see: true,
      add: true,
      delete: true,
    },
    generalPage: {
      directions: true,
      additionalBlocks: true,
      reviews: true,
      supervisor: true,
      contacts: true,
      siteTitleSettings: true,
    },
    siteSettings: {
      phoneConfirmService: false,
      fabMenu: true,
      referralSystem: true,
      achievements: true,
      roles: true,
      dateStartProject: false,
      headerInfo: true,
      remindDatesEdit: true,
    },
    notices: {
      histories: true,
      birthdays: true,
    },
  },
  {
    _id: 'president',
    name: 'Руководитель проекта',
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
      serviceRegistration: true,
      newEventsByTags: true,
      remindDates: true,
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
      seeReserveOnCard: true,
      eventUsersCounterAndAgeFull: true,
      seeHistory: true,
      editLikes: true,
      sendNotifications: true,
    },
    eventsUsers: {
      see: true, // member
      edit: true,
      copyListToClipboard: true,
      seeHistory: true,
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
      seeHistory: true,
      seeActionsHistory: true,
      seeNotificationIconOnCard: true,
    },
    services: {
      see: true,
      seeHidden: true,
      add: true,
      edit: true,
      delete: true,
      seeHistory: true,
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
      seeHistory: true,
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
      seeHistory: true,
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
      imageConstructor: false,
      individualWeddings: true,
    },
    newsletters: {
      see: true,
      add: true,
      delete: true,
    },
    generalPage: {
      directions: true,
      additionalBlocks: true,
      reviews: true,
      supervisor: true,
      contacts: true,
      siteTitleSettings: true,
    },
    siteSettings: {
      phoneConfirmService: false,
      fabMenu: true,
      referralSystem: true,
      achievements: true,
      roles: true,
      dateStartProject: false,
      headerInfo: true,
      remindDatesEdit: true,
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
    dev: true,
    seeMyStatistics: true,
    setSelfStatus: true,
    setSelfRole: true,
    hideFab: true,
    notifications: {
      // option: true,
      birthdays: true,
      newUserRegistred: true,
      eventRegistration: true,
      serviceRegistration: true,
      newEventsByTags: true,
      remindDates: true,
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
      seeReserveOnCard: true,
      eventUsersCounterAndAgeFull: true,
      seeHistory: true,
      editLikes: true,
      sendNotifications: true,
    },
    eventsUsers: {
      see: true, // ! member
      edit: true,
      copyListToClipboard: true,
      seeHistory: true,
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
      seeHistory: true,
      seeActionsHistory: true,
      seeNotificationIconOnCard: true,
    },
    services: {
      see: true,
      seeHidden: true,
      add: true,
      edit: true,
      delete: true,
      seeHistory: true,
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
      seeHistory: true,
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
      seeHistory: true,
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
      imageConstructor: true,
      individualWeddings: true,
    },
    newsletters: {
      see: true,
      add: true,
      delete: true,
    },
    generalPage: {
      directions: true,
      additionalBlocks: true,
      reviews: true,
      supervisor: true,
      contacts: true,
      siteTitleSettings: true,
    },
    siteSettings: {
      phoneConfirmService: true,
      fabMenu: true,
      referralSystem: true,
      achievements: true,
      roles: true,
      dateStartProject: true,
      headerInfo: true,
      remindDatesEdit: true,
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

const getReferralProgramFlags = (referralProgram = {}) => {
  const hasExplicitEnabled = typeof referralProgram?.enabled === 'boolean'
  const fallbackEnabled =
    referralProgram?.enabledForCenter === true ||
    referralProgram?.enabledForClub === true
  const enabled = hasExplicitEnabled
    ? referralProgram.enabled === true
    : fallbackEnabled
  const enabledForCenter =
    typeof referralProgram?.enabledForCenter === 'boolean'
      ? referralProgram.enabledForCenter
      : enabled
  const enabledForClub =
    typeof referralProgram?.enabledForClub === 'boolean'
      ? referralProgram.enabledForClub
      : enabled

  return {
    enabled,
    enabledForCenter,
    enabledForClub,
  }
}

const isReferralProgramEnabled = (referralProgram) =>
  getReferralProgramFlags(referralProgram).enabled

const isReferralProgramEnabledForStatus = (referralProgram, status) => {
  const { enabled, enabledForCenter, enabledForClub } =
    getReferralProgramFlags(referralProgram)

  if (!enabled) return false
  if (status === 'member') return enabledForClub
  return enabledForCenter
}

export const CONTENTS = Object.freeze({
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
  siteTitleSettings: {
    Component: TitleBlockContent,
    name: 'Сайт / Заголовоки',
    accessRoles: ['supervisor', 'dev'],
    roleAccess: (role) => role?.generalPage?.siteTitleSettings,
  },
  supervisor: {
    Component: SupervisorBlockContent,
    name: 'Сайт / Руководитель региона',
    accessRoles: ['supervisor', 'dev'],
    roleAccess: (role) => role?.generalPage?.supervisor,
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
  // paymentsWithNoEvent: {
  //   Component: PaymentsWithoutEventContent,
  //   name: 'Транзакции / Непривязанные транзакции',
  //   accessRoles: ['supervisor', 'dev'],
  //   roleAccess: (role) => role?.payments?.paymentsWithNoEvent,
  // },
  paymentsNotParticipantsEvent: {
    Component: PaymentsNotParticipantsEventContent,
    name: 'Транзакции / Не пришли на мероприятие',
    accessRoles: ['supervisor', 'dev'],
    roleAccess: (role) => role?.payments?.paymentsNotParticipantsEvent,
  },
  // TODO Временное
  paymentsForNotExistedEvents: {
    Component: PaymentsForNotExistedEventsContent,
    name: 'Транзакции / Со ссылками на несуществующие мероприятия',
    accessRoles: ['dev'],
    roleAccess: (role) => role?.dev,
  },
  paymentsFromNotExistedUsers: {
    Component: PaymentsFromNotExistedUsersContent,
    name: 'Транзакции / Со ссылками на несуществующих пользователей',
    accessRoles: ['dev'],
    roleAccess: (role) => role?.dev,
  },
  dev: {
    Component: DevContent,
    name: 'Разработчик',
    accessRoles: ['dev'],
    roleAccess: (role) => role?.dev,
  },
  whatsappMessaging: {
    Component: WhatsappMessagesContent,
    name: 'Рассылка WhatsApp',
    accessRoles: ['dev'],
    roleAccess: (role) => role?.dev,
  },
  toolsTextEventsAnons: {
    Component: ToolsTextEventsAnonsContent,
    name: 'Инструменты / Генератор текста анонса мероприятий',
    accessRoles: ['moder', 'admin', 'supervisor', 'dev'],
    roleAccess: (role) => role?.instruments?.anonsTextGenerator,
  },
  toolsEventAnonsInstagram: {
    Component: ToolsEventAnonsInstagramContent,
    name: 'Инструменты / Редактор анонса в Instagram',
    accessRoles: ['moder', 'supervisor', 'dev'],
    roleAccess: (role) => role?.instruments?.anonsEventImageGenerator,
  },
  toolsEventAnonsVk: {
    Component: ToolsEventAnonsVkContent,
    name: 'Инструменты / Редактор анонса в VK',
    accessRoles: ['moder', 'supervisor', 'dev'],
    roleAccess: (role) => role?.instruments?.anonsEventImageGenerator,
  },
  toolsAnons: {
    Component: ToolsAnonsContent,
    name: 'Инструменты / Редактор анонса списка мероприятий',
    accessRoles: ['moder', 'supervisor', 'dev'],
    roleAccess: (role) => role?.instruments?.anonsEventListImageGenerator,
  },
  toolsImageConstructor: {
    Component: ToolsImageConstructorContent,
    name: 'Инструменты / Конструктор картинок',
    accessRoles: ['dev'],
    roleAccess: (role) => role?.instruments?.imageConstructor,
  },
  toolsExport: {
    Component: ToolsExportContent,
    name: 'Инструменты / Экспорт данных',
    accessRoles: ['supervisor', 'dev'],
    roleAccess: (role) => role?.instruments?.export,
  },
  toolsIndividualWeddings: {
    Component: IndividualWeddingsContent,
    name: 'Инструменты / Индивидуальные свидания',
    accessRoles: ['president', 'dev'],
    roleAccess: (role) => role?.instruments?.individualWeddings,
  },
  newsletter: {
    Component: ToolsNewsletterContent,
    name: 'Инструменты / Рассылка',
    accessRoles: ['dev'],
    roleAccess: (role) => role?.newsletters?.see,
    siteConfirm: (siteSettings) => siteSettings?.newsletter?.whatsappActivated,
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
  settingsAchievements: {
    Component: SettingsAchievementsContent,
    name: 'Настройки / Достижения',
    accessRoles: ['supervisor', 'president', 'dev'],
    roleAccess: (role) => role?.siteSettings?.achievements,
  },
  settingsReferralSystem: {
    Component: SettingsReferralSystemContent,
    name: 'Настройки / Реферальная система',
    accessRoles: ['supervisor', 'dev'],
    roleAccess: (role) => role?.siteSettings?.referralSystem,
  },
  settingsDateStartProject: {
    Component: SettingsDateStartProjectContent,
    name: 'Настройки / Дата старта проекта',
    accessRoles: ['dev'],
    roleAccess: (role) => role?.siteSettings?.dateStartProject,
  },
  settingsRoles: {
    Component: SettingsRolesContent,
    name: 'Настройки / Роли',
    accessRoles: ['dev'],
    roleAccess: (role) => role?.siteSettings?.roles,
  },
  settingsHeaderInfoContacts: {
    Component: HeaderInfoContactsContent,
    name: 'Настройки / Информация для вступления в клуб',
    accessRoles: ['supervisor', 'dev'],
    roleAccess: (role) => role?.siteSettings?.headerInfo,
  },
  userStatistics: {
    Component: UserStatisticsContent,
    name: 'Моя статистика',
    accessRoles: ['client', 'admin', 'supervisor', 'dev'],
    accessStatuses: ['member'],
    roleAccess: (role, status) => role?.seeMyStatistics || status === 'member',
  },
  referrals: {
    Component: ReferralsContent,
    name: 'Реферальная программа',
    accessRoles: ['client', 'moder', 'admin', 'supervisor', 'dev'],
    roleAccess: (role, status, siteSettings) => {
      const roleId = role?._id
      if (roleId && roleId !== 'client') return true

      return isReferralProgramEnabledForStatus(
        siteSettings?.referralProgram,
        status
      )
    },
    siteConfirm: (siteSettings) =>
      isReferralProgramEnabled(siteSettings?.referralProgram),
  },
  referralsAdmin: {
    Component: ReferralsAdminContent,
    name: 'Реферальная программа / Администрирование',
    accessRoles: ['admin', 'president', 'supervisor', 'dev'],
    roleAccess: (role) => role?.payments?.see,
  },
  imagesServer: {
    Component: ImagesServerContent,
    name: 'Сервер картинок',
    accessRoles: ['dev'],
    roleAccess: (role) => role?.dev,
  },
  likes: {
    Component: LikesContent,
    name: 'Лайки',
    accessRoles: ['client', 'moder', 'admin', 'supervisor', 'dev'],
    roleAccess: (role, status) => true,
  },
  remindDates: {
    Component: RemindDatesContent,
    name: 'Особые даты ПУ',
    accessRoles: ['moder', 'admin', 'supervisor', 'dev'],
    roleAccess: (role, status) => role?.siteSettings?.remindDatesEdit,
  },
})

export const pages = [
  {
    id: 0,
    group: 0,
    name: 'Моя статистика',
    href: 'userStatistics',
    icon: faTrophy,
    badge: badgeUnviewedAchievementsSelector,
    // accessRoles: CONTENTS['userStatistics'].accessRoles,
    roleAccess: CONTENTS['userStatistics'].roleAccess,
  },
  {
    id: 1,
    group: 12,
    name: 'Рефералы',
    href: 'referrals',
    icon: faHandshake,
    roleAccess: CONTENTS['referrals'].roleAccess,
    siteConfirm: CONTENTS['referrals'].siteConfirm,
  },
  {
    id: 87,
    group: 12,
    name: 'Рефералы / Администрирование',
    href: 'referralsAdmin',
    icon: faUserTie,
    roleAccess: CONTENTS['referralsAdmin'].roleAccess,
  },
  {
    id: 2,
    group: 1,
    name: 'Лайки',
    href: 'likes',
    icon: faHeart,
    badge: badgeLoggedUserLikesToSeeSelector,
    // hidden: menuHiddenLoggedUserLikesSelector,
    // accessRoles: CONTENTS['likes'].accessRoles,
    roleAccess: CONTENTS['likes'].roleAccess,
  },
  {
    id: 3,
    group: 2,
    name: 'Услуги',
    href: 'services',
    icon: faHandHoldingHeart,
    // accessRoles: CONTENTS['services'].accessRoles,
    roleAccess: CONTENTS['services'].roleAccess,
  },
  {
    id: 4,
    group: 2,
    name: 'Заявки на услуги',
    href: 'servicesUsers',
    icon: faHands,
    // accessRoles: CONTENTS['servicesUsers'].accessRoles,
    roleAccess: CONTENTS['servicesUsers'].roleAccess,
  },
  {
    id: 5,
    group: 2,
    name: 'Мои заявки на услуги',
    href: 'myServices',
    icon: faHands,
    // accessRoles: CONTENTS['myServices'].accessRoles,
    roleAccess: CONTENTS['myServices'].roleAccess,
  },
  {
    id: 6,
    group: 3,
    name: 'Мероприятия',
    href: 'events',
    icon: faCalendarAlt,
    // accessRoles: CONTENTS['events'].accessRoles,
    roleAccess: CONTENTS['events'].roleAccess,
  },
  {
    id: 7,
    group: 4,
    name: 'Заголовки',
    href: 'siteTitleSettings',
    icon: faHeading,
    // accessRoles: CONTENTS['siteTitleSettings'].accessRoles,
    roleAccess: CONTENTS['siteTitleSettings'].roleAccess,
  },
  {
    id: 8,
    group: 4,
    name: 'Направления',
    href: 'directions',
    icon: faHeart,
    // accessRoles: CONTENTS['directions'].accessRoles,
    roleAccess: CONTENTS['directions'].roleAccess,
  },
  {
    id: 9,
    group: 4,
    name: 'Доп. блоки',
    href: 'additionalBlocks',
    icon: faCube,
    // accessRoles: CONTENTS['additionalBlocks'].accessRoles,
    roleAccess: CONTENTS['additionalBlocks'].roleAccess,
  },
  {
    id: 10,
    group: 4,
    name: 'Отзывы',
    href: 'reviews',
    icon: faComments,
    // accessRoles: CONTENTS['reviews'].accessRoles,
    roleAccess: CONTENTS['reviews'].roleAccess,
  },
  {
    id: 11,
    group: 4,
    name: 'Контакты',
    href: 'contacts',
    icon: faPhone,
    // accessRoles: CONTENTS['contacts'].accessRoles,
    roleAccess: CONTENTS['contacts'].roleAccess,
  },
  {
    id: 12,
    group: 4,
    name: 'Руководитель региона',
    href: 'supervisor',
    icon: faUserTie,
    // accessRoles: CONTENTS['supervisor'].accessRoles,
    roleAccess: CONTENTS['supervisor'].roleAccess,
  },
  {
    id: 13,
    group: 5,
    name: 'Пользователи',
    href: 'users',
    icon: faUser,
    // accessRoles: CONTENTS['users'].accessRoles,
    roleAccess: CONTENTS['users'].roleAccess,
  },
  {
    id: 14,
    group: 6,
    name: 'Транзакции',
    href: 'payments',
    icon: faMoneyBill,
    // accessRoles: CONTENTS['payments'].accessRoles,
    roleAccess: CONTENTS['payments'].roleAccess,
  },
  // {
  //   id: 12,
  //   group: 5,
  //   name: 'Непривязанные транзакции',
  //   href: 'paymentsWithNoEvent',
  //   icon: faUnlink,
  //   badge: badgePaymentsOfEventWithoutEventIdSelector,
  //   accessRoles: CONTENTS['paymentsWithNoEvent'].accessRoles,
  //   roleAccess: CONTENTS['paymentsWithNoEvent'].roleAccess,
  // },
  {
    id: 15,
    group: 6,
    name: 'Не пришли на мероприятие',
    href: 'paymentsNotParticipantsEvent',
    icon: faUserTimes,
    // badge: badgePaymentsWithoutUserWritingToEventSelector,
    // accessRoles: CONTENTS['paymentsNotParticipantsEvent'].accessRoles,
    roleAccess: CONTENTS['paymentsNotParticipantsEvent'].roleAccess,
  },
  {
    id: 16,
    group: 6,
    name: 'Со ссылками на несущ. мероприятия',
    href: 'paymentsForNotExistedEvents',
    icon: faBug,
    // badge: badgePaymentsWithoutUserWritingToEventSelector,
    // accessRoles: CONTENTS['paymentsForNotExistedEvents'].accessRoles,
    roleAccess: CONTENTS['paymentsForNotExistedEvents'].roleAccess,
  },
  {
    id: 17,
    group: 6,
    name: 'Со ссылками на несущ. пользователей',
    href: 'paymentsFromNotExistedUsers',
    icon: faBug,
    // badge: badgePaymentsWithoutUserWritingToEventSelector,
    // accessRoles: CONTENTS['paymentsFromNotExistedUsers'].accessRoles,
    roleAccess: CONTENTS['paymentsFromNotExistedUsers'].roleAccess,
  },
  {
    id: 18,
    group: 7,
    name: 'Записи на мероприятия',
    href: 'histories',
    icon: faUsers,
    // accessRoles: CONTENTS['histories'].accessRoles,
    roleAccess: CONTENTS['histories'].roleAccess,
  },
  {
    id: 19,
    group: 7,
    name: 'Дни рождения',
    href: 'birthdays',
    icon: faBirthdayCake,
    // accessRoles: CONTENTS['birthdays'].accessRoles,
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
    id: 20,
    group: 8,
    name: 'Мероприятия',
    href: 'statisticsEvents',
    icon: faCalendarAlt,
    // accessRoles: CONTENTS['statisticsEvents'].accessRoles,
    roleAccess: CONTENTS['statisticsEvents'].roleAccess,
  },
  {
    id: 21,
    group: 8,
    name: 'Пользователи',
    href: 'statisticsUsers',
    icon: faUser,
    // accessRoles: CONTENTS['statisticsUsers'].accessRoles,
    roleAccess: CONTENTS['statisticsUsers'].roleAccess,
  },
  {
    id: 22,
    group: 8,
    name: 'Финансы',
    href: 'statisticsFinance',
    icon: faMoneyBill,
    // accessRoles: CONTENTS['statisticsFinance'].accessRoles,
    roleAccess: CONTENTS['statisticsFinance'].roleAccess,
  },
  {
    id: 50,
    group: 9,
    name: 'Участники клуба',
    href: 'members',
    icon: faUser,
    // accessRoles: CONTENTS['members'].accessRoles,
    roleAccess: CONTENTS['members'].roleAccess,
  },
  {
    id: 70,
    group: 10,
    name: 'Генератор текста анонса мероприятий',
    href: 'toolsTextEventsAnons',
    icon: faFileText,
    // accessRoles: CONTENTS['toolsTextEventsAnons'].accessRoles,
    roleAccess: CONTENTS['toolsTextEventsAnons'].roleAccess,
  },
  {
    id: 71,
    group: 10,
    name: 'Редактор анонса в Instagram',
    href: 'toolsEventAnonsInstagram',
    icon: faImage,
    // accessRoles: CONTENTS['toolsEventAnonsInstagram'].accessRoles,
    roleAccess: CONTENTS['toolsEventAnonsInstagram'].roleAccess,
  },
  {
    id: 72,
    group: 10,
    name: 'Редактор анонса в Vk',
    href: 'toolsEventAnonsVk',
    icon: faImage,
    // accessRoles: CONTENTS['toolsEventAnonsVk'].accessRoles,
    roleAccess: CONTENTS['toolsEventAnonsVk'].roleAccess,
  },
  {
    id: 73,
    group: 10,
    name: 'Редактор анонса списка мероприятий',
    href: 'toolsAnons',
    icon: faImage,
    // accessRoles: CONTENTS['toolsAnons'].accessRoles,
    roleAccess: CONTENTS['toolsAnons'].roleAccess,
  },
  {
    id: 74,
    group: 10,
    name: 'Экспорт данных',
    href: 'toolsExport',
    icon: faUpload,
    // accessRoles: CONTENTS['toolsExport'].accessRoles,
    roleAccess: CONTENTS['toolsExport'].roleAccess,
  },
  {
    id: 75,
    group: 10,
    name: 'Рассылки',
    href: 'newsletter',
    icon: faEnvelope,
    // accessRoles: CONTENTS['newsletter'].accessRoles,
    roleAccess: CONTENTS['newsletter'].roleAccess,
    siteConfirm: CONTENTS['newsletter'].siteConfirm,
  },
  {
    id: 76,
    group: 10,
    name: 'Индивидуальные свидания',
    href: 'toolsIndividualWeddings',
    icon: faHeartCircleCheck,
    // accessRoles: CONTENTS['toolsIndividualWeddings'].accessRoles,
    roleAccess: CONTENTS['toolsIndividualWeddings'].roleAccess,
  },
  {
    id: 77,
    group: 10,
    name: 'Конструктор картинок',
    href: 'toolsImageConstructor',
    icon: faImage,
    // accessRoles: CONTENTS['toolsImageConstructor'].accessRoles,
    roleAccess: CONTENTS['toolsImageConstructor'].roleAccess,
  },

  {
    id: 80,
    group: 11,
    name: 'Сервис подтверждения номера',
    href: 'settingsCodeSendService',
    icon: faPhone,
    // accessRoles: CONTENTS['settingsCodeSendService'].accessRoles,
    roleAccess: CONTENTS['settingsCodeSendService'].roleAccess,
  },
  {
    id: 81,
    group: 11,
    name: 'Меню "Вопрос"',
    href: 'settingsFabMenu',
    icon: faQuestion,
    // accessRoles: CONTENTS['settingsFabMenu'].accessRoles,
    roleAccess: CONTENTS['settingsFabMenu'].roleAccess,
  },
  {
    id: 85,
    group: 11,
    name: 'Достижения',
    href: 'settingsAchievements',
    icon: faMedal,
    // accessRoles: CONTENTS['settingsAchievements'].accessRoles,
    roleAccess: CONTENTS['settingsAchievements'].roleAccess,
  },
  {
    id: 86,
    group: 11,
    name: 'Реферальная система',
    href: 'settingsReferralSystem',
    icon: faGift,
    // accessRoles: CONTENTS['settingsReferralSystem'].accessRoles,
    roleAccess: CONTENTS['settingsReferralSystem'].roleAccess,
  },
  {
    id: 82,
    group: 11,
    name: 'Роли',
    href: 'settingsRoles',
    icon: faUsers,
    // accessRoles: CONTENTS['settingsRoles'].accessRoles,
    roleAccess: CONTENTS['settingsRoles'].roleAccess,
  },
  {
    id: 83,
    group: 11,
    name: 'Дата старта проекта',
    href: 'settingsDateStartProject',
    icon: faStar,
    // accessRoles: CONTENTS['settingsDateStartProject'].accessRoles,
    roleAccess: CONTENTS['settingsDateStartProject'].roleAccess,
  },
  {
    id: 84,
    group: 11,
    name: 'Информация для вступления в клуб',
    href: 'settingsHeaderInfoContacts',
    icon: faMedal,
    // accessRoles: CONTENTS['settingsHeaderInfoContacts'].accessRoles,
    roleAccess: CONTENTS['settingsHeaderInfoContacts'].roleAccess,
  },
  {
    id: 85,
    group: 11,
    name: 'Особые даты ПУ',
    href: 'remindDates',
    icon: faCalendarAlt,
    // accessRoles: CONTENTS['remindDates'].accessRoles,
    roleAccess: CONTENTS['remindDates'].roleAccess,
  },

  {
    id: 97,
    group: 99,
    name: 'Рассылка WhatsApp',
    href: 'whatsappMessaging',
    icon: faWhatsapp,
    // accessRoles: CONTENTS['dev'].accessRoles,
    roleAccess: CONTENTS['dev'].roleAccess,
  },
  {
    id: 98,
    group: 99,
    name: 'Тестирование',
    href: 'dev',
    icon: faBug,
    // accessRoles: CONTENTS['dev'].accessRoles,
    roleAccess: CONTENTS['dev'].roleAccess,
  },
  {
    id: 99,
    group: 99,
    name: 'Сервер картинок',
    href: 'imagesServer',
    icon: faImages,
    // accessRoles: CONTENTS['dev'].accessRoles,
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
    id: 3,
    name: 'Мероприятия',
    icon: faCalendarAlt,
    // accessRoles: ['client', 'moder', 'admin', 'supervisor', 'dev'],
  },
  {
    id: 1,
    name: 'Лайки',
    icon: faHeart,
    // accessRoles: ['client', 'admin', 'supervisor', 'dev'],
  },
  {
    id: 2,
    name: 'Услуги',
    icon: faHandHoldingHeart,
    // accessRoles: ['client', 'admin', 'supervisor', 'dev'],
  },
  {
    id: 4,
    name: 'Сайт',
    icon: faHome,
    // accessRoles: ['moder', 'supervisor', 'dev'],
  },
  {
    id: 5,
    name: 'Пользователи',
    icon: faUser,
    // accessRoles: ['moder', 'admin', 'supervisor', 'dev'],
  },
  {
    id: 6,
    name: 'Транзакции',
    icon: faMoneyBill,
    // accessRoles: ['supervisor', 'dev'],
  },
  {
    id: 7,
    name: 'События',
    icon: faHistory,
    // accessRoles: ['moder', 'admin', 'supervisor', 'dev'],
  },
  {
    id: 8,
    name: 'Статистика',
    icon: faPieChart,
    // accessRoles: ['supervisor', 'dev'],
  },
  {
    id: 9,
    name: 'Участники клуба',
    icon: faUser,
    // accessRoles: ['client'],
    // accessStatuses: ['member'],
  },
  {
    id: 12,
    name: 'Рефералы',
    icon: faHandshake,
    // accessRoles: ['client', 'moder', 'admin', 'supervisor', 'dev'],
  },
  {
    id: 10,
    name: 'Инструменты',
    icon: faTools,
    // accessRoles: ['moder', 'admin', 'supervisor', 'dev'],
  },
  {
    id: 11,
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

export const REFERRAL_REWARD_FOR_VALUES = [
  {
    value: 'referral',
    name: 'Реферал',
    color: 'green-400',
    icon: faUserPlus,
  },
  {
    value: 'referrer',
    name: 'Реферер',
    color: 'blue-400',
    icon: faUserTie,
  },
]

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

export const DEFAULT_SUBEVENT_GENERATOR = () => ({
  id: uid(24),
  title: 'Вариант участия №1',
  price: 0,
  usersStatusDiscount: { ...DEFAULT_USERS_STATUS_DISCOUNT },
  maxParticipants: null,
  maxMans: null,
  maxWomans: null,
  maxMansNovice: null,
  maxWomansNovice: null,
  maxMansMember: null,
  maxWomansMember: null,
  minMansAge: 18,
  minWomansAge: 18,
  maxMansAge: 60,
  maxWomansAge: 60,
  usersStatusAccess: { ...DEFAULT_USERS_STATUS_ACCESS },
  usersRelationshipAccess: 'yes',
  isReserveActive: true,
})

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

// export const UCALLER_VOICE = true
// export const UCALLER_MIX = true
