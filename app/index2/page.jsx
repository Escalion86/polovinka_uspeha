'use client'

import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

const heroImages = [
  '/img/other/0eoqjwuzhUU.webp',
  '/img/other/7yMY8jczYqo.jpg',
  '/img/other/IF8t5okaUQI_1.webp',
  '/img/other/SX8uR3hsbx8.webp',
  '/img/other/xsh35VC6g0c.jpg',
  '/img/other/kjjxV_zPePM.webp',
  '/img/other/aONc1PLjZ4M.webp',
  '/img/other/photo.webp',
]

const spaces = [
  {
    id: 'evening',
    title: 'ВЕЧЕРА ЖИВОГО ОБЩЕНИЯ',
    description:
      'Теплые камерные встречи с играми, разговорами и мягкой модерацией.',
    tags: ['камерно', 'разговоры', 'новые знакомства'],
  },
  {
    id: 'trips',
    title: 'ВЫЕЗДЫ И ПУТЕШЕСТВИЯ',
    description:
      'Поездки, прогулки, автоквесты и мини-приключения с общей целью.',
    tags: ['выезды', 'природа', 'эмоции'],
  },
  {
    id: 'workshop',
    title: 'МАСТЕР-КЛАССЫ',
    description: 'Творческие форматы: от кулинарных вечеров до арт-практик.',
    tags: ['творчество', 'новые навыки', 'легкость'],
  },
  {
    id: 'games',
    title: 'ИГРОВЫЕ ВСТРЕЧИ',
    description: 'Настолки, городские игры и динамичные командные форматы.',
    tags: ['игры', 'движение', 'команда'],
  },
  {
    id: 'talks',
    title: 'ТЕМАТИЧЕСКИЕ ВСТРЕЧИ',
    description:
      'Разговорные клубы и живые беседы на важные темы без давления.',
    tags: ['смыслы', 'поддержка', 'искренность'],
  },
]

const services = [
  {
    title: 'ЛИЧНОЕ СОПРОВОЖДЕНИЕ',
    description:
      'Мягкая помощь в выборе формата, знакомстве и адаптации к новым людям.',
  },
  {
    title: 'ОРГАНИЗАЦИЯ ВСТРЕЧ ПОД ЗАПРОС',
    description:
      'Собираем небольшие группы под интересы: активные, творческие, деловые.',
  },
  {
    title: 'ПОДАРОЧНЫЙ СЕРТИФИКАТ',
    description:
      'Тёплый подарок, который дарит живые эмоции и новые знакомства.',
    accent: true,
  },
]

