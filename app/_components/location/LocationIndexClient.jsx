'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons/faCalendarDays'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons/faLocationDot'
import {
  ADDITIONAL_BLOCK_TILE_COLORS,
  LOCATIONS,
  LOCATIONS_KEYS_VISIBLE,
} from '@helpers/constants'
import AboutSpaceCard from '@layouts/cards/AboutSpaceCard'
import { AdditionalBlockCardContent } from '@layouts/cards/AdditionalBlockCard'
import { DirectionCardView } from '@layouts/cards/DirectionCard'
import SpaceStatsCard from '@layouts/cards/SpaceStatsCard'
import NoOrphanText from '@components/NoOrphanText'
import ImagesMarquee from '@components/ImagesMarquee'
import HeroImageSlider from '@components/HeroImageSlider'
import SvgKavichki from '@svg/SvgKavichki'
import { getNounYears } from '@helpers/getNoun'
import {
  fetchingAdditionalBlocks,
  fetchingDirections,
  fetchingEvents,
  fetchingEventsUsers,
  fetchingGlobalAboutSpaceCards,
  fetchingReviews,
  fetchingSiteSettings,
} from '@helpers/fetchers'
import subEventsSummator from '@helpers/subEventsSummator'
import DOMPurify from 'isomorphic-dompurify'
import { captureAttributionFromBrowser } from '@helpers/attribution'
import getTelegramContactLink from '@helpers/telegramContactLink'

const services = [
  {
    title: 'ЛИЧНОЕ СОПРОВОЖДЕНИЕ',
    description:
      'Мягкая помощь в выборе формата, знакомстве и адаптации к новым людям.',
  },
  {
    title: 'ПОДАРОЧНЫЙ СЕРТИФИКАТ',
    description:
      'Тёплый подарок, который дарит живые эмоции и новые знакомства.',
    accent: true,
  },
  {
    title: 'ОРГАНИЗАЦИЯ ВСТРЕЧ ПОД ЗАПРОС',
    description:
      'Собираем небольшие группы под интересы: активные, творческие, деловые.',
  },
]

const reviews = [
  {
    name: 'Ольга',
    text: 'Впервые за долгое время почувствовала легкость и поддержку. Встречи очень живые!',
    photo: '/img/users/famale_gray.jpg',
  },
  {
    name: 'Сергей',
    text: 'Все устроено легко и без неловкости. Познакомился с новыми друзьями за один вечер.',
    photo: '/img/users/male_gray.jpg',
  },
  {
    name: 'Анна',
    text: 'Понравилась атмосфера доверия и спокойной модерации. Хочется приходить снова.',
    photo: '/img/users/famale.jpg',
  },
]

const DEFAULT_STATS = [
  {
    number: '800+',
    text: 'мероприятий организовано и проведено',
  },
  {
    number: '1500+',
    text: 'человек посетили наши мероприятия',
  },
  {
    number: '50+',
    text: 'пар нашли друг друга, из них 2 пары поженились и родились 2 детей',
  },
  {
    number: '400+',
    text: 'людей нашли друзей и единомышленников',
  },
  {
    number: '10+',
    text: 'благотворительных мероприятий направленных на помощь животным, детям и домам престарелых',
  },
  {
    number: '20+',
    text: 'туров и поездок было организовано и проведено',
  },
]

const MONTHS_FULL = [
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

const MONTHS_FULL_UPPER = [
  'ЯНВАРЬ',
  'ФЕВРАЛЬ',
  'МАРТ',
  'АПРЕЛЬ',
  'МАЙ',
  'ИЮНЬ',
  'ИЮЛЬ',
  'АВГУСТ',
  'СЕНТЯБРЬ',
  'ОКТЯБРЬ',
  'НОЯБРЬ',
  'ДЕКАБРЬ',
]

const WEEKDAY_LABELS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']
const CITY_NAMES_PREPOSITIONAL = {
  krsk: 'Красноярске',
  nrsk: 'Норильске',
  ekb: 'Екатеринбурге',
}

const navItems = [
  { id: 'about', label: 'О нас' },
  { id: 'announcements', label: 'Анонс мероприятий' },
  { id: 'reviews', label: 'Отзывы' },
  { id: 'contacts', label: 'Контакты' },
]

const spacesNavItems = [{ id: 'spaces', label: 'Наши пространства' }]
const DEFAULT_CLOSED_SPACE_SUBTITLE = 'ЗАКРЫТОЕ ПРОСТРАНСТВО ДЛЯ СВОИХ'
const DEFAULT_CLOSED_SPACE_DESCRIPTION =
  'Это формат с камерными встречами, где мы собираем небольшие группы по ценностям. Здесь больше глубины, доверия и долгих разговоров. Доступ открывается после знакомства с командой и участия в открытых мероприятиях.'

const AuthorizeButton = ({ onClick, disabled = false }) => (
  <button
    type="button"
    className="rounded-full btn-gradient-hover px-7 py-3 tracking-[0.05em] text-white disabled:cursor-not-allowed disabled:opacity-70"
    onClick={onClick}
    disabled={disabled}
  >
    <div className="flex flex-col items-center justify-center leading-5">
      <div className="font-semibold uppercase">Зарегистрироваться</div>
    </div>
  </button>
)

AuthorizeButton.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
}

AuthorizeButton.defaultProps = {
  onClick: undefined,
  disabled: false,
}

