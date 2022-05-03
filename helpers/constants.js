import {
  faCalendarDay,
  faCheckCircle,
  faCircle,
  faClock,
  faComments,
  faGift,
  faMars,
  faMarsDouble,
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
import { faCalendar, faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import DirectionsContent from '@layouts/content/DirectionsContent'
import ReviewsContent from '@layouts/content/ReviewsContent'
import EventsContent from '@layouts/content/EventsContent'
import SertificateContent from '@layouts/content/SertificateContent'
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

export const DEFAULT_USER = {
  name: 'Гость',
  email: '',
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
  subRoles: [],
}

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
  sertificate: { Component: SertificateContent, name: 'Сайт / Сертификат' },
  events: { Component: EventsContent, name: 'Мероприятия' },
  questionnaire: { Component: QuestionnaireContent, name: 'Моя анкета' },
  users: { Component: UsersContent, name: 'Пользователи' },
}

export const pages = [
  {
    id: 0,
    group: 0,
    name: 'Направления',
    href: 'directions',
    icon: faHeart,
  },
  {
    id: 1,
    group: 0,
    name: 'Сертификат',
    href: 'sertificate',
    icon: faGift,
  },
  {
    id: 2,
    group: 0,
    name: 'Отзывы',
    href: 'reviews',
    icon: faComments,
  },
  {
    id: 3,
    group: 1,
    name: 'Мероприятия',
    href: 'events',
    icon: faCalendar,
  },
  {
    id: 4,
    group: 2,
    name: 'Пользователи',
    href: 'users',
    icon: faCalendar,
  },
]

export const pagesGroups = [
  { id: 0, name: 'Сайт', icon: faHome, access: 'admin' },
  { id: 1, name: 'Мероприятия', icon: faCalendarAlt, access: 'all' },
  { id: 2, name: 'Пользователи', icon: faUser, access: 'admin' },
  // { id: 2, name: 'Заказы', icon: faFire },
  // { id: 1, name: 'Склад', icon: faCubes },
  // { id: 3, name: 'Клиенты', icon: faUser },
  // { id: 4, name: 'Оплата', icon: faMoneyBill },
  // { id: 6, name: 'Настройки', icon: faCog, bottom: true },
  // { id: 10, name: 'Разработка', icon: faBug, bottom: true },
]
