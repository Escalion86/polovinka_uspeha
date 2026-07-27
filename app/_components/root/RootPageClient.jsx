'use client'

import Link from 'next/link'
import PropTypes from 'prop-types'
import { useEffect, useMemo, useRef, useState } from 'react'
import { LOCATIONS, LOCATIONS_KEYS_VISIBLE } from '@helpers/constants'
import { captureAttributionFromBrowser } from '@helpers/attribution'
import { fetchingGlobalAboutSpaceCards } from '@helpers/fetchers'
import AboutSpaceCard from '@layouts/cards/AboutSpaceCard'
import HeroImageSlider from '@components/HeroImageSlider'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [openingCity, setOpeningCity] = useState(null)
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

  const navigateToCity = (cityKey, cityTitle) => {
    if (!cityKey || openingCity) return
    setOpeningCity(cityTitle || cityKey.toUpperCase())
    router.push(`/${cityKey}`)
  }

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
    <div className="min-h-screen bg-[#fbfaf8] text-[#211b1d]">
      <header
        ref={headerRef}
        className="sticky top-0 z-40 border-b border-[#eadfe1] bg-[#fbfaf8]/95 backdrop-blur"
      >
        <div className="mx-auto flex h-[88px] w-full max-w-[1380px] items-center gap-4 px-4 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/img/logo_new_horizontal_burgundy.png"
              alt="Половинка успеха"
              className="h-[58px] w-auto object-contain md:h-[66px]"
            />
          </Link>

          <button
            type="button"
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#c9a8af] bg-white lg:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Меню"
          >
            <span className="text-xl leading-none text-[#681724]">☰</span>
          </button>

          <nav
            className={`${menuOpen ? 'flex' : 'hidden'} absolute left-4 right-4 top-[78px] z-50 flex-col gap-1 rounded-2xl border border-[#eadfe1] bg-white p-4 shadow-[0_20px_40px_rgba(0,0,0,0.12)] lg:static lg:ml-auto lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-5 lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none`}
          >
            <a
              href="#about"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-[#5a1723] hover:bg-[#f7eef0]"
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
              className="rounded-lg px-3 py-2 text-sm font-semibold text-[#5a1723] hover:bg-[#f7eef0]"
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
              className="rounded-xl border border-[#8b4b59] bg-white px-5 py-3 text-sm font-semibold text-[#5a1723] transition hover:bg-[#6b1f2a] hover:text-white"
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
        <section className="mx-auto w-full max-w-[1380px] px-4 pb-14 pt-8 md:px-8 md:pb-20 md:pt-10">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(520px,1fr)] lg:gap-12">
            <div className="order-1">
              <h1 className="max-w-[690px] font-lora text-[clamp(38px,3.2vw,46px)] leading-[1.08] text-[#681724]">
                <span className="block">Найдите встречу,</span>
                <span className="block">на которую хочется прийти</span>
              </h1>
              <p className="mt-6 max-w-[610px] text-[clamp(17px,1.6vw,21px)] leading-relaxed text-[#332b2d]">
                Живое общение без неловкости и давления — в компании взрослых
                людей вашего города.
              </p>
              <button
                type="button"
                className="mt-8 min-h-14 w-full max-w-[360px] rounded-[18px] bg-[#72c5f2] px-8 py-4 text-lg font-bold text-[#681724] shadow-[0_12px_24px_rgba(79,176,232,0.2)] transition hover:-translate-y-0.5 hover:bg-[#63bdec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#681724]"
                onClick={() => setShowLocationModal(true)}
              >
                Выбрать город
              </button>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#5c484d]">
                <span>Можно прийти одному</span>
                <span aria-hidden>·</span>
                <span>Бережная модерация</span>
              </div>
            </div>
            <div className="order-2 overflow-hidden rounded-[28px] bg-[#eadfe1]">
              <HeroImageSlider />
            </div>
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

          <div className="grid gap-4 mt-5 tablet:grid-cols-2 desktop:grid-cols-3">
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
                <div className="flex flex-wrap gap-2 mt-5">
                  <button
                    type="button"
                    className="rounded-full bg-[linear-gradient(135deg,#6b1f2a,#8a3a45)] px-4 py-2 text-sm font-semibold text-white"
                    onClick={() => navigateToCity(item.key, item.city)}
                    disabled={Boolean(openingCity)}
                  >
                    Перейти в город
                  </button>
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
      <footer className="border-t border-[rgba(107,31,42,0.15)] bg-white/90">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-4 text-sm text-[#5d4a52] md:px-6">
          <span>© Половинка успеха</span>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/legal/privacy-policy"
              className="font-semibold underline text-[#6b1f2a] hover:text-[#8b2a38]"
            >
              Политика конфиденциальности
            </Link>
            <Link
              href="/legal/terms"
              className="font-semibold underline text-[#6b1f2a] hover:text-[#8b2a38]"
            >
              Пользовательское соглашение
            </Link>
          </div>
        </div>
      </footer>

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
                <button
                  type="button"
                  key={item.key}
                  className="rounded-xl border border-[rgba(107,31,42,0.2)] bg-[linear-gradient(135deg,rgba(107,31,42,0.04),rgba(79,176,232,0.12))] px-4 py-3 font-semibold text-[#4b0f1c] transition hover:bg-[linear-gradient(135deg,rgba(107,31,42,0.08),rgba(79,176,232,0.18))]"
                  onClick={() => {
                    setShowLocationModal(false)
                    navigateToCity(item.key, item.city)
                  }}
                  disabled={Boolean(openingCity)}
                >
                  {item.city}
                </button>
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
      {openingCity ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 px-4">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-[#4b0f1c] shadow-[0_24px_60px_rgba(0,0,0,0.25)]">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#8dcff2] border-t-[#6b1f2a]" />
            <span className="text-sm font-semibold">
              Открывается {openingCity}...
            </span>
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