const teamMembers = [
  {
    name: 'Елена',
    role: 'Основатель и вдохновитель',
    photo: '/img/users/famale.jpg',
  },
  {
    name: 'Дмитрий',
    role: 'Ведущий и модератор',
    photo: '/img/users/male.jpg',
  },
  {
    name: 'Мария',
    role: 'Куратор программ',
    photo: '/img/users/famale.jpg',
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

const stats = [
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
    number: '200+',
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

const reasonsItems = [
  {
    label: 'Сбалансированные форматы',
    text: 'мероприятия под настроение от камерных игр до выездов на природу',
  },
  {
    label: 'Тонкая модерация',
    text: 'ведущие создают атмосферу вовлечённости и лёгкости, помогая каждому раскрыться',
  },
  {
    label: 'Аудитория по ценностям',
    text: 'здесь собираются люди, близкие по взглядам, стилю жизни и внутренней культуре',
  },
  {
    label: 'Удобное участие',
    text: 'всё просто - выбрать событие, зарегистрироваться, прийти и быть собой',
  },
]

const calendarDays = Array.from({ length: 28 }, (_, index) => index + 1)
const activeDays = [2, 5, 9, 12, 14, 18, 21, 25]

const eventsByDay = {
  2: [
    {
      title: 'ВЕЧЕР НАСТОЛЬНЫХ ИГР',
      time: '19:00',
      place: 'Кафе на Набережной',
    },
  ],
  5: [
    {
      title: 'ПРОГУЛКА И ФОТО-КВЕСТ',
      time: '18:30',
      place: 'Парк в центре',
    },
  ],
  9: [
    {
      title: 'ЛЕГКИЙ РАЗГОВОРНЫЙ ВЕЧЕР',
      time: '19:30',
      place: 'Пространство «Половинка успеха»',
    },
  ],
  12: [
    {
      title: 'МАСТЕР-КЛАСС ПО КУЛИНАРИИ',
      time: '18:00',
      place: 'Студия вкуса',
    },
  ],
  14: [
    {
      title: 'ТЕМАТИЧЕСКИЙ ВЕЧЕР «СВИДАНИЕ С СОБОЙ»',
      time: '20:00',
      place: 'Уютный лофт',
    },
  ],
  18: [
    {
      title: 'ВЫЕЗД НА ПРИРОДУ',
      time: '10:00',
      place: 'Загородный маршрут',
    },
  ],
  21: [
    {
      title: 'ЖИВОЕ ОБЩЕНИЕ + МУЗЫКА',
      time: '19:00',
      place: 'Городская веранда',
    },
  ],
  25: [
    {
      title: 'АВТОКВЕСТ ВЕЧЕРНИЙ',
      time: '18:00',
      place: 'Старт у театра',
    },
  ],
}

const navItems = [
  { id: 'about', label: 'О нас' },
  { id: 'team', label: 'Команда' },
  { id: 'announcements', label: 'Анонс мероприятий' },
  { id: 'reviews', label: 'Отзывы' },
  { id: 'contacts', label: 'Контакты' },
]

const spacesNavItems = [
  { id: 'spaces', label: 'Пространство мероприятий' },
  { id: 'services', label: 'Пространство товаров и услуг' },
  { id: 'closed', label: 'Закрытое пространство' },
]

export default function Index2Page() {
  const [activeSpace, setActiveSpace] = useState('all')
  const [activeDay, setActiveDay] = useState(activeDays[0])
  const [menuOpen, setMenuOpen] = useState(false)

  const filteredSpaces = useMemo(() => {
    if (activeSpace === 'all') {
      return spaces
    }
    return spaces.filter((space) => space.id === activeSpace)
  }, [activeSpace])

  const eventsForDay = eventsByDay[activeDay] || []

  return (
    <div className="bg-[#f6f3f1] text-[#1d1b1f]">
      <header className="sticky top-0 z-40 border-b border-[rgba(107,31,42,0.15)] bg-white/90 backdrop-blur">
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
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <details className="relative lg:w-full">
              <summary className="whitespace-nowrap flex cursor-pointer list-none items-center gap-1 rounded-full px-2.5 py-1.5 text-[12px] uppercase tracking-[0.08em] text-[#4b0f1c] transition hover:bg-[#6b1f2a] hover:text-white">
                Наши пространства
                <span className="text-[10px] leading-none">▾</span>
              </summary>
              <div className="static mt-2 grid min-w-0 gap-1 rounded-xl bg-white p-0 shadow-none lg:absolute lg:left-0 lg:top-[calc(100%+8px)] lg:min-w-[240px] lg:gap-1 lg:rounded-xl lg:bg-white lg:p-2 lg:shadow-2xl">
                {spacesNavItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="rounded-lg px-2.5 py-2 text-[12px] uppercase tracking-[0.06em] text-[#4b0f1c] transition hover:bg-[rgba(107,31,42,0.12)]"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </details>
            <Link
              href="/login"
              className="text-center rounded-full bg-[#4fb0e8] px-3.5 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-white"
              onClick={() => setMenuOpen(false)}
            >
              Войти в пространство!
            </Link>
          </nav>

        </div>
      </header>
      <button
        type="button"
        className={`fixed inset-0 z-20 bg-black/40 transition lg:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      />

      <main>
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
                      className="h-full w-80 object-cover brightness-[0.55]"
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
            <Link
              href="/login"
              className="rounded-full bg-[#4fb0e8] px-7 py-3 font-semibold uppercase tracking-[0.05em] text-white"
            >
              Присоединиться к нам
            </Link>
          </div>
        </section>

        <Section id="about" title="О нашем пространстве!">
          <div className="rounded-3xl bg-white p-6 shadow-[0_20px_45px_rgba(0,0,0,0.08)]">
            <p>
              Каждый день похож на предыдущий: работа, заботы, спорт, домашние
              дела, дети, редкие встречи с друзьями. Жизнь вроде идёт, но
              чего-то не хватает тепла, спонтанности, человеческого контакта.
              Тебе хочется просто расслабиться и побыть среди «своих» самим
              собой, где не нужно играть роли и подбирать слова?
            </p>
            <p className="mt-4">
              <strong>ПРОСТРАНСТВО ЖИВЫХ ВСТРЕЧ «ПОЛОВИНКА УСПЕХА»</strong> —
              это пространство лёгкости и живого общения.
            </p>
          </div>

          <div className="grid gap-6 mt-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-[linear-gradient(145deg,#4b101b_0%,#6b1f2a_55%,#7b2a35_100%)] p-6 text-white shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
              <h3 className="text-[18px] text-white">
                <strong>
                  УЖЕ БОЛЕЕ ЧЕТЫРЕХ ЛЕТ МЫ СОЗДАЁМ АТМОСФЕРУ, ГДЕ МОЖНО:
                </strong>
              </h3>
              <HeartList
                items={[
                  'просто быть самим собой',
                  'отдыхать от суеты и дел',
                  'наслаждаться общением',
                  'открывать для себя новых людей естественно, без ожиданий и масок',
                  'встретить свою вторую половинку',
                  'обрести новых друзей и единомышленников в своих увлечениях',
                  'расширить круг деловых связей и партнеров',
                  'научиться чему-то новому и получить новый опыт и эмоции',
                  'весело провести время и просто потусоваться с такими же людьми, как ты',
                ]}
              />
            </div>
            <div className="rounded-3xl bg-[linear-gradient(145deg,#3aa3e0_0%,#4fb0e8_55%,#6bc2f0_100%)] p-6 text-[#0b2230] shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
              <h3 className="text-[18px] text-[#0b2230]">
                <strong>НАШЕ ПРОСТРАНСТВО, ДЛЯ:</strong>
              </h3>
              <HeartList
                items={[
                  'активных и современных людей, которым хочется больше жизни, эмоций и близкого общения без формальностей и натянутости',
                  'тех, кто устал от шаблонных встреч и бесконечных экранов телефона и телевизора',
                  'тех, кто хочет настоящих впечатлений, лёгкости и искренних связей',
                ]}
              />
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-white p-6 shadow-[0_20px_45px_rgba(0,0,0,0.08)]">
            <h3 className="text-[22px] text-[#4b0f1c]">
              Что такое <strong>ПРОСТРАНСТВО «ПОЛОВИНКА УСПЕХА»?</strong>
            </h3>
            <p className="mt-4">
              Это пространство живых встреч - вечера, выезды, мастер-классы,
              игры, прогулки, автоквесты, путешествия. Мы объединяем людей,
              которые хотят проводить время интересно и по-настоящему:
              улыбаться, смеяться, открываться, вдохновляться, учиться новому и
              наполняться энергией общения. Здесь нет цели «кого-то найти», зато
              часто случаются новые дружбы, тёплые связи и даже истории, с
              которых начинается что-то большее.
            </p>
          </div>

          <div className="grid gap-6 mt-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-[linear-gradient(145deg,#4b101b_0%,#6b1f2a_55%,#7b2a35_100%)] p-6 text-white shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
              <h3 className="text-[18px] text-white">
                <strong>Что получает участник нашего ПРОСТРАНСТВА:</strong>
              </h3>
              <HeartList
                items={[
                  'атмосферу лёгкости, принятия и живого интереса',
                  'ощущение сопричастности и «своей стаи»',
                  'новые впечатления, вдохновение и энергию жизни',
                  'возможность раскрыться, почувствовать себя естественно и уверенно',
                  'расширение круга общения - органично, без давления и формальностей',
                ]}
                double
              />
            </div>
            <div className="rounded-3xl bg-[linear-gradient(145deg,#3aa3e0_0%,#4fb0e8_55%,#6bc2f0_100%)] p-6 text-[#0b2230] shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
              <h3 className="text-[18px] text-[#0b2230]">
                <strong>ПОЧЕМУ ЛЮДИ ПРИХОДЯТ В НАШЕ ПРОСТРАНСТВО:</strong>
              </h3>
              <HeartList
                items={reasonsItems.map(
                  (item) => `${item.label}: ${item.text}`
                )}
                renderItem={(item) => {
                  const [label, ...rest] = item.split(': ')
                  return (
                    <>
                      <strong>{label}</strong>: {rest.join(': ')}
                    </>
                  )
                }}
              />
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-white p-7 shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
            <h3 className="text-[18px] text-[#4b0f1c]">
              <strong>КОГДА ЛЮДИ ПРИХОДЯТ В НАШЕ ПРОСТРАНСТВО:</strong>
            </h3>
            <HeartList
              items={[
                'Когда хочется добавить в жизнь лёгкости, новых эмоций и спонтанных встреч',
                'Когда наступает момент «я всё делаю правильно, но хочу чувствовать больше»',
                'Когда появляется желание жить ярче — не меняя всё вокруг, а просто меняя пространство, в котором ты общаешься',
              ]}
            />
          </div>

          <div className="mt-8">
            <h3 className="text-[22px] text-[#4b0f1c]">
              <strong>ПРОСТРАНСТВО В ЦИФРАХ ЗА 4 ГОДА:</strong>
            </h3>
            <div className="grid gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.number}
                  className="rounded-2xl bg-white p-6 shadow-[0_16px_30px_rgba(0,0,0,0.08)]"
                >
                  <div className="font-adleryProSwash text-[clamp(40px,5vw,64px)] text-[#6b1f2a]">
                    {stat.number}
                  </div>
                  <div className="mt-2 font-futura text-[18px] leading-relaxed">
                    {stat.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="team" title="Наша команда!">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_14px_28px_rgba(0,0,0,0.08)]"
              >
                <img
                  src={member.photo}
                  alt={member.name}
                  className="h-[72px] w-[72px] rounded-full border-2 border-[#4fb0e8] object-cover"
                />
                <div>
                  <div className="text-[18px] font-semibold">{member.name}</div>
                  <div className="text-[#555]">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="spaces" title="Пространство мероприятий">
          <div className="mb-5 text-[16px] text-[#3d2a2f]">
            Выберите пространство, которое откликается именно вам, или откройте
            все сразу.
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            <FilterButton
              active={activeSpace === 'all'}
              onClick={() => setActiveSpace('all')}
            >
              Все пространства
            </FilterButton>
            {spaces.map((space) => (
              <FilterButton
                key={space.id}
                active={activeSpace === space.id}
                onClick={() => setActiveSpace(space.id)}
              >
                {space.title}
              </FilterButton>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSpaces.map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </div>
        </Section>

        <Section id="services" title="Пространство товаров и услуг">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </Section>

        <Section id="closed" title="Закрытое пространство">
          <div className="rounded-[26px] bg-[linear-gradient(140deg,rgba(79,176,232,0.2),rgba(111,29,43,0.08))] p-8 leading-relaxed">
            <h3 className="text-[22px] text-[#6b1f2a]">
              ЗАКРЫТОЕ ПРОСТРАНСТВО ДЛЯ СВОИХ
            </h3>
            <p className="mt-3">
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
            <div className="rounded-2xl bg-white p-6 shadow-[0_16px_30px_rgba(0,0,0,0.08)]">
              <div className="mb-4 flex items-center justify-between font-semibold text-[#6b1f2a]">
                <span>ФЕВРАЛЬ 2026</span>
                <span className="text-[12px] text-[#566]">
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
                            ? 'border-[rgba(79,176,232,0.5)] bg-[rgba(79,176,232,0.2)] text-[#245c7b]'
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

            <div className="rounded-2xl bg-white p-6 shadow-[0_16px_30px_rgba(0,0,0,0.08)]">
              <h3 className="text-[#6b1f2a]">События на {activeDay} февраля</h3>
              {eventsForDay.length === 0 ? (
                <p className="mt-3 text-[#666]">
                  На выбранную дату нет мероприятий. Выберите активную дату.
                </p>
              ) : (
                <div className="grid gap-3 mt-4">
                  {eventsForDay.map((event) => (
                    <div
                      key={event.title}
                      className="rounded-2xl bg-[rgba(79,176,232,0.12)] p-4"
                    >
                      <div className="font-semibold">{event.title}</div>
                      <div className="mt-1 flex justify-between text-[#2f586f]">
                        <span>{event.time}</span>
                        <span>{event.place}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Section>

        <Section id="reviews" title="Наши отзывы">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <div
                key={review.name}
                className="flex gap-3 rounded-2xl bg-white p-5 shadow-[0_14px_28px_rgba(0,0,0,0.08)]"
              >
                <img
                  src={review.photo}
                  alt={review.name}
                  className="h-16 w-16 rounded-full border-2 border-[#4fb0e8] object-cover"
                />
                <div>
                  <p className="leading-relaxed">{review.text}</p>
                  <span className="mt-2 block font-semibold text-[#4b0f1c]">
                    {review.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="contacts" title="Наши контакты и соц. Сети">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-[0_14px_28px_rgba(0,0,0,0.08)]">
              <h3>Свяжитесь с нами</h3>
              <p className="mt-2">Телефон: +7 (999) 123-45-67</p>
              <p>Email: hello@polovinka-uspeha.ru</p>
              <p>Город: Красноярск</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-[0_14px_28px_rgba(0,0,0,0.08)]">
              <h3>Мы в соцсетях</h3>
              <p className="mt-2">Instagram: @polovinka_uspeha</p>
              <p>Telegram: @polovinka_uspeha</p>
              <p>VK: vk.com/polovinka_uspeha</p>
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
        <h2 className="font-lora text-[clamp(26px,3vw,38px)] text-[#6b1f2a]">
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

function HeartList({ items, double = false, renderItem }) {
  return (
    <ul className="mt-3 grid gap-3 font-futura text-[18px] leading-relaxed">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <img
            src="/img/logo_heart_16x20px.png"
            alt=""
            className="w-5 h-5 mt-1"
          />
          <span className="flex-1">
            {renderItem ? renderItem(item) : item}
          </span>
          {double ? (
            <img
              src="/img/logo_heart_16x20px.png"
              alt=""
              className="w-5 h-5 mt-1"
            />
          ) : null}
        </li>
      ))}
    </ul>
  )
}

HeartList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  double: PropTypes.bool,
  renderItem: PropTypes.func,
}

function SpaceCard({ space }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_16px_30px_rgba(0,0,0,0.08)]">
      <h3 className="text-[16px] text-[#6b1f2a]">{space.title}</h3>
      <p className="mt-2 text-[#4b3a40]">{space.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {space.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[rgba(79,176,232,0.15)] px-2 py-1 text-[12px] text-[#256184]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

SpaceCard.propTypes = {
  space: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
}

function ServiceCard({ service }) {
  return (
    <div
      className={`rounded-2xl p-6 shadow-[0_16px_30px_rgba(0,0,0,0.08)] ${
        service.accent
          ? 'bg-[linear-gradient(140deg,#6b1f2a,#8e2f3a)] text-white'
          : 'bg-white'
      }`}
    >
      <h3 className="text-[18px]">{service.title}</h3>
      <p className="mt-2">{service.description}</p>
    </div>
  )
}

ServiceCard.propTypes = {
  service: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    accent: PropTypes.bool,
  }).isRequired,
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      className={`rounded-full border px-3.5 py-2 text-[12px] uppercase tracking-[0.06em] transition ${
        active
          ? 'border-[#6b1f2a] bg-[#6b1f2a] text-white'
          : 'border-[rgba(107,31,42,0.25)] bg-white text-[#4b0f1c]'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

FilterButton.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}