export default function LocationIndexClient({
  location,
  initialDirections,
  initialSiteSettings,
  initialGlobalAboutSpaceCards,
}) {
  const router = useRouter()
  const [activeDay, setActiveDay] = useState(null)
  const [calendarCursorDate, setCalendarCursorDate] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [events, setEvents] = useState([])
  const [eventsLoaded, setEventsLoaded] = useState(false)
  const [additionalBlocks, setAdditionalBlocks] = useState([])
  const [reviewsData, setReviewsData] = useState([])
  const [directionsData, setDirectionsData] = useState(
    Array.isArray(initialDirections) ? initialDirections : []
  )
  const [eventsUsers, setEventsUsers] = useState([])
  const [eventsUsersLoading, setEventsUsersLoading] = useState(true)
  const [reviewsPerView, setReviewsPerView] = useState(3)
  const defaultLocation = location || (LOCATIONS_KEYS_VISIBLE?.[0] ?? 'krsk')
  const cityName = LOCATIONS?.[defaultLocation]?.towns?.[0] || 'вашем городе'
  const cityNamePrepositional =
    CITY_NAMES_PREPOSITIONAL[defaultLocation] || cityName
  const reviewsContainerRef = useRef(null)
  const [reviewsIndex, setReviewsIndex] = useState(0)
  const reviewsGapPx = 16
  const headerRef = useRef(null)
  const calendarInitialMonthAppliedRef = useRef(false)
  const [siteSettings, setSiteSettings] = useState(initialSiteSettings || {})
  const [globalAboutSpaceCards, setGlobalAboutSpaceCards] = useState(
    Array.isArray(initialGlobalAboutSpaceCards)
      ? initialGlobalAboutSpaceCards
      : []
  )
  const [activeReview, setActiveReview] = useState(null)
  const [activeSpace, setActiveSpace] = useState(null)
  const [openingMessage, setOpeningMessage] = useState('')
  const reviewTextRefs = useRef(new Map())
  const [reviewOverflowMap, setReviewOverflowMap] = useState({})
  useEffect(() => {
    captureAttributionFromBrowser()
  }, [])
  const spaceStats = useMemo(() => {
    const items = siteSettings?.spaceStats
    if (!Array.isArray(items) || items.length === 0) return DEFAULT_STATS
    return [...items].sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
  }, [siteSettings])
  const aboutCards = useMemo(() => {
    const items = Array.isArray(globalAboutSpaceCards)
      ? globalAboutSpaceCards
      : []
    return [...items]
      .map((item, index) => ({
        id: item.id ?? `about-${index}`,
        title: item.title ?? '',
        text: item.text ?? '',
        wide: Boolean(item.wide),
        tone: item.tone ?? 'white',
        bgMode: item.bgMode ?? null,
        bgColor1: item.bgColor1 ?? null,
        bgColor2: item.bgColor2 ?? null,
        index: typeof item.index === 'number' ? item.index : index,
      }))
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
  }, [globalAboutSpaceCards])
  const supervisorProfile = useMemo(() => {
    const supervisor = siteSettings?.supervisor || {}
    const name = String(supervisor?.name || '').trim()
    const quote = String(supervisor?.quote || '').trim()
    const photo = String(supervisor?.photo || '').trim()
    const showOnSite = Boolean(supervisor?.showOnSite)

    return {
      name,
      quote,
      photo,
      showOnSite,
      hasContent: Boolean(name || quote || photo),
    }
  }, [siteSettings])
  const founderProfile = useMemo(() => {
    const founder = siteSettings?.founder || {}
    const hasFounderSettings = Boolean(
      founder && typeof founder === 'object' && Object.keys(founder).length > 0
    )

    const fallbackName = 'Надежда'
    const fallbackPhoto = '/img/other/gubina.jpg'
    const fallbackQuote =
      'Основатель пространства живых встреч, идейный вдохновитель, а также организатор и ведущая основных форматов пространства в городе Красноярске.'

    const name = String(founder?.name || fallbackName).trim()
    const quote = String(founder?.quote || fallbackQuote).trim()
    const photo = String(founder?.photo || fallbackPhoto).trim()
    const showOnSite = hasFounderSettings ? Boolean(founder?.showOnSite) : true

    return {
      name,
      quote,
      photo,
      showOnSite,
      hasContent: Boolean(name || quote || photo),
    }
  }, [siteSettings])

  useEffect(() => {
    let isMounted = true

    const loadPrimaryData = async () => {
      if (
        !Array.isArray(initialGlobalAboutSpaceCards) ||
        initialGlobalAboutSpaceCards.length === 0
      ) {
        const globalAboutSpaceCardsData = await fetchingGlobalAboutSpaceCards()
        if (!isMounted) return

        setGlobalAboutSpaceCards(
          Array.isArray(globalAboutSpaceCardsData?.aboutSpaceCards)
            ? globalAboutSpaceCardsData.aboutSpaceCards
            : []
        )
      }

      if (!Array.isArray(initialDirections) || initialDirections.length === 0) {
        const directions = await fetchingDirections(defaultLocation)
        if (!isMounted) return

        setDirectionsData(Array.isArray(directions) ? directions : [])
      }

      if (
        !initialSiteSettings ||
        Object.keys(initialSiteSettings).length === 0
      ) {
        const siteSettingsData = await fetchingSiteSettings(defaultLocation)
        if (!isMounted) return

        setSiteSettings(siteSettingsData || {})
      }
    }

    loadPrimaryData()

    return () => {
      isMounted = false
    }
  }, [
    defaultLocation,
    initialDirections,
    initialGlobalAboutSpaceCards,
    initialSiteSettings,
  ])

  useEffect(() => {
    let isMounted = true
    const now = new Date()

    calendarInitialMonthAppliedRef.current = false
    setEventsLoaded(false)
    setCalendarCursorDate(new Date(now.getFullYear(), now.getMonth(), 1))

    const loadSecondaryData = async () => {
      const [eventsData, additionalBlocksData, reviewsResponse] =
        await Promise.all([
          fetchingEvents(defaultLocation),
          fetchingAdditionalBlocks(defaultLocation),
          fetchingReviews(defaultLocation),
        ])

      if (!isMounted) return

      setEvents(Array.isArray(eventsData) ? eventsData : [])
      setEventsLoaded(true)
      setAdditionalBlocks(
        Array.isArray(additionalBlocksData) ? additionalBlocksData : []
      )
      setReviewsData(Array.isArray(reviewsResponse) ? reviewsResponse : [])
    }

    loadSecondaryData()

    return () => {
      isMounted = false
    }
  }, [defaultLocation])

  useEffect(() => {
    if (!eventsLoaded || calendarInitialMonthAppliedRef.current) return

    calendarInitialMonthAppliedRef.current = true
    const now = new Date()
    const hasUpcomingEventsThisMonth = events.some((event) => {
      const dateStart = event?.dateStart ? new Date(event.dateStart) : null
      if (!dateStart || Number.isNaN(dateStart.getTime())) return false
      if (event?.showOnSite === false || event?.status === 'canceled') return false
      if (dateStart < now) return false

      return (
        dateStart.getFullYear() === now.getFullYear() &&
        dateStart.getMonth() === now.getMonth()
      )
    })

    if (!hasUpcomingEventsThisMonth) {
      setCalendarCursorDate(
        new Date(now.getFullYear(), now.getMonth() + 1, 1)
      )
    }
  }, [events, eventsLoaded])

  useEffect(() => {
    let isMounted = true

    const loadEventsUsers = async () => {
      setEventsUsersLoading(true)
      const eventsUsersData = await fetchingEventsUsers(defaultLocation)
      if (!isMounted) return

      setEventsUsers(Array.isArray(eventsUsersData) ? eventsUsersData : [])
      setEventsUsersLoading(false)
    }

    loadEventsUsers()

    return () => {
      isMounted = false
    }
  }, [defaultLocation])

  const allSpacesFromDirections = useMemo(() => {
    return (directionsData || [])
      .sort((a, b) => (a.index < b.index ? -1 : 1))
      .map((direction) => ({
        id: direction._id,
        title: direction.title,
        description: direction.shortDescription || direction.description || '',
        fullDescription: direction.description || '',
        images: Array.isArray(direction.images) ? direction.images : [],
        showOnSite: direction?.showOnSite !== false,
      }))
  }, [directionsData])

  const spacesFromDirections = useMemo(
    () => allSpacesFromDirections.filter((space) => space.showOnSite),
    [allSpacesFromDirections]
  )

  const closedSpaceDirectionId = siteSettings?.closedSpace?.directionId ?? null
  const closedSpaceSubtitle =
    siteSettings?.closedSpace?.subtitle ?? DEFAULT_CLOSED_SPACE_SUBTITLE
  const closedSpaceDescription =
    siteSettings?.closedSpace?.description ?? DEFAULT_CLOSED_SPACE_DESCRIPTION
  const closedSpaceDirection = useMemo(
    () =>
      allSpacesFromDirections.find(
        (space) => String(space.id) === String(closedSpaceDirectionId)
      ) ?? null,
    [allSpacesFromDirections, closedSpaceDirectionId]
  )

  const index2AdditionalBlocks = useMemo(() => {
    return (additionalBlocks || [])
      .filter((block) => block?.showOnSite)
      .sort((a, b) => (a.index < b.index ? -1 : 1))
  }, [additionalBlocks])

  const visibleReviews = useMemo(() => {
    const normalized = (reviewsData || [])
      .filter((review) => review?.showOnSite)
      .map((review, index) => ({
        name: review.author,
        age: review.authorAge,
        text: review.review,
        photo: review.image,
        id: review._id,
        orderIndex: typeof review.index === 'number' ? review.index : index,
      }))
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))

    return normalized.length > 0
      ? normalized.map(({ orderIndex, ...rest }) => rest)
      : reviews
  }, [reviewsData])

  const contactsData = useMemo(() => {
    const phone = siteSettings?.phone || ''
    const email = siteSettings?.email || ''
    const whatsapp = siteSettings?.whatsapp || ''
    const ok = siteSettings?.ok || ''
    const telegram = siteSettings?.telegram || ''
    const instagram = siteSettings?.instagram || ''
    const vk = siteSettings?.vk || ''
    const cityName = LOCATIONS?.[defaultLocation]?.towns?.[0] || ''

    const normalizePhone = (value) => String(value ?? '').replace(/[^\d+]/g, '')
    const normalizeHandle = (value) =>
      String(value ?? '')
        .replace(/^@/, '')
        .trim()
    const telegramContact = getTelegramContactLink({ telegram, phone })

    const primary = [
      phone && {
        label: 'Телефон',
        value: phone,
        href: `tel:${normalizePhone(phone)}`,
      },
      email && { label: 'Email', value: email, href: `mailto:${email}` },
      cityName && { label: 'Город', value: cityName },
    ].filter(Boolean)

    const socials = [
      whatsapp && {
        label: 'WhatsApp',
        value: whatsapp,
        href: `https://wa.me/${normalizePhone(whatsapp)}`,
        badge: 'WA',
        tone: 'bg-[#25d366] text-white',
      },
      ok && {
        label: 'Одноклассники',
        value: `ok.ru/profile/${normalizeHandle(ok)}`,
        href: `https://ok.ru/profile/${normalizeHandle(ok)}`,
        badge: 'OK',
        tone: 'bg-[#f7931e] text-white',
      },
      telegramContact && {
        label: 'Telegram',
        value: telegramContact.title,
        href: telegramContact.href,
        badge: 'TG',
        tone: 'bg-[#2aabee] text-white',
      },
      instagram && {
        label: 'Instagram',
        value: `@${normalizeHandle(instagram)}`,
        href: `https://instagram.com/${normalizeHandle(instagram)}`,
        badge: 'IG',
        tone: 'bg-[#c13584] text-white',
      },
      vk && {
        label: 'VK',
        value: vk,
        href: vk.startsWith('http') ? vk : `https://vk.com/${vk}`,
        badge: 'VK',
        tone: 'bg-[#0077ff] text-white',
      },
    ].filter(Boolean)

    return { primary, socials }
  }, [defaultLocation, siteSettings])

  const navigateWithLoading = (href, message) => {
    if (!href || openingMessage) return
    setOpeningMessage(message || 'Открывается...')
    router.push(href)
  }

  const participantsByEventId = useMemo(
    () =>
      (eventsUsers || []).reduce((acc, eventUser) => {
        if (!eventUser?.eventId || eventUser?.status !== 'participant')
          return acc
        const current = acc.get(eventUser.eventId) ?? 0
        acc.set(eventUser.eventId, current + 1)
        return acc
      }, new Map()),
    [eventsUsers]
  )

  const featuredEvents = useMemo(() => {
    const now = new Date()
    const locationTown = String(
      LOCATIONS?.[defaultLocation]?.townRu || ''
    ).toLowerCase()

    return (events || [])
      .map((event) => {
        const dateStart = event?.dateStart ? new Date(event.dateStart) : null
        if (!dateStart || Number.isNaN(dateStart.getTime())) return null
        if (dateStart < now || event?.showOnSite === false) return null
        if (event?.status === 'canceled') return null

        const address = event.address || {}
        const addressTown = String(address.town || '').trim()
        const addressParts = [
          addressTown.toLowerCase() === locationTown ? null : addressTown,
          address.street,
          address.house,
        ].filter(Boolean)
        const prices = Array.isArray(event.subEvents)
          ? event.subEvents
              .map((item) => item?.price)
              .filter((price) => typeof price === 'number' && price >= 0)
          : []
        const summary = Array.isArray(event.subEvents)
          ? subEventsSummator(event.subEvents)
          : null
        const maxParticipants =
          typeof summary?.maxParticipants === 'number'
            ? summary.maxParticipants
            : typeof event.maxParticipants === 'number'
              ? event.maxParticipants
              : null

        return {
          id: event._id,
          title: event.title,
          description: String(event.description || '')
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim(),
          dateStart,
          dateEnd: event?.dateEnd ? new Date(event.dateEnd) : null,
          place:
            address.comment || addressParts.join(', ') || 'Место уточняется',
          priceInKopecks: prices.length > 0 ? Math.min(...prices) : null,
          maxParticipants,
        }
      })
      .filter(Boolean)
      .sort((a, b) => a.dateStart - b.dateStart)
      .slice(0, 3)
  }, [defaultLocation, events])

  useEffect(() => {
    const calcPerView = () => {
      const width = window.innerWidth
      if (width < 768) return 1
      if (width < 1024) return 2
      return 3
    }

    const updatePerView = () => {
      setReviewsPerView(calcPerView())
    }

    updatePerView()
    window.addEventListener('resize', updatePerView)
    return () => window.removeEventListener('resize', updatePerView)
  }, [])

  useEffect(() => {
    const measureOverflow = () => {
      const nextMap = {}
      visibleReviews.forEach((review) => {
        const el = reviewTextRefs.current.get(review.id ?? review.name)
        if (el) {
          nextMap[review.id ?? review.name] = el.scrollHeight > el.clientHeight
        }
      })
      setReviewOverflowMap(nextMap)
    }

    const raf = requestAnimationFrame(measureOverflow)
    window.addEventListener('resize', measureOverflow)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measureOverflow)
    }
  }, [visibleReviews, reviewsPerView])

  useEffect(() => {
    const items = document.querySelectorAll('[data-reveal]')
    if (!items.length) return undefined

    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('reveal-in'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [
    events.length,
    reviewsData.length,
    additionalBlocks.length,
    directionsData.length,
  ])

  const scrollReviewsToIndex = (index) => {
    const container = reviewsContainerRef.current
    if (!container) return
    const gapValue = reviewsGapPx
    const cardWidth =
      (container.clientWidth - gapValue * (reviewsPerView - 1)) / reviewsPerView
    container.scrollTo({
      left: (cardWidth + gapValue) * index,
      behavior: 'smooth',
    })
  }

  const handleReviewsNext = () => {
    const total = visibleReviews.length
    if (total === 0) return
    const maxIndex = Math.max(0, total - reviewsPerView)
    const nextIndex = reviewsIndex >= maxIndex ? 0 : reviewsIndex + 1
    setReviewsIndex(nextIndex)
    scrollReviewsToIndex(nextIndex)
  }

  const scrollToSection = (id) => {
    const target = document.getElementById(id)
    if (!target) return
    const headerHeight = headerRef.current?.offsetHeight ?? 0
    const offsetTop =
      target.getBoundingClientRect().top + window.scrollY - headerHeight
    window.scrollTo({ top: offsetTop, behavior: 'smooth' })
  }

  const { calendarDays, activeDays, eventsByDay, monthLabel, monthName } =
    useMemo(() => {
      const now = new Date()
      const cursorDate =
        calendarCursorDate instanceof Date &&
        !Number.isNaN(calendarCursorDate.getTime())
          ? calendarCursorDate
          : new Date(now.getFullYear(), now.getMonth(), 1)

      const getEventMaxParticipants = (event) => {
        const hasSubEvents =
          Array.isArray(event?.subEvents) && event.subEvents.length > 0
        if (hasSubEvents) {
          const summary = subEventsSummator(event.subEvents)
          if (typeof summary?.maxParticipants === 'number')
            return summary.maxParticipants
          const maxMans =
            typeof summary?.maxMans === 'number' ? summary.maxMans : 0
          const maxWomans =
            typeof summary?.maxWomans === 'number' ? summary.maxWomans : 0
          if (maxMans + maxWomans > 0) return maxMans + maxWomans
        }

        if (typeof event?.maxParticipants === 'number')
          return event.maxParticipants
        const maxMans = typeof event?.maxMans === 'number' ? event.maxMans : 0
        const maxWomans =
          typeof event?.maxWomans === 'number' ? event.maxWomans : 0
        if (maxMans + maxWomans > 0) return maxMans + maxWomans
        return null
      }

      const normalizedEvents = (events || [])
        .map((event) => {
          const dateStart = event?.dateStart ? new Date(event.dateStart) : null
          if (!dateStart || Number.isNaN(dateStart.getTime())) return null
          if (event?.showOnSite === false) return null
          if (event?.status === 'canceled') return null
          const maxParticipants = getEventMaxParticipants(event)
          return {
            ...event,
            dateStart,
            maxParticipants,
          }
        })
        .filter(Boolean)

      const upcoming = normalizedEvents
        .filter((event) => event.dateStart >= now)
        .sort((a, b) => a.dateStart - b.dateStart)

      const month = cursorDate.getMonth()
      const year = cursorDate.getFullYear()

      const monthEvents = upcoming.filter(
        (event) =>
          event.dateStart.getMonth() === month &&
          event.dateStart.getFullYear() === year
      )

      const daysInMonth = new Date(year, month + 1, 0).getDate()
      const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)
      const firstDaySundayFirst = new Date(year, month, 1).getDay()
      const firstDayMondayFirst = (firstDaySundayFirst + 6) % 7
      const prefix = Array.from({ length: firstDayMondayFirst }, () => null)
      const calendarCells = [...prefix, ...daysArray]
      const tailLength = (7 - (calendarCells.length % 7)) % 7
      const calendarGrid = [
        ...calendarCells,
        ...Array.from({ length: tailLength }, () => null),
      ]
      const locationTownLower = (
        LOCATIONS?.[defaultLocation]?.townRu || ''
      ).toLowerCase()
      const eventsByDayMap = monthEvents.reduce((acc, event) => {
        const day = event.dateStart.getDate()
        const address = event.address || {}
        const addressTownLower = (address.town || '').trim().toLowerCase()
        const addressParts = [
          addressTownLower &&
          locationTownLower &&
          addressTownLower === locationTownLower
            ? null
            : address.town,
          address.street,
          address.house,
        ].filter(Boolean)
        const place =
          addressParts.join(', ') || address.comment || 'Место уточняется'
        const time = event.dateStart.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        })

        if (!acc[day]) acc[day] = []
        acc[day].push({
          id: event._id,
          title: event.title,
          time,
          place,
          dateStart: event.dateStart,
          maxParticipants: event.maxParticipants,
        })
        return acc
      }, {})
      Object.values(eventsByDayMap).forEach((items) =>
        items.sort((a, b) => a.dateStart - b.dateStart)
      )
      const activeDaysList = Object.keys(eventsByDayMap)
        .map((day) => Number(day))
        .sort((a, b) => a - b)

      return {
        calendarDays: calendarGrid,
        activeDays: activeDaysList,
        eventsByDay: eventsByDayMap,
        monthLabel: `${MONTHS_FULL_UPPER[month]} ${year}`,
        monthName: MONTHS_FULL[month],
      }
    }, [events, calendarCursorDate])

  const isPrevMonthDisabled = useMemo(() => {
    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    return calendarCursorDate <= currentMonthStart
  }, [calendarCursorDate])

  const isNextMonthDisabled = useMemo(() => {
    const now = new Date()
    const upcomingEvents = (events || [])
      .map((event) => {
        const dateStart = event?.dateStart ? new Date(event.dateStart) : null
        if (!dateStart || Number.isNaN(dateStart.getTime())) return null
        if (event?.showOnSite === false) return null
        if (event?.status === 'canceled') return null
        if (dateStart < now) return null
        return dateStart
      })
      .filter(Boolean)

    if (upcomingEvents.length === 0) return true

    const maxEventDate = upcomingEvents.reduce(
      (max, current) => (current > max ? current : max),
      upcomingEvents[0]
    )
    const lastMonthWithEvents = new Date(
      maxEventDate.getFullYear(),
      maxEventDate.getMonth(),
      1
    )

    return calendarCursorDate >= lastMonthWithEvents
  }, [events, calendarCursorDate])

  const handlePrevMonth = () => {
    if (isPrevMonthDisabled) return
    setCalendarCursorDate((prev) => {
      const date = new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
      return date
    })
  }

  const handleNextMonth = () => {
    if (isNextMonthDisabled) return
    setCalendarCursorDate((prev) => {
      const date = new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
      return date
    })
  }

  useEffect(() => {
    if (activeDays.length === 0) {
      setActiveDay(null)
      return
    }
    if (!activeDays.includes(activeDay)) {
      setActiveDay(activeDays[0])
    }
  }, [activeDays, activeDay])

  const eventsForDay = activeDay ? eventsByDay[activeDay] || [] : []

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-[#211b1d]">
      <header
        ref={headerRef}
        className="sticky top-0 z-40 border-b border-[#eadfe1] bg-[#fbfaf8]/95 backdrop-blur"
      >
        <div className="relative mx-auto flex h-[88px] w-full max-w-[1380px] items-center gap-3 px-4 md:px-8">
          <Link href="/" className="shrink-0" aria-label="На главную">
            <img
              src="/img/logo_new_horizontal_burgundy.png"
              alt="Логотип Половинка успеха"
              className="h-[58px] w-auto object-contain md:h-[66px]"
            />
          </Link>

          <Link
            href="/"
            className="ml-1 hidden items-center gap-2 rounded-xl border border-[#9d6370] px-4 py-2.5 text-sm font-semibold text-[#6b1f2a] transition hover:bg-[#f7eef0] sm:flex"
            aria-label="Выбрать другой город"
          >
            <FontAwesomeIcon icon={faLocationDot} className="h-4 w-4" />
            <span>{cityName}</span>
          </Link>

          <button
            type="button"
            className="ml-auto flex h-11 w-11 cursor-pointer flex-col items-center justify-center gap-1 rounded-full border border-[#c9a8af] bg-white transition hover:bg-[#f7eef0] lg:hidden"
            aria-label="Открыть меню"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="block h-[2px] w-5 rounded-full bg-[#6b1f2a]" />
            <span className="block h-[2px] w-5 rounded-full bg-[#6b1f2a]" />
            <span className="block h-[2px] w-5 rounded-full bg-[#6b1f2a]" />
          </button>

          <nav
            className={`ml-auto ${
              menuOpen ? 'flex' : 'hidden'
            } absolute left-4 right-4 top-[78px] z-50 flex-col items-stretch gap-1 rounded-2xl border border-[#eadfe1] bg-white p-4 shadow-2xl transition duration-200 lg:static lg:flex lg:flex-row lg:items-center lg:gap-5 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="whitespace-nowrap rounded-lg px-3 py-2 text-center text-sm font-semibold text-[#5a1723] transition hover:bg-[#f7eef0]"
                onClick={(event) => {
                  event.preventDefault()
                  setMenuOpen(false)
                  scrollToSection(item.id)
                }}
              >
                {item.label}
              </a>
            ))}
            {spacesNavItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="whitespace-nowrap rounded-lg px-3 py-2 text-center text-sm font-semibold text-[#5a1723] transition hover:bg-[#f7eef0]"
                onClick={(event) => {
                  event.preventDefault()
                  setMenuOpen(false)
                  scrollToSection(item.id)
                }}
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              className="rounded-xl border border-[#8b4b59] bg-white px-6 py-3 text-center text-sm font-semibold text-[#5a1723] transition hover:bg-[#6b1f2a] hover:text-white"
              onClick={() => {
                setMenuOpen(false)
                navigateWithLoading(
                  `/${defaultLocation}/login`,
                  'Открываем страницу авторизации'
                )
              }}
              disabled={Boolean(openingMessage)}
            >
              Войти
            </button>
          </nav>
        </div>
      </header>
      <button
        type="button"
        className={`cursor-pointer fixed inset-0 z-20 bg-black/40 transition lg:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      />

      <main>
        <section className="mx-auto w-full max-w-[1380px] px-4 pb-12 pt-8 md:px-8 md:pb-16 md:pt-10">
          <div className="grid overflow-hidden rounded-[28px] bg-[#681724] shadow-[0_18px_50px_rgba(73,17,28,0.14)] lg:grid-cols-[minmax(430px,0.86fr)_minmax(0,1.14fr)]">
            <div className="min-w-0 flex flex-col justify-center px-6 py-9 text-white sm:px-10 sm:py-12 lg:min-h-[430px] lg:px-12 lg:py-14 xl:px-14">
              <h1 className="max-w-[560px] font-lora text-[clamp(38px,4vw,58px)] leading-[1.08] text-white">
                <span className="block">Живые встречи</span>
                <span className="block">и новые связи</span>
                <span className="block">в {cityNamePrepositional}</span>
              </h1>
              <p className="mt-6 max-w-[470px] text-[15px] leading-relaxed text-white/80 sm:text-base">
                Тёплые офлайн-события для взрослых людей, которым важно
                настоящее общение.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="min-h-12 rounded-2xl bg-[#72c5f2] px-6 py-3 text-sm font-bold text-[#681724] shadow-[0_10px_24px_rgba(79,176,232,0.18)] transition hover:-translate-y-0.5 hover:bg-[#63bdec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  onClick={() => scrollToSection('announcements')}
                >
                  Ближайшие мероприятия
                </button>
                <button
                  type="button"
                  className="min-h-12 rounded-2xl border border-white/50 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  onClick={() => scrollToSection('about')}
                >
                  Как всё проходит
                </button>
              </div>
            </div>
            <div className="min-w-0 bg-[#eadfe1]">
              <HeroImageSlider />
            </div>
          </div>
        </section>

        <section
          id="announcements"
          className="mx-auto w-full max-w-[1380px] scroll-mt-24 px-4 pb-14 md:px-8 md:pb-20"
        >
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-lora text-[clamp(32px,4vw,48px)] leading-tight text-[#681724]">
              Ближайшие встречи в {cityNamePrepositional}
            </h2>
            <Link
              href={`/${defaultLocation}/events`}
              className="text-sm font-semibold text-[#681724] underline decoration-[#681724]/30 underline-offset-4 transition hover:decoration-[#681724]"
            >
              Смотреть все события
            </Link>
          </div>

          {featuredEvents.length > 0 ? (
            <div className="border-y border-[#dfd0d4]">
              {featuredEvents.map((event) => {
                const participants = participantsByEventId.get(event.id) ?? 0
                const placesLeft = event.maxParticipants
                  ? Math.max(0, event.maxParticipants - participants)
                  : null
                const endTime =
                  event.dateEnd instanceof Date &&
                  !Number.isNaN(event.dateEnd.getTime())
                    ? event.dateEnd.toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : null

                return (
                  <article
                    key={event.id}
                    className="grid gap-4 border-b border-[#dfd0d4] py-6 last:border-b-0 lg:grid-cols-[90px_150px_minmax(220px,1.25fr)_minmax(190px,0.9fr)_110px_120px_130px] lg:items-center"
                  >
                    <div className="flex items-baseline gap-2 lg:block">
                      <div className="text-4xl font-bold leading-none text-[#681724]">
                        {event.dateStart.getDate()}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-[#681724]">
                        {MONTHS_FULL[event.dateStart.getMonth()]}
                      </div>
                      <div className="text-xs text-[#76666a] lg:mt-1">
                        {event.dateStart.toLocaleDateString('ru-RU', {
                          weekday: 'long',
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="text-lg font-semibold text-[#342c2e]">
                        {event.dateStart.toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {endTime ? ` – ${endTime}` : ''}
                      </div>
                      <div className="mt-1 text-xs text-[#76666a]">
                        Приходите за 15 минут
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-[#681724]">
                        {event.title}
                      </h3>
                      {event.description ? (
                        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[#76666a]">
                          {event.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex gap-2 text-sm text-[#342c2e]">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#8b2435]"
                      />
                      <span>{event.place}</span>
                    </div>

                    <div>
                      <div className="text-lg font-semibold text-[#342c2e]">
                        {event.priceInKopecks === null
                          ? 'Уточняется'
                          : event.priceInKopecks === 0
                            ? 'Бесплатно'
                            : `от ${(event.priceInKopecks / 100).toLocaleString(
                                'ru-RU'
                              )} ₽`}
                      </div>
                      <div className="text-xs text-[#76666a]">за участие</div>
                    </div>

                    <div>
                      <div className="text-base font-semibold text-[#342c2e]">
                        {eventsUsersLoading
                          ? 'Считаем места'
                          : placesLeft === null
                            ? `${participants} записано`
                            : `${placesLeft} из ${event.maxParticipants}`}
                      </div>
                      <div className="text-xs text-[#76666a]">
                        {placesLeft === null ? 'участников' : 'мест осталось'}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="min-h-12 rounded-xl bg-[#861728] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#681724] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#681724]"
                      onClick={() =>
                        navigateWithLoading(
                          `/${defaultLocation}/event/${event.id}`,
                          'Открываем мероприятие'
                        )
                      }
                      disabled={Boolean(openingMessage)}
                    >
                      Подробнее
                    </button>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#dfd0d4] bg-white px-6 py-8 text-[#5c484d]">
              Новые встречи уже готовятся. Оставьте заявку, и команда сообщит о
              ближайшем событии.
            </div>
          )}

          <div className="mt-7 flex flex-col items-center gap-3 text-center">
            <button
              type="button"
              data-testid="calendar-scroll-button"
              className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-[#861728] px-7 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(107,31,42,0.2)] transition hover:-translate-y-0.5 hover:bg-[#681724] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#681724]"
              onClick={() => scrollToSection('calendar')}
            >
              <FontAwesomeIcon
                icon={faCalendarDays}
                className="shrink-0 text-xl"
              />
              Смотреть календарь мероприятий
            </button>
            <p className="text-sm text-[#765e64]">
              Все встречи проходят офлайн, в безопасной и уважительной
              атмосфере.
            </p>
          </div>
        </section>

        <Section id="about" title="О нашем пространстве">
          <div className="grid gap-6 lg:grid-cols-2">
            {aboutCards.map((card, index) => (
              <AboutSpaceCard
                key={card.id ?? `${card.title}-${index}`}
                card={card}
                showButtons={false}
                reveal
              />
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-[22px] text-[#4b0f1c]">
              <strong>ПРОСТРАНСТВО В ЦИФРАХ:</strong>
            </h3>
            <div className="grid gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
              {spaceStats.map((stat, index) => (
                <SpaceStatsCard
                  key={stat.id ?? `${stat.number}-${index}`}
                  stat={stat}
                  showButtons={false}
                  reveal
                />
              ))}
            </div>
          </div>
          {founderProfile.showOnSite && founderProfile.hasContent ? (
            <div
              className="mt-6 rounded-3xl bg-white p-6 shadow-[0_20px_45px_rgba(0,0,0,0.08)]"
              data-reveal
            >
              <div className="mb-4 inline-flex items-center rounded-full bg-white/80 px-4 py-1 text-sm font-semibold uppercase tracking-[0.08em] text-[#6b1f2a]">
                Основатель проекта
              </div>
              <div className="grid gap-6 lg:grid-cols-[minmax(0,180px)_minmax(0,1fr)] lg:items-center">
                {founderProfile.photo ? (
                  <img
                    src={founderProfile.photo}
                    alt={founderProfile.name || 'Основатель проекта'}
                    className="w-full max-w-[220px] rounded-[20px] justify-self-center object-contain"
                  />
                ) : null}
                <div className="relative rounded-2xl border border-[#f0e2e8] bg-[#fff8fa] px-6 py-5 shadow-[0_10px_24px_rgba(107,31,42,0.08)]">
                  <SvgKavichki className="absolute -bottom-2 left-2 h-6 w-6 fill-[#6b1f2a] opacity-25" />
                  <SvgKavichki className="absolute -top-2 right-2 h-6 w-6 rotate-180 fill-[#6b1f2a] opacity-25" />
                  <p className="text-[18px] leading-relaxed text-[#3a2c33] whitespace-pre-line">
                    <strong>{founderProfile.name}</strong>
                    {founderProfile.quote ? ` — ${founderProfile.quote}` : ''}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
          {supervisorProfile.showOnSite && supervisorProfile.hasContent ? (
            <div
              className="mt-6 overflow-hidden rounded-3xl border border-[rgba(107,31,42,0.16)] bg-[linear-gradient(140deg,rgba(79,176,232,0.12),rgba(111,29,43,0.06))] p-6 shadow-[0_20px_45px_rgba(0,0,0,0.08)]"
              data-reveal
            >
              <div className="mb-4 inline-flex items-center rounded-full bg-white/80 px-4 py-1 text-sm font-semibold uppercase tracking-[0.08em] text-[#6b1f2a]">
                Руководитель региона
              </div>
              <div className="grid gap-6 lg:grid-cols-[minmax(0,190px)_minmax(0,1fr)] lg:items-center">
                {supervisorProfile.photo ? (
                  <img
                    src={supervisorProfile.photo}
                    alt={supervisorProfile.name || 'Руководитель региона'}
                    className="w-full max-w-[230px] justify-self-center rounded-[20px] border border-white/70 bg-white object-cover shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
                  />
                ) : null}
                <div>
                  {supervisorProfile.name ? (
                    <h3 className="text-[22px] font-bold text-[#4b0f1c]">
                      {supervisorProfile.name}
                    </h3>
                  ) : null}
                  {supervisorProfile.quote ? (
                    <div className="relative mt-3 rounded-2xl border border-[#f0e2e8] bg-white/75 px-6 py-5 shadow-[0_10px_24px_rgba(107,31,42,0.08)]">
                      <SvgKavichki className="absolute -bottom-2 left-2 h-6 w-6 fill-[#6b1f2a] opacity-25" />
                      <SvgKavichki className="absolute -top-2 right-2 h-6 w-6 rotate-180 fill-[#6b1f2a] opacity-25" />
                      <p className="text-[18px] leading-relaxed text-[#3a2c33] whitespace-pre-line">
                        {supervisorProfile.quote}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
          <div className="flex justify-center px-[6vw] pt-20">
            <AuthorizeButton
              onClick={() =>
                navigateWithLoading(
                  `/${defaultLocation}/register`,
                  'Открываем остраницу регистрации'
                )
              }
              disabled={Boolean(openingMessage)}
            />
          </div>
        </Section>

        <Section id="spaces" title="Наши пространства">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {spacesFromDirections.map((space) => (
              <DirectionCardView
                key={space.id}
                direction={{
                  ...space,
                  shortDescription: space.description,
                }}
                onMore={() => {
                  if (
                    closedSpaceDirectionId &&
                    String(space.id) === String(closedSpaceDirectionId)
                  ) {
                    scrollToSection('closed')
                    return
                  }
                  setActiveSpace(space)
                }}
                reveal
              />
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <AuthorizeButton
              onClick={() =>
                navigateWithLoading(
                  `/${defaultLocation}/register`,
                  'Открываем страницу регистрации'
                )
              }
              disabled={Boolean(openingMessage)}
            />
          </div>
        </Section>

        {activeSpace ? (
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 px-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setActiveSpace(null)
            }}
          >
            <div
              onMouseDown={(event) => event.stopPropagation()}
              className="flex flex-col relative max-h-[85vh] w-full max-w-[820px] overflow-hidden rounded-[30px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.28)]"
            >
              <button
                type="button"
                aria-label="Закрыть"
                onClick={() => setActiveSpace(null)}
                className="cursor-pointer absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#f0e5ea] bg-white text-[#6b1f2a] transition hover:bg-[#f8f2f4]"
              >
                ×
              </button>
              <div className="h-50 tablet:h-56">
                {activeSpace.images?.length > 0 ? (
                  <ImagesMarquee
                    images={activeSpace.images}
                    heightClassName="h-50 tablet:h-56"
                    durationSec={30}
                  />
                ) : null}
              </div>
              <div className="flex flex-col max-h-[calc(85vh-225px)]  p-6">
                <h3 className="text-xl font-semibold text-[#4b0f1c]">
                  {activeSpace.title}
                </h3>
                <NoOrphanText
                  as="div"
                  className="mt-3 min-h-0 overflow-y-auto text-[16px] leading-relaxed text-[#3a2c33] whitespace-pre-line"
                  html={DOMPurify.sanitize(
                    activeSpace.fullDescription || activeSpace.description || ''
                  )}
                />
              </div>
            </div>
          </div>
        ) : null}

        {/* <Section id="services" title="Пространство товаров">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard
                key={`${service.title ?? 'service'}-${index}`}
                service={service}
                style={{ transitionDelay: `${index * 80}ms` }}
              />
            ))}
          </div>         
        </Section> */}

        {index2AdditionalBlocks.map((block) => (
          <AdditionalBlockSection key={block._id} block={block} />
        ))}

        {closedSpaceDirection ? (
          <Section id="closed" title="Закрытое пространство">
            <div
              className="relative overflow-hidden rounded-[26px] bg-[linear-gradient(140deg,rgba(79,176,232,0.2),rgba(111,29,43,0.08))] p-8 leading-relaxed"
              data-reveal
            >
              <img
                src="/key.png"
                alt=""
                className="pointer-events-none h-36 bottom-20 right-5 phoneH:right-3 phoneH:h-[calc(100%-8rem)] phoneH:bottom-5 tablet:bottom-auto absolute phoneH:right-5 rotate-15 tablet:top-10 tablet:right-8 tablet:h-[calc(100%-5rem)] w-auto object-contain opacity-40"
              />
              <h3 className="text-[22px] text-[#6b1f2a]">
                {closedSpaceSubtitle}
              </h3>
              <p className="pr-10 mt-3 whitespace-pre-line tablet:pr-13">
                {closedSpaceDescription}
              </p>
              <button
                type="button"
                onClick={() => setActiveSpace(closedSpaceDirection)}
                className="mt-4 inline-flex rounded-full bg-[#4fb0e8] px-6 py-2 text-white"
              >
                Подробнее
              </button>
            </div>
          </Section>
        ) : null}

        <Section id="calendar" title="Календарь мероприятий">
          <div className="grid gap-6 lg:grid-cols-2">
            <div
              className="rounded-2xl bg-white p-6 shadow-[0_16px_30px_rgba(0,0,0,0.08)]"
              data-reveal
            >
              <div className="mb-4 flex items-center justify-between font-semibold text-[#6b1f2a]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isPrevMonthDisabled}
                    onClick={handlePrevMonth}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                      isPrevMonthDisabled
                        ? 'cursor-not-allowed border-[#d6d9de] text-[#b8bcc4]'
                        : 'cursor-pointer border-[rgba(107,31,42,0.22)] text-[#6b1f2a] hover:bg-[#6b1f2a] hover:text-white'
                    }`}
                    aria-label="Предыдущий месяц"
                  >
                    {'<'}
                  </button>
                  <span>{monthLabel}</span>
                  <button
                    type="button"
                    disabled={isNextMonthDisabled}
                    onClick={handleNextMonth}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                      isNextMonthDisabled
                        ? 'cursor-not-allowed border-[#d6d9de] text-[#b8bcc4]'
                        : 'cursor-pointer border-[rgba(107,31,42,0.22)] text-[#6b1f2a] hover:bg-[#6b1f2a] hover:text-white'
                    }`}
                    aria-label="Следующий месяц"
                  >
                    {'>'}
                  </button>
                </div>
                <span className="text-[14px] text-[#1f6e9c]">
                  Активные даты выделены
                </span>
              </div>
              <div className="grid grid-cols-7 gap-2 mb-2">
                {WEEKDAY_LABELS.map((label) => (
                  <div
                    key={label}
                    className="rounded-[10px] bg-[#f1f2f4] px-0 py-2 text-center text-[12px] font-semibold text-[#6b1f2a]"
                  >
                    {label}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => {
                  if (!day) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="rounded-[10px] border border-transparent px-0 py-2 text-[14px]"
                      />
                    )
                  }
                  const isActive = activeDays.includes(day)
                  const isSelected = activeDay === day
                  return (
                    <button
                      key={`${day}-${index}`}
                      type="button"
                      className={`rounded-[10px] border px-0 py-2 text-[14px] ${
                        isSelected
                          ? 'border-transparent bg-[#6b1f2a] text-white'
                          : isActive
                            ? 'border-[rgba(79,176,232,0.5)] bg-[rgba(79,176,232,0.2)] text-[#245c7b] cursor-pointer'
                            : 'border-transparent bg-[#f1f2f4] text-[#555]'
                      }`}
                      onClick={() => isActive && setActiveDay(day)}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>

            <div
              className="rounded-2xl bg-white p-6 shadow-[0_16px_30px_rgba(0,0,0,0.08)]"
              data-reveal
            >
              <h3 className="font-bold text-lg text-[#6b1f2a]">
                {activeDay
                  ? `События на ${activeDay} ${monthName}`
                  : 'Выберите активную дату'}
              </h3>
              {eventsForDay.length === 0 ? (
                <p className="mt-2 text-[#666]">
                  На выбранную дату нет мероприятий. Выберите активную дату.
                </p>
              ) : (
                <div className="grid gap-3 mt-2">
                  {eventsForDay.map((event) => (
                    <div
                      key={event.id ?? event.title}
                      className="rounded-2xl border border-[rgba(107,31,42,0.2)] bg-[linear-gradient(135deg,rgba(107,31,42,0.08),rgba(141,207,242,0.18))] p-4 shadow-[0_12px_26px_rgba(0,0,0,0.08)]"
                    >
                      <div className="font-semibold text-[#4b0f1c] whitespace-pre-line">
                        {event.title}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-[#2f586f]">
                        <span>{event.time}</span>
                        <span className="text-right">{event.place}</span>
                      </div>
                      <div className="flex gap-x-1 flex-wrap mt-3 items-center rounded-full bg-white/70 px-3 py-1 text-sm font-semibold text-[#6b1f2a]">
                        {event.maxParticipants ? (
                          eventsUsersLoading ? (
                            <span>{'Свободно мест:'}</span>
                          ) : (
                            <>
                              <span>{`Свободно мест:`}</span>
                              <span>{`${Math.max(
                                0,
                                (event.maxParticipants ?? 0) -
                                  (participantsByEventId.get(event.id) ?? 0)
                              )} из ${event.maxParticipants}`}</span>
                            </>
                          )
                        ) : (
                          <span>{`Мест неограничено · Записано ${
                            participantsByEventId.get(event.id) ?? 0
                          }`}</span>
                        )}
                        {event.maxParticipants && eventsUsersLoading ? (
                          <span className="ml-2 inline-block h-4 w-14 animate-pulse rounded bg-[#6b1f2a]/20" />
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center px-[6vw] pt-20">
            <AuthorizeButton
              onClick={() =>
                navigateWithLoading(
                  `/${defaultLocation}/register`,
                  'Открываем остраницу регистрации'
                )
              }
              disabled={Boolean(openingMessage)}
            />
          </div>
        </Section>

        <Section id="reviews" title="Отзывы о нас">
          <div className="relative" data-reveal>
            <div
              ref={reviewsContainerRef}
              className="flex gap-4 overflow-hidden scroll-smooth"
            >
              {visibleReviews.map((review) => (
                <div
                  key={review.id ?? review.name}
                  className="shrink-0 rounded-2xl bg-white p-5 shadow-[0_14px_28px_rgba(0,0,0,0.08)]"
                  style={{
                    width: `calc((100% - ${reviewsGapPx * (reviewsPerView - 1)}px) / ${reviewsPerView})`,
                  }}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-x-3">
                      <img
                        src={review.photo || '/img/users/null.jpg'}
                        alt={review.name}
                        className="h-16 w-16 rounded-full border-2 border-[#4fb0e8] object-cover"
                      />
                      <span className="block font-semibold text-[#4b0f1c]">
                        {review.name}
                        {review.age ? `, ${getNounYears(review.age)}` : ''}
                      </span>
                    </div>
                    <div>
                      <p
                        ref={(el) => {
                          if (!el) {
                            reviewTextRefs.current.delete(
                              review.id ?? review.name
                            )
                            return
                          }
                          reviewTextRefs.current.set(
                            review.id ?? review.name,
                            el
                          )
                        }}
                        className="leading-relaxed whitespace-pre-line line-clamp-10"
                      >
                        {review.text}
                      </p>
                      {reviewOverflowMap[review.id ?? review.name] ? (
                        <div className="mt-2">
                          <span className="block text-sm text-[#6b1f2a]">
                            ...
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveReview(review)}
                            className="cursor-pointer mt-2 text-sm font-semibold text-[#6b1f2a] underline decoration-[#6b1f2a]/40 underline-offset-4 transition hover:text-[#4b0f1c]"
                          >
                            Прочитать далее
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              aria-label="Следующий отзыв"
              onClick={handleReviewsNext}
              className="cursor-pointer font-bold pb-1.25 text-3xl absolute right-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#4fb0e8] text-white shadow-[0_12px_24px_rgba(79,176,232,0.35)] transition hover:-translate-y-[calc(50%+2px)]"
            >
              →
            </button>
          </div>
        </Section>

        {activeReview ? (
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 px-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setActiveReview(null)
            }}
          >
            <div
              onMouseDown={(event) => event.stopPropagation()}
              className="relative max-h-[85vh] w-full max-w-[640px] overflow-hidden rounded-[28px] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
            >
              <button
                type="button"
                aria-label="Закрыть"
                onClick={() => setActiveReview(null)}
                className="cursor-pointer absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#f0e5ea] text-[#6b1f2a] transition hover:bg-[#f8f2f4]"
              >
                ×
              </button>
              <div className="flex items-center gap-4">
                <img
                  src={activeReview.photo || '/img/users/null.jpg'}
                  alt={activeReview.name}
                  className="h-14 w-14 rounded-full border-2 border-[#8dcff2] object-cover"
                />
                <div>
                  <div className="text-lg font-semibold text-[#4b0f1c]">
                    {activeReview.name}
                    {activeReview.age
                      ? `, ${getNounYears(activeReview.age)}`
                      : ''}
                  </div>
                </div>
                {/* <button
                  type="button"
                  onClick={() => setActiveReview(null)}
                  className="ml-auto rounded-full border border-[#f0e5ea] px-3 py-1 text-sm font-semibold text-[#6b1f2a] transition hover:bg-[#f8f2f4]"
                >
                  Закрыть
                </button> */}
              </div>
              <div className="mt-4 max-h-[65vh] overflow-y-auto pr-1 text-sm leading-relaxed text-[#3a2c33] whitespace-pre-line">
                {activeReview.text}
              </div>
            </div>
          </div>
        ) : null}

        <Section id="contacts" title="Наши контакты и соц. сети">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <div
              className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#7a2a3a,rgba(141,207,242,0.55))] p-7 text-white shadow-[0_20px_36px_rgba(107,31,42,0.25)]"
              data-reveal
            >
              <div className="absolute w-32 h-32 rounded-full pointer-events-none -right-10 top-6 bg-white/20 blur-2xl" />
              <div className="absolute w-24 h-24 rounded-full pointer-events-none -bottom-10 left-10 bg-white/10 blur-2xl" />
              <h3 className="text-xl font-semibold">
                Свяжитесь с нами в Вашем городе
              </h3>
              <p className="mt-2 text-sm text-white/80">
                Подскажем формат, ответим на вопросы и поможем выбрать событие
              </p>
              <div className="grid gap-3 mt-6">
                {contactsData.primary.length > 0 ? (
                  contactsData.primary.map((item) => {
                    const content = (
                      <>
                        <span className="flex items-center justify-center w-10 h-10 text-sm font-semibold rounded-full bg-white/20">
                          {item.label.slice(0, 2).toUpperCase()}
                        </span>
                        <div className="flex-1">
                          <div className="text-xs uppercase tracking-[0.2em] text-white/70">
                            {item.label}
                          </div>
                          <div className="text-base font-semibold">
                            {item.value}
                          </div>
                        </div>
                      </>
                    )

                    return item.href ? (
                      <a
                        key={`${item.label}-${item.value}`}
                        href={item.href}
                        className="flex items-center gap-4 rounded-2xl border border-white/25 bg-white/10 px-4 py-3 transition hover:-translate-y-0.5 hover:bg-white/15"
                      >
                        {content}
                      </a>
                    ) : (
                      <div
                        key={`${item.label}-${item.value}`}
                        className="flex items-center gap-4 px-4 py-3 border rounded-2xl border-white/25 bg-white/10"
                      >
                        {content}
                      </div>
                    )
                  })
                ) : (
                  <div className="px-4 py-3 text-sm border rounded-2xl border-white/30 bg-white/10 text-white/80">
                    Мы готовим контакты для связи. Загляните чуть позже.
                  </div>
                )}
              </div>
            </div>

            <div
              className="rounded-[28px] border border-white/70 bg-white/85 p-7 shadow-[0_16px_32px_rgba(107,31,42,0.12)] backdrop-blur"
              data-reveal
            >
              <h3 className="text-xl font-semibold text-[#6b1f2a]">
                Соцсети и мессенджеры
              </h3>
              <p className="mt-2 text-sm text-[#3a2c33]/70">
                Пишите в удобном канале, мы быстро отвечаем.
              </p>
              <div className="grid gap-3 mt-5 sm:grid-cols-2">
                {contactsData.socials.length > 0 ? (
                  contactsData.socials.map((item) => (
                    <a
                      key={`${item.label}-${item.value}`}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-2xl border border-[#f0e5ea] bg-white px-4 py-3 shadow-[0_10px_22px_rgba(107,31,42,0.1)] transition hover:-translate-y-0.5"
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${item.tone}`}
                      >
                        {item.badge}
                      </span>
                      <div className="flex-1">
                        <div className="text-[11px] uppercase tracking-[0.2em] text-[#6b1f2a]/70">
                          {item.label}
                        </div>
                        <div className="text-sm font-semibold text-[#2b1b21]">
                          {item.value}
                        </div>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="rounded-2xl border border-[#f0e5ea] bg-white px-4 py-3 text-sm text-[#6b1f2a]">
                    Контакты появятся после обновления настроек.
                  </div>
                )}
              </div>
            </div>
          </div>
        </Section>
      </main>
      {openingMessage ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 px-4">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-[#4b0f1c] shadow-[0_24px_60px_rgba(0,0,0,0.25)]">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#8dcff2] border-t-[#6b1f2a]" />
            <span className="text-sm font-semibold">{openingMessage}</span>
          </div>
        </div>
      ) : null}
      <style jsx global>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(16px);
          transition:
            opacity 0.6s ease,
            transform 0.6s ease;
        }
        .reveal-in {
          opacity: 1;
          transform: translateY(0);
        }
        .line-clamp-10 {
          display: -webkit-box;
          -webkit-line-clamp: 10;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .about-card-content p + p {
          margin-top: 0.75rem;
        }
        .about-card-content ul {
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 0.6rem;
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  )
}

function Section({ id, title, children }) {
  return (
    <section
      id={id}
      className="px-[6vw] py-[70px] even:bg-[linear-gradient(140deg,rgba(79,176,232,0.12),rgba(111,29,43,0.06))]"
    >
      <div className="mb-8">
        <h2 className="font-lora text-[clamp(26px,3vw,38px)] font-bold text-[#6b1f2a]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

Section.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

function ServiceCard({ service, style }) {
  const tileStyle = service?.color
    ? ADDITIONAL_BLOCK_TILE_COLORS.find(
        (option) => option.value === service.color
      )
    : null
  const isCustomColor =
    typeof service?.color === 'string' &&
    service.color.startsWith('#') &&
    !tileStyle

  return (
    <div
      className={`rounded-2xl p-6 shadow-[0_16px_30px_rgba(0,0,0,0.08)] ${
        tileStyle
          ? tileStyle.bgClassName
          : service.accent
            ? 'bg-[linear-gradient(140deg,#6b1f2a,#8e2f3a)] text-white'
            : 'bg-white'
      }`}
      style={isCustomColor ? { backgroundColor: service.color } : undefined}
      data-reveal
      {...(style ? { style } : {})}
    >
      <div className="flex items-center gap-x-2">
        {service.image ? (
          <img
            src={service.image}
            alt=""
            className="object-cover w-12 h-12 rounded-full"
          />
        ) : null}
        <h3
          className={`flex-1 text-center text-[18px] ${
            tileStyle?.titleClassName ?? (isCustomColor ? 'text-white' : '')
          }`}
        >
          {service.title}
        </h3>
      </div>
      <NoOrphanText
        as="p"
        className={`mt-2 ${
          tileStyle?.descriptionClassName ??
          (isCustomColor ? 'text-white/90' : '')
        }`}
        text={service.description}
      />
    </div>
  )
}

ServiceCard.propTypes = {
  service: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    accent: PropTypes.bool,
    image: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
  style: PropTypes.object,
}

function AdditionalBlockSection({ block }) {
  return (
    <section className="px-[6vw] py-[70px] even:bg-[linear-gradient(140deg,rgba(79,176,232,0.12),rgba(111,29,43,0.06))]">
      <AdditionalBlockCardContent block={block} showButtons={false} reveal />
    </section>
  )
}

AdditionalBlockSection.propTypes = {
  block: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    tiles: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        image: PropTypes.string,
        color: PropTypes.string,
      })
    ),
  }).isRequired,
}

LocationIndexClient.propTypes = {
  location: PropTypes.string,
  initialDirections: PropTypes.arrayOf(PropTypes.object),
  initialSiteSettings: PropTypes.object,
  initialGlobalAboutSpaceCards: PropTypes.arrayOf(PropTypes.object),
}

LocationIndexClient.defaultProps = {
  initialDirections: [],
  initialSiteSettings: {},
  initialGlobalAboutSpaceCards: [],
}
