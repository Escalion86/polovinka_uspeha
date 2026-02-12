'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import {
  ADDITIONAL_BLOCK_TILE_COLORS,
  LOCATIONS,
  LOCATIONS_KEYS_VISIBLE,
} from '@helpers/constants'
import AboutSpaceCard from '@layouts/cards/AboutSpaceCard'
import { AdditionalBlockCardContent } from '@layouts/cards/AdditionalBlockCard'
import { DirectionCardView } from '@layouts/cards/DirectionCard'
import SpaceStatsCard from '@layouts/cards/SpaceStatsCard'
import { getNounYears } from '@helpers/getNoun'
import NoOrphanText from '@components/NoOrphanText'
import {
  fetchingAdditionalBlocks,
  fetchingDirections,
  fetchingEvents,
  fetchingEventsUsers,
  fetchingReviews,
  fetchingSiteSettings,
} from '@helpers/fetchers'
import subEventsSummator from '@helpers/subEventsSummator'
import DOMPurify from 'isomorphic-dompurify'

const heroImages = [
  '/img/general/1.jpg',
  '/img/general/2.jpg',
  '/img/general/3.jpg',
  '/img/general/4.jpg',
  '/img/general/5.jpg',
  '/img/general/6.jpg',
  '/img/general/7.jpg',
  '/img/general/8.jpg',
  '/img/general/9.jpg',
  '/img/general/10.jpg',
]

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

