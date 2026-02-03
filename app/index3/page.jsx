'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify'
import {
  ADDITIONAL_BLOCK_TILE_COLORS,
  LOCATIONS_KEYS_VISIBLE,
} from '@helpers/constants'
import {
  fetchingAdditionalBlocks,
  fetchingDirections,
  fetchingEvents,
  fetchingReviews,
} from '@helpers/fetchers'

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

const navItems = [
  { id: 'about', label: 'О нас' },
  { id: 'spaces', label: 'Наши пространства' },
  { id: 'events', label: 'Мероприятия' },
  { id: 'reviews', label: 'Отзывы' },
  { id: 'contacts', label: 'Контакты' },
]

const stats = [
  { number: '800+', text: 'мероприятий организовано и проведено' },
  { number: '1500+', text: 'человек посетили наши события' },
  { number: '50+', text: 'пар нашли друг друга на встречах' },
  { number: '200+', text: 'людей обрели друзей и единомышленников' },
]

export default function Index3Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [events, setEvents] = useState([])
  const [directions, setDirections] = useState([])
  const [reviewsData, setReviewsData] = useState([])
  const [additionalBlocks, setAdditionalBlocks] = useState([])
  const headerRef = useRef(null)
  const defaultLocation = LOCATIONS_KEYS_VISIBLE?.[0] ?? 'krsk'

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY || 0)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    let isMounted = true
    const loadData = async () => {
      const [eventsData, directionsData, reviews, blocks] = await Promise.all([
        fetchingEvents(defaultLocation),
        fetchingDirections(defaultLocation),
        fetchingReviews(defaultLocation),
        fetchingAdditionalBlocks(defaultLocation),
      ])

      if (isMounted) {
        setEvents(Array.isArray(eventsData) ? eventsData : [])
        setDirections(Array.isArray(directionsData) ? directionsData : [])
        setReviewsData(Array.isArray(reviews) ? reviews : [])
        setAdditionalBlocks(Array.isArray(blocks) ? blocks : [])
      }
    }

    loadData()
    return () => {
      isMounted = false
    }
  }, [defaultLocation])

  const spacesFromDirections = useMemo(() => {
    return (directions || [])
      .filter((direction) => direction?.showOnSite)
      .sort((a, b) => (a.index < b.index ? -1 : 1))
      .map((direction) => ({
        id: direction._id,
        title: direction.title,
        description: direction.shortDescription || direction.description || '',
      }))
  }, [directions])

  const upcomingEvents = useMemo(() => {
    const now = new Date()
    return (events || [])
      .map((event) => ({
        ...event,
        dateStart: event?.dateStart ? new Date(event.dateStart) : null,
      }))
      .filter(
        (event) =>
          event.dateStart &&
          !Number.isNaN(event.dateStart.getTime()) &&
          event.dateStart >= now &&
          event?.status !== 'canceled' &&
          event?.showOnSite !== false
      )
      .sort((a, b) => a.dateStart - b.dateStart)
      .slice(0, 6)
  }, [events])

  const reviews = useMemo(() => {
    return (reviewsData || [])
      .filter((review) => review?.showOnSite)
      .map((review) => ({
        id: review._id,
        name: review.author,
        text: review.review,
        photo: review.image || '/img/users/null.jpg',
      }))
  }, [reviewsData])

  const index3AdditionalBlocks = useMemo(() => {
    return (additionalBlocks || [])
      .filter((block) => block?.showOnIndex2)
      .sort((a, b) => (a.index < b.index ? -1 : 1))
  }, [additionalBlocks])

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
    spacesFromDirections.length,
    reviews.length,
    index3AdditionalBlocks.length,
    upcomingEvents.length,
  ])

  const scrollToSection = (id) => {
    const target = document.getElementById(id)
    if (!target) return
    const headerHeight = headerRef.current?.offsetHeight ?? 0
    const offsetTop =
      target.getBoundingClientRect().top + window.scrollY - headerHeight
    window.scrollTo({ top: offsetTop, behavior: 'smooth' })
  }

  return (
    <div className="bg-[#f7f7fb] text-[#1d1b1f]">
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b border-[rgba(107,31,42,0.15)] bg-white/85 backdrop-blur"
      >
        <div className="flex items-center gap-6 px-[5vw] py-2">
          <div className="flex items-center gap-3">
            <img
              src="/img/logo_horizontal.png"
              alt="Половинка успеха"
              className="h-[70px] w-[130px] object-contain"
            />
          </div>

          <button
            type="button"
            className="ml-auto flex h-11 w-11 flex-col items-center justify-center gap-1 rounded-full border border-[rgba(107,31,42,0.3)] bg-white lg:hidden"
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
            <Link
              href="/login"
              className="text-center rounded-full bg-[#4fb0e8] px-3.5 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-white"
              onClick={() => setMenuOpen(false)}
            >
              Войти в пространство
            </Link>
          </nav>
        </div>
      </header>

      <button
        type="button"
        className={`fixed inset-0 z-30 bg-black/40 transition lg:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      />

      <main>
        <section className="relative overflow-hidden px-[6vw] pb-16 pt-10">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -left-40 top-[-80px] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(141,207,242,0.5),transparent_70%)]" />
            <div className="absolute right-[-120px] top-[80px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(107,31,42,0.3),transparent_70%)]" />
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div className="flex flex-col justify-center gap-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(107,31,42,0.2)] bg-white px-4 py-1 text-[12px] uppercase tracking-[0.2em] text-[#6b1f2a]">
                Пространство живых встреч
              </div>
              <h1 className="font-lora text-[clamp(28px,3vw,48px)] leading-tight text-[#2b1b21]">
                Половинка успеха — место, где живое общение становится
                естественным
              </h1>
              <p className="max-w-[520px] text-[16px] leading-relaxed text-[#3a2c33]">
                Мы создаём атмосферу лёгкости и принятия: здесь можно быть
                собой, отдыхать от суеты, знакомиться и находить людей по духу
                без напряжения и масок.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="rounded-full bg-[#6b1f2a] px-7 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white shadow-[0_14px_30px_rgba(107,31,42,0.3)]"
                >
                  Присоединиться
                </Link>
                <button
                  type="button"
                  className="rounded-full border border-[rgba(107,31,42,0.25)] bg-white px-7 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-[#6b1f2a]"
                  onClick={() => scrollToSection('spaces')}
                >
                  Посмотреть пространства
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.number}
                    className="rounded-2xl bg-white p-4 shadow-[0_12px_24px_rgba(0,0,0,0.06)]"
                  >
                    <div className="font-adleryProSwash text-[clamp(28px,3vw,40px)] text-[#6b1f2a]">
                      {stat.number}
                    </div>
                    <div className="text-sm text-[#3a2c33]">{stat.text}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div
                className="relative overflow-hidden rounded-[32px] bg-[#2a141a]"
                style={{
                  transform: `translateY(${scrollY * 0.08}px)`,
                  transition: 'transform 0.2s ease-out',
                }}
              >
                <div className="absolute inset-0">
                  <div className="flex h-full w-max animate-[marquee_30s_linear_infinite]">
                    {[...heroImages, ...heroImages].map((src, index) => (
                      <img
                        key={`${src}-${index}`}
                        src={src}
                        alt=""
                        className="h-full w-72 object-cover brightness-[0.6]"
                      />
                    ))}
                  </div>
                </div>
                <div className="relative z-10 grid min-h-[320px] place-items-center px-10 py-16">
                  <img
                    src="/img/logo.png"
                    alt="Половинка успеха"
                    className="w-[min(220px,60%)] drop-shadow-[0_12px_30px_rgba(0,0,0,0.5)]"
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 left-6 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#6b1f2a] shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
                Живые встречи — реальные эмоции
              </div>
            </div>
          </div>
        </section>

        <Section
          id="about"
          title="О нашем пространстве"
          subtitle="Почему это работает"
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
            <div
              className="rounded-3xl bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
              data-reveal
            >
              <p>
                Каждый день похож на предыдущий: работа, заботы, спорт, дети,
                редкие встречи с друзьями. Жизнь вроде идёт, но не хватает тепла
                и настоящего человеческого контакта.
              </p>
              <p className="mt-4">
                <strong>Половинка успеха</strong> — это пространство лёгкости и
                живого общения. Мы создаём условия, где можно быть собой,
                отдыхать, знакомиться и открывать новых людей естественно.
              </p>
            </div>

            <div
              className="rounded-3xl bg-[linear-gradient(150deg,rgba(107,31,42,0.9),rgba(79,176,232,0.7))] p-6 text-white shadow-[0_18px_40px_rgba(0,0,0,0.1)]"
              data-reveal
            >
              <h3 className="text-[18px] font-semibold uppercase tracking-[0.08em]">
                Формула атмосферы
              </h3>
              <ul className="mt-4 grid gap-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                  Поддерживающие ведущие и бережная модерация
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                  Мягкие форматы: от камерных вечеров до ярких выездов
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                  Аудитория по ценностям, без напряжения и ожиданий
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3" data-reveal>
            {[
              {
                title: 'Выберите формат',
                text: 'Пространство, которое совпадает с вашим настроением.',
              },
              {
                title: 'Запишитесь',
                text: 'Пара кликов — и вы уже в списке участников.',
              },
              {
                title: 'Приходите',
                text: 'Живое общение, новые связи и вдохновение.',
              },
            ].map((step) => (
              <div
                key={step.title}
                className="rounded-2xl border border-[rgba(107,31,42,0.15)] bg-white/80 p-5 shadow-[0_12px_24px_rgba(0,0,0,0.05)]"
              >
                <div className="text-sm font-semibold text-[#6b1f2a]">
                  {step.title}
                </div>
                <div className="mt-2 text-sm text-[#3a2c33]">{step.text}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="spaces" title="Наши пространства" subtitle="Выберите своё">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {spacesFromDirections.map((space, index) => (
              <div
                key={space.id}
                className="rounded-2xl bg-white p-5 shadow-[0_14px_30px_rgba(0,0,0,0.08)]"
                data-reveal
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="rounded-full border border-[rgba(107,31,42,0.2)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#6b1f2a]">
                  {space.title}
                </div>
                <p className="mt-3 text-sm text-[#3a2c33]">
                  {space.description}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="events"
          title="Анонс мероприятий"
          subtitle="Ближайшие встречи"
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-[0_16px_30px_rgba(0,0,0,0.08)]">
              <h3 className="text-lg font-semibold text-[#6b1f2a]">
                Ближайшие события
              </h3>
              <div className="mt-4 grid gap-3">
                {upcomingEvents.length === 0 ? (
                  <div className="text-sm text-[#6b6b6b]">
                    Сейчас нет активных мероприятий.
                  </div>
                ) : (
                  upcomingEvents.map((event) => (
                    <div
                      key={event._id}
                      className="rounded-xl border border-[rgba(107,31,42,0.12)] bg-[linear-gradient(135deg,rgba(141,207,242,0.2),rgba(107,31,42,0.05))] p-4"
                    >
                      <div className="font-semibold text-[#4b0f1c]">
                        {event.title}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm text-[#2f586f]">
                        <span>
                          {event.dateStart?.toLocaleDateString('ru-RU', {
                            day: '2-digit',
                            month: 'long',
                          })}
                        </span>
                        <span>
                          {event.dateStart?.toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-[0_16px_30px_rgba(0,0,0,0.08)]">
              <h3 className="text-lg font-semibold text-[#6b1f2a]">
                Что вас ждёт
              </h3>
              <div className="mt-4 grid gap-3 text-sm text-[#3a2c33]">
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#6b1f2a]" />
                  Живые форматы: игры, прогулки, выезды, тематические вечера
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#6b1f2a]" />
                  Небольшие группы, где легко включиться в общение
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#6b1f2a]" />
                  Настоящие впечатления без напряжения и формальностей
                </div>
              </div>
            </div>
          </div>
        </Section>

        {index3AdditionalBlocks.map((block) => (
          <AdditionalBlockSection key={block._id} block={block} />
        ))}

        <Section id="reviews" title="Отзывы" subtitle="Живые впечатления">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.length === 0 ? (
              <div className="text-sm text-[#6b6b6b]">Пока нет отзывов.</div>
            ) : (
              reviews.slice(0, 6).map((review, index) => (
                <div
                  key={review.id}
                  className="rounded-2xl bg-white p-5 shadow-[0_14px_28px_rgba(0,0,0,0.08)]"
                  data-reveal
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={review.photo}
                      alt={review.name}
                      className="h-14 w-14 rounded-full border-2 border-[#8dcff2] object-cover"
                    />
                    <div className="text-sm font-semibold text-[#4b0f1c]">
                      {review.name}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-[#3a2c33]">{review.text}</p>
                </div>
              ))
            )}
          </div>
        </Section>

        <Section id="contacts" title="Контакты" subtitle="Свяжитесь с нами">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-[0_14px_28px_rgba(0,0,0,0.08)]">
              <h3 className="text-lg font-semibold text-[#6b1f2a]">Мы рядом</h3>
              <p className="mt-2 text-sm">Телефон: +7 (999) 123-45-67</p>
              <p className="text-sm">Email: hello@polovinka-uspeha.ru</p>
              <p className="text-sm">Город: Красноярск</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-[0_14px_28px_rgba(0,0,0,0.08)]">
              <h3 className="text-lg font-semibold text-[#6b1f2a]">
                Мы в соцсетях
              </h3>
              <p className="mt-2 text-sm">Instagram: @polovinka_uspeha</p>
              <p className="text-sm">Telegram: @polovinka_uspeha</p>
              <p className="text-sm">VK: vk.com/polovinka_uspeha</p>
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
      `}</style>
    </div>
  )
}

