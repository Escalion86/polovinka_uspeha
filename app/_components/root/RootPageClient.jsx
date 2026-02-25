'use client'

import Link from 'next/link'
import PropTypes from 'prop-types'
import { useEffect, useMemo, useRef, useState } from 'react'
import { LOCATIONS, LOCATIONS_KEYS_VISIBLE } from '@helpers/constants'
import { captureAttributionFromBrowser } from '@helpers/attribution'
import { fetchingGlobalAboutSpaceCards } from '@helpers/fetchers'
import AboutSpaceCard from '@layouts/cards/AboutSpaceCard'

const valueCards = [
  {
    title: 'Живые встречи',
    text: 'Вечера, выезды, прогулки, игры и мастер-классы с акцентом на реальное общение.',
  },
  {
    title: 'Без масок и давления',
    text: 'Теплая и уважительная атмосфера, где можно быть собой и знакомиться естественно.',
  },
  {
    title: 'Разные сценарии знакомств',
    text: 'Дружеские, деловые и романтические связи: каждый выбирает свой формат участия.',
  },
]

const steps = [
  'Выберите город и изучите актуальные мероприятия.',
  'Пройдите быструю регистрацию и получите доступ в личный кабинет.',
  'Запишитесь на мероприятие и приходите в пространство живого общения.',
]

const prepareCities = (cities) =>
  (Array.isArray(cities) ? cities : [])
    .map((city) => {
      const key = city?.slug
      const config = LOCATIONS[key] || {}
      const towns = Array.isArray(config.towns) ? config.towns : []

      return {
        key,
        city: city?.title || towns[0] || key?.toUpperCase() || '',
        nearby: towns.slice(1, 4),
      }
    })
    .filter((city) => city.key)