const DEFAULT_ABOUT_CARDS = [
  {
    id: 'about-1',
    tone: 'white',
    wide: true,
    title: '',
    text: `<p>Каждый день похож на предыдущий: работа, заботы, спорт, домашние дела, дети, редкие встречи с друзьями. Жизнь вроде идёт, но чего-то не хватает тепла, спонтанности, человеческого контакта. Тебе хочется просто расслабиться и побыть среди «своих» самим собой, где не нужно играть роли и подбирать слова?</p><p><strong>ПРОСТРАНСТВО ЖИВЫХ ВСТРЕЧ «ПОЛОВИНКА УСПЕХА»</strong> — это пространство лёгкости и живого общения.</p>`,
  },
  {
    id: 'about-2',
    tone: 'burgundy',
    wide: false,
    title: 'УЖЕ БОЛЕЕ ЧЕТЫРЕХ ЛЕТ МЫ СОЗДАЁМ АТМОСФЕРУ, ГДЕ МОЖНО:',
    text: `<ul><li>просто быть самим собой</li><li>отдыхать от суеты и дел</li><li>наслаждаться общением</li><li>открывать для себя новых людей естественно, без ожиданий и масок</li><li>встретить свою вторую половинку</li><li>обрести новых друзей и единомышленников в своих увлечениях</li><li>расширить круг деловых связей и партнеров</li><li>научиться чему-то новому и получить новый опыт и эмоции</li><li>весело провести время и просто потусоваться с такими же людьми, как ты</li></ul>`,
  },
  {
    id: 'about-3',
    tone: 'blue',
    wide: false,
    title: 'НАШЕ ПРОСТРАНСТВО, ДЛЯ:',
    text: `<ul><li>активных и современных людей, которым хочется больше жизни, эмоций и близкого общения без формальностей и натянутости</li><li>тех, кто устал от шаблонных встреч и бесконечных экранов телефона и телевизора</li><li>тех, кто хочет настоящих впечатлений, лёгкости и искренних связей</li></ul>`,
  },
  {
    id: 'about-4',
    tone: 'white',
    wide: true,
    title: 'Что такое ПРОСТРАНСТВО «ПОЛОВИНКА УСПЕХА»?',
    text: `<p>Это пространство живых встреч - вечера, выезды, мастер-классы, игры, прогулки, автоквесты, путешествия. Мы объединяем людей, которые хотят проводить время интересно и по-настоящему: улыбаться, смеяться, открываться, вдохновляться, учиться новому и наполняться энергией общения. Здесь нет цели «кого-то найти», зато часто случаются новые дружбы, тёплые связи и даже истории, с которых начинается что-то большее.</p>`,
  },
  {
    id: 'about-5',
    tone: 'burgundy',
    wide: false,
    title: 'Что получает участник нашего ПРОСТРАНСТВА:',
    text: `<ul><li>атмосферу лёгкости, принятия и живого интереса</li><li>ощущение сопричастности и «своей стаи»</li><li>новые впечатления, вдохновение и энергию жизни</li><li>возможность раскрыться, почувствовать себя естественно и уверенно</li><li>расширение круга общения - органично, без давления и формальностей</li></ul>`,
  },
  {
    id: 'about-6',
    tone: 'blue',
    wide: false,
    title: 'ПОЧЕМУ ЛЮДИ ПРИХОДЯТ В НАШЕ ПРОСТРАНСТВО:',
    text: `<ul><li><strong>Сбалансированные форматы:</strong> мероприятия под настроение от камерных игр до выездов на природу</li><li><strong>Тонкая модерация:</strong> ведущие создают атмосферу вовлечённости и лёгкости, помогая каждому раскрыться</li><li><strong>Аудитория по ценностям:</strong> здесь собираются люди, близкие по взглядам, стилю жизни и внутренней культуре</li><li><strong>Удобное участие:</strong> всё просто - выбрать событие, зарегистрироваться, прийти и быть собой</li></ul>`,
  },
  {
    id: 'about-7',
    tone: 'white',
    wide: true,
    title: 'КОГДА ЛЮДИ ПРИХОДЯТ В НАШЕ ПРОСТРАНСТВО:',
    text: `<ul><li>Когда хочется добавить в жизнь лёгкости, новых эмоций и спонтанных встреч</li><li>Когда наступает момент «я всё делаю правильно, но хочу чувствовать больше»</li><li>Когда появляется желание жить ярче — не меняя всё вокруг, а просто меняя пространство, в котором ты общаешься</li></ul>`,
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

const navItems = [
  { id: 'about', label: 'О нас' },
  { id: 'announcements', label: 'Анонс мероприятий' },
  { id: 'reviews', label: 'Отзывы' },
  { id: 'contacts', label: 'Контакты' },
]

const spacesNavItems = [{ id: 'spaces', label: 'Наши пространства' }]

export default function Index2Page() {
  const [activeDay, setActiveDay] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [events, setEvents] = useState([])
  const [additionalBlocks, setAdditionalBlocks] = useState([])
  const [reviewsData, setReviewsData] = useState([])
  const [directionsData, setDirectionsData] = useState([])
  const [eventsUsers, setEventsUsers] = useState([])
  const [reviewsPerView, setReviewsPerView] = useState(3)
  const defaultLocation = LOCATIONS_KEYS_VISIBLE?.[0] ?? 'krsk'
  const reviewsContainerRef = useRef(null)
  const [reviewsIndex, setReviewsIndex] = useState(0)
  const reviewsGapPx = 16
  const headerRef = useRef(null)
  const [siteSettings, setSiteSettings] = useState({})
  const [activeReview, setActiveReview] = useState(null)
  const [activeSpace, setActiveSpace] = useState(null)
  const reviewTextRefs = useRef(new Map())
  const [reviewOverflowMap, setReviewOverflowMap] = useState({})
  const spaceStats = useMemo(() => {
    const items = siteSettings?.spaceStats
    if (!Array.isArray(items) || items.length === 0) return DEFAULT_STATS
    return [...items].sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
  }, [siteSettings])
  const aboutCards = useMemo(() => {
    const items = siteSettings?.aboutSpaceCards
    if (!Array.isArray(items) || items.length === 0) return DEFAULT_ABOUT_CARDS
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
  }, [siteSettings])

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      const [
        eventsData,
        additionalBlocksData,
        reviewsResponse,
        directions,
        eventsUsersData,
        siteSettingsData,
      ] = await Promise.all([
        fetchingEvents(defaultLocation),
        fetchingAdditionalBlocks(defaultLocation),
        fetchingReviews(defaultLocation),
        fetchingDirections(defaultLocation),
        fetchingEventsUsers(defaultLocation),
        fetchingSiteSettings(defaultLocation),
      ])

      if (isMounted) {
        setEvents(Array.isArray(eventsData) ? eventsData : [])
        setAdditionalBlocks(
          Array.isArray(additionalBlocksData) ? additionalBlocksData : []
        )
        setReviewsData(Array.isArray(reviewsResponse) ? reviewsResponse : [])
        setDirectionsData(Array.isArray(directions) ? directions : [])
        setEventsUsers(Array.isArray(eventsUsersData) ? eventsUsersData : [])
        setSiteSettings(siteSettingsData || {})
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [defaultLocation])

  const spacesFromDirections = useMemo(() => {
    return (directionsData || [])
      .filter((direction) => direction?.showOnSite)
      .sort((a, b) => (a.index < b.index ? -1 : 1))
      .map((direction) => ({
        id: direction._id,
        title: direction.title,
        description: direction.shortDescription || direction.description || '',
        fullDescription: direction.description || '',
        images: Array.isArray(direction.images) ? direction.images : [],
      }))
  }, [directionsData])

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
      telegram && {
        label: 'Telegram',
        value: `@${normalizeHandle(telegram)}`,
        href: `https://t.me/${normalizeHandle(telegram)}`,
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

  const openLocationSelector = () => {
    setMenuOpen(false)
    setShowLocationModal(true)
  }

  const { calendarDays, activeDays, eventsByDay, monthLabel, monthName } =
    useMemo(() => {
      const now = new Date()
      const participantsByEventId = (eventsUsers || []).reduce(
        (acc, eventUser) => {
          if (!eventUser?.eventId || eventUser?.status !== 'participant')
            return acc
          const current = acc.get(eventUser.eventId) ?? 0
          acc.set(eventUser.eventId, current + 1)
          return acc
        },
        new Map()
      )

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
          const participantsCount = participantsByEventId.get(event._id) ?? 0
          const maxParticipants = getEventMaxParticipants(event)
          return {
            ...event,
            dateStart,
            participantsCount,
            maxParticipants,
          }
        })
        .filter(Boolean)

      const upcoming = normalizedEvents
        .filter((event) => event.dateStart >= now)
        .sort((a, b) => a.dateStart - b.dateStart)

      const baseEvent = upcoming[0] ?? normalizedEvents[0]
      const baseDate = baseEvent?.dateStart ?? now
      const month = baseDate.getMonth()
      const year = baseDate.getFullYear()

      const monthEvents = normalizedEvents.filter(
        (event) =>
          event.dateStart.getMonth() === month &&
          event.dateStart.getFullYear() === year
      )

      const daysInMonth = new Date(year, month + 1, 0).getDate()
      const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)
      const locationTownLower = (
        LOCATIONS?.[defaultLocation]?.townRu || ''
      ).toLowerCase()
      const eventsByDayMap = monthEvents.reduce((acc, event) => {
        const day = event.dateStart.getDate()
        const address = event.address || {}
        const addressTownLower = (address.town || '').toLowerCase()
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
          participantsCount: event.participantsCount,
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
        calendarDays: daysArray,
        activeDays: activeDaysList,
        eventsByDay: eventsByDayMap,
        monthLabel: `${MONTHS_FULL_UPPER[month]} ${year}`,
        monthName: MONTHS_FULL[month],
      }
    }, [events, eventsUsers])

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
    <div className="bg-[#f6f3f1] text-[#1d1b1f]">
      <header
        ref={headerRef}
        className="sticky top-0 z-40 border-b border-[rgba(107,31,42,0.15)] bg-white/90 backdrop-blur"
      >
        <div className="relative flex items-center gap-6 px-[4vw] py-2">
          <div className="flex items-center gap-3">
            <img
              src="/img/logo_horizontal.png"
              alt="Логотип Половинка успеха"
              className="h-[92px] w-[160px] min-w-[120px] object-contain"
            />
            {/* <span className="font-adlery text-[18px] tracking-[0.06em] text-[#6b1f2a]">
              ПОЛОВИНКА УСПЕХА
            </span> */}
          </div>

          <button
            type="button"
            className="cursor-pointer transition duration-500 hover:bg-[rgba(107,31,42,0.3)] ml-auto flex h-11 w-11 flex-col items-center justify-center gap-1 rounded-full border border-[rgba(107,31,42,0.3)] bg-white lg:hidden"
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
            } flex-col items-start gap-2 rounded-2xl bg-white p-4 shadow-2xl transition duration-200 absolute top-[72px] left-[5vw] right-[5vw] z-50 lg:static lg:flex lg:flex-row lg:items-center lg:gap-2 lg:bg-transparent lg:p-0 lg:shadow-none lg:rounded-none`}
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="whitespace-nowrap text-center rounded-full px-2.5 py-1.5 text-[12px] uppercase tracking-[0.08em] text-[#4b0f1c] transition hover:bg-[#6b1f2a] hover:text-white duration-500"
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
                className="whitespace-nowrap text-center rounded-full px-2.5 py-1.5 text-[12px] uppercase tracking-[0.08em] text-[#4b0f1c] transition hover:bg-[#6b1f2a] hover:text-white duration-500"
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
              className="text-center rounded-full btn-gradient-hover px-3.5 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-white"
              onClick={openLocationSelector}
            >
              Войти в пространство
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
        {showLocationModal ? (
          <div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-black/45 px-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setShowLocationModal(false)
            }}
          >
            <div
              className="w-full max-w-[560px] rounded-[28px] bg-white p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)]"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="mb-3 text-xl font-bold text-[#6b1f2a]">
                Выберите город
              </div>
              <div className="grid gap-2">
                {Object.keys(LOCATIONS)
                  .filter((locKey) => !LOCATIONS[locKey]?.hidden)
                  .map((locKey) => (
                    <a
                      key={locKey}
                      href={`/${locKey}`}
                      className="rounded-xl border border-[rgba(107,31,42,0.2)] bg-[linear-gradient(135deg,rgba(107,31,42,0.04),rgba(79,176,232,0.12))] px-4 py-3 font-semibold text-[#4b0f1c] transition hover:bg-[linear-gradient(135deg,rgba(107,31,42,0.08),rgba(79,176,232,0.18))]"
                    >
                      {LOCATIONS[locKey]?.towns?.[0] || locKey}
                    </a>
                  ))}
              </div>
              <button
                type="button"
                className="mt-4 rounded-full border border-[rgba(107,31,42,0.25)] px-4 py-2 text-sm font-semibold text-[#6b1f2a]"
                onClick={() => setShowLocationModal(false)}
              >
                Закрыть
              </button>
            </div>
          </div>
        ) : null}

        <section className="bg-[linear-gradient(135deg,rgba(107,31,42,0.05),transparent_60%)] px-[6vw] pb-16 pt-6">
          <div className="grid min-h-[60vh] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <div className="order-last flex flex-col justify-center overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#4b101b,#6b1f2a)] p-10 text-white lg:order-none">
              <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(79,176,232,0.5),transparent_70%)]" />
              <div className="mb-4 text-[12px] uppercase tracking-[0.2em] text-[#9ad9ff]">
                ПРОСТРАНСТВО ЖИВЫХ ВСТРЕЧ
              </div>
              <h1 className="font-lora text-[clamp(28px,3vw,44px)] leading-tight">
                ПРОСТРАНСТВО ЛЁГКОСТИ И ЖИВОГО ОБЩЕНИЯ
              </h1>
              <p className="mt-4 text-[16px] leading-relaxed text-white/85">
                Здесь можно быть собой, отдыхать от суеты и дел, наслаждаться
                общением и открывать новых людей естественно, без ожиданий и
                масок.
              </p>
            </div>

            <div className="relative order-first overflow-hidden rounded-[28px] bg-black lg:order-none">
              <div className="absolute inset-0 overflow-hidden">
                <div className="flex h-full w-max animate-[marquee_40s_linear_infinite]">
                  {[...heroImages, ...heroImages].map((src, index) => (
                    <img
                      key={`${src}-${index}`}
                      src={src}
                      alt=""
                      className="h-full w-full object-cover brightness-[0.55]"
                    />
                  ))}
                </div>
              </div>
              <div className="relative z-10 grid h-full place-items-center">
                <img
                  src="/img/logo.png"
                  alt="Половинка успеха"
                  className="w-[min(220px,60%)] drop-shadow-[0_12px_30px_rgba(0,0,0,0.5)]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="button"
              className="rounded-full btn-gradient-hover px-7 py-3 font-semibold uppercase tracking-[0.05em] text-white"
              onClick={openLocationSelector}
            >
              Присоединиться к нам
            </button>
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
          <div
            className="mt-6 rounded-3xl bg-white p-6 shadow-[0_20px_45px_rgba(0,0,0,0.08)]"
            data-reveal
          >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,180px)_minmax(0,1fr)] lg:items-center">
              <img
                src="/img/other/gubina.jpg"
                alt="Надежда Губина"
                className="w-full max-w-[220px] rounded-[20px] justify-self-center object-contain"
              />
              <p className="text-[18px] leading-relaxed">
                <strong>Надежда</strong> – основатель пространства живых встреч,
                идейный вдохновитель, а также организатор и ведущая основных
                форматов пространства.
              </p>
            </div>
          </div>
        </Section>

        <Section id="spaces" title="Наши пространства">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {spacesFromDirections.map((space, index) => (
              <div
                key={space.id}
                data-reveal
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <DirectionCardView
                  direction={{
                    title: space.title,
                    shortDescription: space.description,
                    description: space.description,
                  }}
                  onMore={() => setActiveSpace(space)}
                  showButtons={false}
                />
              </div>
            ))}
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
              className="relative max-h-[85vh] w-full max-w-[820px] overflow-hidden rounded-[30px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.28)]"
            >
              <button
                type="button"
                aria-label="Закрыть"
                onClick={() => setActiveSpace(null)}
                className="cursor-pointer absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#f0e5ea] bg-white text-[#6b1f2a] transition hover:bg-[#f8f2f4]"
              >
                ×
              </button>
              {activeSpace.images?.length > 0 ? (
                <div className="relative overflow-hidden bg-black h-50 tablet:h-56">
                  <div className="absolute inset-0">
                    <div className="flex h-full w-max animate-[marquee_40s_linear_infinite]">
                      {[...activeSpace.images, ...activeSpace.images].map(
                        (src, index) => (
                          <img
                            key={`${src}-${index}`}
                            src={src}
                            alt=""
                            className="object-cover h-full w-80"
                          />
                        )
                      )}
                    </div>
                  </div>
                  {/* <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" /> */}
                </div>
              ) : null}
              <div className="flex max-h-[85vh] flex-col p-6">
                <h3 className="text-xl font-semibold text-[#4b0f1c]">
                  {activeSpace.title}
                </h3>
                <NoOrphanText
                  as="div"
                  className="mt-3 min-h-0 overflow-y-auto text-[16px] leading-relaxed text-[#3a2c33] whitespace-pre-line"
                  html={DOMPurify.sanitize(
                    activeSpace.fullDescription ||
                      activeSpace.description ||
                      ''
                  )}
                />
              </div>
            </div>
          </div>
        ) : null}

        <Section id="services" title="Пространство товаров">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard
                key={`${service.title ?? 'service'}-${index}`}
                service={service}
                style={{ transitionDelay: `${index * 80}ms` }}
              />
            ))}
          </div>
        </Section>
        {index2AdditionalBlocks.map((block) => (
          <AdditionalBlockSection key={block._id} block={block} />
        ))}

        <Section id="closed" title="Закрытое пространство">
          <div
            className="relative overflow-hidden rounded-[26px] bg-[linear-gradient(140deg,rgba(79,176,232,0.2),rgba(111,29,43,0.08))] p-8 leading-relaxed"
            data-reveal
          >
            <img
              src="/key.png"
              alt=""
              className="pointer-events-none absolute right-5 top-30 rotate-15 tablet:top-10 h-[calc(100%-8rem)] tablet:right-8 tablet:h-[calc(100%-5rem)] w-auto object-contain opacity-40"
            />
            <h3 className="text-[22px] text-[#6b1f2a]">
              ЗАКРЫТОЕ ПРОСТРАНСТВО ДЛЯ СВОИХ
            </h3>
            <p className="pr-10 mt-3 tablet:pr-13">
              Это формат с камерными встречами, где мы собираем небольшие группы
              по ценностям. Здесь больше глубины, доверия и долгих разговоров.
              Доступ открывается после знакомства с командой и участия в
              открытых мероприятиях.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-flex rounded-full bg-[#4fb0e8] px-6 py-2 text-white"
            >
              Узнать условия доступа
            </Link>
          </div>
        </Section>

        <Section id="announcements" title="Анонс наших мероприятий">
          <div className="grid gap-6 lg:grid-cols-2">
            <div
              className="rounded-2xl bg-white p-6 shadow-[0_16px_30px_rgba(0,0,0,0.08)]"
              data-reveal
            >
              <div className="mb-4 flex items-center justify-between font-semibold text-[#6b1f2a]">
                <span>{monthLabel}</span>
                <span className="text-[14px] text-[#1f6e9c]">
                  Активные даты выделены
                </span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day) => {
                  const isActive = activeDays.includes(day)
                  const isSelected = activeDay === day
                  return (
                    <button
                      key={day}
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
                      <div className="mt-3 inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-sm font-semibold text-[#6b1f2a]">
                        {event.maxParticipants
                          ? `Свободных мест ${Math.max(
                              0,
                              (event.maxParticipants ?? 0) -
                                (event.participantsCount ?? 0)
                            )} из ${event.maxParticipants}`
                          : 'Количество мест не ограничено'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                Подскажем формат, ответим на вопросы и поможем выбрать событие.
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
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
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
        .about-card-content li {
          position: relative;
          padding-left: 1.25rem;
        }
        .about-card-content li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.65em;
          width: 0.45rem;
          height: 0.45rem;
          border-radius: 999px;
          background: currentColor;
          opacity: 0.75;
          transform: translateY(-50%);
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