function Section({ id, title, subtitle, children }) {
  return (
    <section
      id={id}
      className="px-[6vw] py-[70px] even:bg-[linear-gradient(140deg,rgba(141,207,242,0.16),rgba(107,31,42,0.04))]"
    >
      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b1f2a]">
          {subtitle}
        </div>
        <h2 className="font-lora text-[clamp(26px,3vw,38px)] text-[#2b1b21]">
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
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
}

Section.defaultProps = {
  subtitle: '',
}

function AdditionalBlockSection({ block }) {
  const tiles = Array.isArray(block.tiles) ? block.tiles : []
  const hasDescription = Boolean(block.description)
  const blockStyle =
    block.blockBgMode === 'gradient'
      ? {
          background: `linear-gradient(135deg, ${
            block.blockBgColor1 || '#ffffff'
          }, ${block.blockBgColor2 || '#f6f3f1'})`,
        }
      : {
          backgroundColor: block.blockBgColor1 || '#ffffff',
        }

  return (
    <section className="px-[6vw] py-[70px] even:bg-[linear-gradient(140deg,rgba(141,207,242,0.16),rgba(107,31,42,0.04))]">
      <div className="mb-8">
        <h2 className="font-lora text-[clamp(26px,3vw,38px)] text-[#2b1b21]">
          {block.title}
        </h2>
      </div>
      <div
        className="rounded-3xl p-6 shadow-[0_16px_30px_rgba(0,0,0,0.08)]"
        style={blockStyle}
      >
        {hasDescription ? (
          <div
            className="rounded-2xl bg-white/70 p-5 shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(block.description),
            }}
          />
        ) : null}
        {tiles.length > 0 ? (
          <div
            className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${
              hasDescription ? 'mt-6' : ''
            }`}
          >
            {tiles.map((tile, index) => (
              <ServiceCard
                key={`${tile.title ?? 'tile'}-${index}`}
                service={tile}
              />
            ))}
          </div>
        ) : null}
      </div>
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

function ServiceCard({ service }) {
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
        tileStyle ? tileStyle.bgClassName : 'bg-white'
      }`}
      style={isCustomColor ? { backgroundColor: service.color } : undefined}
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
      <p
        className={`mt-2 ${
          tileStyle?.descriptionClassName ??
          (isCustomColor ? 'text-white/90' : '')
        }`}
      >
        {service.description}
      </p>
    </div>
  )
}

ServiceCard.propTypes = {
  service: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
}