export default function RootPageClient({
  initialCities,
  initialAboutSpaceCards,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [globalCities, setGlobalCities] = useState(() =>
    prepareCities(initialCities)
  )
  const [globalAboutSpaceCards, setGlobalAboutSpaceCards] = useState(
    Array.isArray(initialAboutSpaceCards) ? initialAboutSpaceCards : []
  )
  const headerRef = useRef(null)

  useEffect(() => {
    captureAttributionFromBrowser()
  }, [])

  const fallbackLocations = useMemo(
    () =>
      LOCATIONS_KEYS_VISIBLE.map((key) => {
        const config = LOCATIONS[key] || {}
        const towns = Array.isArray(config.towns) ? config.towns : []

        return {
          key,
          city: towns[0] || key.toUpperCase(),
          nearby: towns.slice(1, 4),
        }
      }),
    []
  )

  useEffect(() => {
    let isMounted = true
    if (Array.isArray(initialCities) && initialCities.length > 0) {
      return () => {
        isMounted = false
      }
    }

    const loadCities = async () => {
      try {
        const response = await fetch('/api/global/cities/public').then((res) =>
          res.json()
        )
        if (!isMounted || !response?.success) return

        setGlobalCities(prepareCities(response?.data?.cities))
      } catch (error) {
        console.log('RootPage loadCities error:', error)
      }
    }

    loadCities()

    return () => {
      isMounted = false
    }
  }, [initialCities])

  useEffect(() => {
    let isMounted = true
    if (
      Array.isArray(initialAboutSpaceCards) &&
      initialAboutSpaceCards.length > 0
    ) {
      return () => {
        isMounted = false
      }
    }

    const loadAboutSpaceCards = async () => {
      const data = await fetchingGlobalAboutSpaceCards()
      if (!isMounted) return

      setGlobalAboutSpaceCards(
        Array.isArray(data?.aboutSpaceCards) ? data.aboutSpaceCards : []
      )
    }

    loadAboutSpaceCards()

    return () => {
      isMounted = false
    }
  }, [initialAboutSpaceCards])

  const locations = globalCities.length > 0 ? globalCities : fallbackLocations
  const scrollToSection = (id) => {
    const target = document.getElementById(id)
    if (!target) return
    const headerHeight = headerRef.current?.offsetHeight ?? 0
    const offsetTop =
      target.getBoundingClientRect().top + window.scrollY - headerHeight
    window.scrollTo({ top: offsetTop, behavior: 'smooth' })
  }

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

  return (
    <div className="min-h-screen bg-[#f8f5f3] text-[#2b1b21]">
      <header
        ref={headerRef}
        className="sticky top-0 z-40 border-b border-[rgba(107,31,42,0.15)] bg-white/90 backdrop-blur"
      >
        <div className="mx-auto flex w-full max-w-[1200px] items-center gap-4 px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/img/logo_horizontal.png"
              alt="Половинка успеха"
              className="h-[64px] w-[130px] object-contain"
            />
          </Link>

          <button
            type="button"
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(107,31,42,0.25)] lg:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Меню"
          >
            <span className="text-xl leading-none">☰</span>
          </button>

          <nav
            className={`${menuOpen ? 'flex' : 'hidden'} absolute left-4 right-4 top-[86px] z-50 flex-col gap-2 rounded-2xl border border-[rgba(107,31,42,0.15)] bg-white p-4 shadow-[0_20px_40px_rgba(0,0,0,0.12)] lg:static lg:ml-auto lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-3 lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none`}
          >
            <a
              href="#about"
              className="rounded-full px-3 py-2 text-sm font-semibold text-[#4b0f1c] hover:bg-[#f2e8ec]"
              onClick={(event) => {
                event.preventDefault()
                setMenuOpen(false)
                scrollToSection('about')
              }}
            >
              О проекте
            </a>
            <a
              href="#cities"
              className="rounded-full px-3 py-2 text-sm font-semibold text-[#4b0f1c] hover:bg-[#f2e8ec]"
              onClick={(event) => {
                event.preventDefault()
                setMenuOpen(false)
                scrollToSection('cities')
              }}
            >
              Города
            </a>
            <button
              type="button"
              className="rounded-full bg-[linear-gradient(135deg,#6b1f2a,#8a3a45)] px-4 py-2 text-sm font-semibold text-white"
              onClick={() => {
                setMenuOpen(false)
                setShowLocationModal(true)
              }}
            >
              Выбрать город
            </button>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-[1200px] gap-6 px-4 pb-12 pt-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] md:px-6">
          <div className="rounded-[28px] bg-[linear-gradient(160deg,#4b101b,#6b1f2a)] p-7 text-white md:p-9">
            <p className="text-xs uppercase tracking-[0.22em] text-[#9ad9ff]">
              Пространство живого общения
            </p>
            <h1 className="mt-3 font-lora text-[clamp(28px,4vw,44px)] leading-tight">
              Легкие знакомства и офлайн-встречи для взрослых людей
            </h1>
            <p className="mt-4 max-w-[620px] text-[16px] leading-relaxed text-white/90">
              Платформа объединяет людей 30-50, которые ценят живое общение,
              новые связи и качественный отдых без суеты.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                type="button"
                className="rounded-full bg-[#8dcff2] px-5 py-2.5 text-sm font-semibold text-[#2b1b21]"
                onClick={() => setShowLocationModal(true)}
              >
                Присоединиться
              </button>
              <a
                href="#cities"
                className="rounded-full border border-white/35 px-5 py-2.5 text-sm font-semibold text-white"
                onClick={(event) => {
                  event.preventDefault()
                  scrollToSection('cities')
                }}
              >
                Смотреть города
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] bg-black">
            <img
              src="/img/general/5.jpg"
              alt="Атмосфера живых встреч"
              className="h-full min-h-[260px] w-full object-cover opacity-85"
            />
          </div>
        </section>

        <section
          id="about"
          className="mx-auto w-full max-w-[1200px] px-4 py-6 md:px-6"
        >
          <h2 className="font-lora text-[clamp(24px,3vw,36px)] font-bold text-[#6b1f2a]">
            О проекте
          </h2>
          <div className="grid gap-4 mt-5 md:grid-cols-3">
            {valueCards.map((card) => (
              <article
                key={card.title}
                className="rounded-3xl border border-[rgba(107,31,42,0.15)] bg-white p-5 shadow-[0_16px_30px_rgba(0,0,0,0.08)]"
              >
                <h3 className="text-lg font-semibold text-[#4b0f1c]">
                  {card.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#3a2c33]">
                  {card.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1200px] px-4 py-6 md:px-6">
          <h2 className="font-lora text-[clamp(24px,3vw,36px)] font-bold text-[#6b1f2a]">
            О нашем пространстве
          </h2>
          {aboutCards.length > 0 ? (
            <div className="grid gap-6 mt-5 lg:grid-cols-2">
              {aboutCards.map((card, index) => (
                <AboutSpaceCard
                  key={card.id ?? `${card.title}-${index}`}
                  card={card}
                  showButtons={false}
                />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-3xl border border-[rgba(107,31,42,0.15)] bg-white p-5 text-[15px] text-[#3a2c33]">
              Блок скоро будет доступен.
            </div>
          )}
        </section>

        <section className="mx-auto w-full max-w-[1200px] px-4 py-10 md:px-6">
          <div className="rounded-[28px] border border-[rgba(107,31,42,0.12)] bg-white p-6 md:p-8">
            <h2 className="font-lora text-[clamp(22px,3vw,32px)] font-bold text-[#6b1f2a]">
              Как это работает
            </h2>
            <div className="grid gap-4 mt-5 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step} className="rounded-2xl bg-[#f9f3f6] p-4">
                  <div className="text-sm font-bold text-[#6b1f2a]">
                    Шаг {index + 1}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#3a2c33]">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="cities"
          className="mx-auto w-full max-w-[1200px] px-4 pb-14 md:px-6"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-lora text-[clamp(24px,3vw,36px)] font-bold text-[#6b1f2a]">
              Наши города
            </h2>
            <button
              type="button"
              className="rounded-full border border-[rgba(107,31,42,0.25)] px-4 py-2 text-sm font-semibold text-[#6b1f2a]"
              onClick={() => setShowLocationModal(true)}
            >
              Открыть список городов
            </button>
          </div>

          <div className="grid gap-4 mt-5 md:grid-cols-3">
            {locations.map((item) => (
              <article
                key={item.key}
                className="rounded-3xl border border-[rgba(107,31,42,0.15)] bg-white p-5 shadow-[0_16px_30px_rgba(0,0,0,0.08)]"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-[#7b3c48]">
                  {item.key.toUpperCase()}
                </div>
                <h3 className="mt-2 text-2xl font-semibold text-[#4b0f1c]">
                  {item.city}
                </h3>
                <p className="mt-2 text-sm text-[#3a2c33]">
                  {item.nearby.length > 0
                    ? `Также рядом: ${item.nearby.join(', ')}`
                    : 'Локальная команда и офлайн-мероприятия в вашем городе.'}
                </p>
                <div className="flex gap-2 mt-5">
                  <Link
                    href={`/${item.key}`}
                    className="rounded-full bg-[linear-gradient(135deg,#6b1f2a,#8a3a45)] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Перейти в город
                  </Link>
                  <Link
                    href={`/${item.key}/register`}
                    className="rounded-full border border-[rgba(107,31,42,0.2)] px-4 py-2 text-sm font-semibold text-[#6b1f2a]"
                  >
                    Регистрация
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-[linear-gradient(135deg,rgba(107,31,42,0.1),rgba(141,207,242,0.18))] p-6">
            <h3 className="text-lg font-semibold text-[#4b0f1c]">
              Масштабирование в новые города
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#3a2c33]">
              Главная страница не привязана к данным одного города и
              масштабируется через единый список локаций. При запуске нового
              города он появляется в этом блоке и в модальном выборе города.
            </p>
          </div>
        </section>
      </main>

      {showLocationModal ? (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-black/45 px-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget)
              setShowLocationModal(false)
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
              {locations.map((item) => (
                <Link
                  key={item.key}
                  href={`/${item.key}`}
                  className="rounded-xl border border-[rgba(107,31,42,0.2)] bg-[linear-gradient(135deg,rgba(107,31,42,0.04),rgba(79,176,232,0.12))] px-4 py-3 font-semibold text-[#4b0f1c] transition hover:bg-[linear-gradient(135deg,rgba(107,31,42,0.08),rgba(79,176,232,0.18))]"
                >
                  {item.city}
                </Link>
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
    </div>
  )
}

RootPageClient.propTypes = {
  initialCities: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string,
      title: PropTypes.string,
    })
  ),
  initialAboutSpaceCards: PropTypes.arrayOf(PropTypes.object),
}

RootPageClient.defaultProps = {
  initialCities: [],
  initialAboutSpaceCards: [],
}
