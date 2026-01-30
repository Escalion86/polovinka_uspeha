'use client'

import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import styles from './index2.module.css'

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
    description:
      'Творческие форматы: от кулинарных вечеров до арт-практик.',
    tags: ['творчество', 'новые навыки', 'легкость'],
  },
  {
    id: 'games',
    title: 'ИГРОВЫЕ ВСТРЕЧИ',
    description:
      'Настолки, городские игры и динамичные командные форматы.',
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
    text:
      'благотворительных мероприятий направленных на помощь животным, детям и домам престарелых',
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
  { id: 'about', label: 'О нашем пространстве!' },
  { id: 'team', label: 'Наша команда!' },
  { id: 'spaces', label: 'Пространство мероприятий' },
  { id: 'services', label: 'Пространство товаров и услуг' },
  { id: 'closed', label: 'Закрытое пространство' },
  { id: 'announcements', label: 'Анонс наших мероприятий' },
  { id: 'reviews', label: 'Наши отзывы' },
  { id: 'contacts', label: 'Наши контакты и соц. Сети' },
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
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <img
              src="/img/logo_horizontal.png"
              alt="Логотип Половинка успеха"
              className={styles.brandLogo}
            />
            <span className={styles.brandText}>ПОЛОВИНКА УСПЕХА</span>
          </div>
          <button
            type="button"
            className={styles.burger}
            aria-label="Открыть меню"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
          <nav className={styles.nav} data-open={menuOpen}>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={styles.navLink}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/login"
              className={styles.navCta}
              onClick={() => setMenuOpen(false)}
            >
              Войти в пространство!
            </Link>
          </nav>
          <button
            type="button"
            className={styles.menuOverlay}
            data-open={menuOpen}
            aria-hidden={!menuOpen}
            onClick={() => setMenuOpen(false)}
          />
        </div>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroSplit}>
            <div className={styles.heroLeft}>
              <div className={styles.heroAccent} />
              <div className={styles.heroTag}>ПРОСТРАНСТВО ЖИВЫХ ВСТРЕЧ</div>
              <h1 className={styles.heroTitle}>
                ПРОСТРАНСТВО ЛЁГКОСТИ И ЖИВОГО ОБЩЕНИЯ
              </h1>
              <p className={styles.heroSubtitle}>
                Здесь можно быть собой, отдыхать от суеты и дел, наслаждаться
                общением и открывать новых людей естественно, без ожиданий и
                масок.
              </p>
            </div>
            <div className={styles.heroRight}>
              <div className={styles.marquee} aria-hidden="true">
                <div className={styles.marqueeTrack}>
                  {[...heroImages, ...heroImages].map((src, index) => (
                    <img
                      key={`${src}-${index}`}
                      src={src}
                      alt=""
                      className={styles.marqueeImage}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.heroLogoWrap}>
                <img
                  src="/img/logo.png"
                  alt="Половинка успеха"
                  className={styles.heroLogo}
                />
              </div>
            </div>
          </div>
          <div className={styles.heroText}>
            <p className={styles.heroLead}>
              <strong>
                ПРОСТРАНСТВО ЖИВЫХ ВСТРЕЧ «ПОЛОВИНКА УСПЕХА»
              </strong>{' '}
              - это пространство лёгкости и живого общения. Мы создаём
              атмосферу, где можно просто быть собой, отдыхать от суеты и дел,
              наслаждаться общением и открывать для себя новых людей естественно,
              без ожиданий и масок.
            </p>
            <Link href="/login" className={styles.primaryButton}>
              Присоединиться к нам
            </Link>
          </div>
        </section>

        <Section id="about" title="О нашем пространстве!">
          <div className={styles.textBlock}>
            <p>
              Каждый день похож на предыдущий: работа, заботы, спорт, домашние
              дела, дети, редкие встречи с друзьями. Жизнь вроде идёт, но чего-то
              не хватает тепла, спонтанности, человеческого контакта. Тебе
              хочется просто расслабиться и побыть среди «своих» самим собой, где
              не нужно играть роли и подбирать слова?
            </p>
            <p>
              <strong>
                ПРОСТРАНСТВО ЖИВЫХ ВСТРЕЧ «ПОЛОВИНКА УСПЕХА»
              </strong>{' '}
              — это пространство лёгкости и живого общения.
            </p>
          </div>

          <div className={styles.gridTwo}>
            <div className={`${styles.card} ${styles.cardBurgundy}`}>
              <h3 className={styles.cardTitle}>
                <strong>УЖЕ БОЛЕЕ ЧЕТЫРЕХ ЛЕТ МЫ СОЗДАЁМ АТМОСФЕРУ, ГДЕ МОЖНО:</strong>
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
            <div className={`${styles.card} ${styles.cardBlue}`}>
              <h3 className={styles.cardTitle}>
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

          <div className={styles.textBlock}>
            <h3 className={styles.sectionSubtitle}>
              Что такое <strong>ПРОСТРАНСТВО «ПОЛОВИНКА УСПЕХА»?</strong>
            </h3>
            <p>
              Это пространство живых встреч - вечера, выезды, мастер-классы,
              игры, прогулки, автоквесты, путешествия. Мы объединяем людей,
              которые хотят проводить время интересно и по-настоящему: улыбаться,
              смеяться, открываться, вдохновляться, учиться новому и наполняться
              энергией общения. Здесь нет цели «кого-то найти», зато часто
              случаются новые дружбы, тёплые связи и даже истории, с которых
              начинается что-то большее.
            </p>
          </div>

          <div className={styles.gridTwo}>
            <div className={`${styles.card} ${styles.cardBurgundy}`}>
              <h3 className={styles.cardTitle}>
                <strong>Что получает участник нашего ПРОСТРАНСТВА:</strong>
              </h3>
              <ul className={styles.simpleList}>
                <li>атмосферу лёгкости, принятия и живого интереса;</li>
                <li>ощущение сопричастности и «своей стаи»;</li>
                <li>новые впечатления, вдохновение и энергию жизни;</li>
                <li>возможность раскрыться, почувствовать себя естественно и уверенно;</li>
                <li>расширение круга общения - органично, без давления и формальностей.</li>
              </ul>
            </div>
            <div className={`${styles.card} ${styles.cardBlue}`}>
              <h3 className={styles.cardTitle}>
                <strong>ПОЧЕМУ ЛЮДИ ПРИХОДЯТ В НАШЕ ПРОСТРАНСТВО:</strong>
              </h3>
              <HeartList
                items={[
                  'Сбалансированные форматы: мероприятия под настроение от камерных игр до выездов на природу',
                  'Тонкая модерация: ведущие создают атмосферу вовлечённости и лёгкости, помогая каждому раскрыться',
                  'Аудитория по ценностям: здесь собираются люди, близкие по взглядам, стилю жизни и внутренней культуре',
                  'Удобное участие: всё просто - выбрать событие, зарегистрироваться, прийти и быть собой',
                ]}
              />
            </div>
          </div>

          <div className={styles.cardWide}>
            <h3 className={styles.cardTitle}>
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

          <div className={styles.statsSection}>
            <h3 className={styles.sectionSubtitle}>
              <strong>ПРОСТРАНСТВО В ЦИФРАХ ЗА 4 ГОДА:</strong>
            </h3>
            <div className={styles.statsGrid}>
              {stats.map((stat) => (
                <StatCard key={stat.number} number={stat.number} text={stat.text} />
              ))}
            </div>
          </div>
        </Section>

        <Section id="team" title="Наша команда!">
          <div className={styles.teamGrid}>
            {teamMembers.map((member) => (
              <TeamCard
                key={member.name}
                name={member.name}
                role={member.role}
                photo={member.photo}
              />
            ))}
          </div>
        </Section>

        <Section id="spaces" title="Пространство мероприятий">
          <div className={styles.sectionLead}>
            Выберите пространство, которое откликается именно вам, или откройте
            все сразу.
          </div>
          <div className={styles.filterRow}>
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
          <div className={styles.spaceGrid}>
            {filteredSpaces.map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </div>
        </Section>

        <Section id="services" title="Пространство товаров и услуг">
          <div className={styles.serviceGrid}>
            {services.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </Section>

        <Section id="closed" title="Закрытое пространство">
          <div className={styles.closedBlock}>
            <h3 className={styles.closedTitle}>ЗАКРЫТОЕ ПРОСТРАНСТВО ДЛЯ СВОИХ</h3>
            <p>
              Это формат с камерными встречами, где мы собираем небольшие группы
              по ценностям. Здесь больше глубины, доверия и долгих разговоров.
              Доступ открывается после знакомства с командой и участия в открытых
              мероприятиях.
            </p>
            <Link href="/login" className={styles.secondaryButton}>
              Узнать условия доступа
            </Link>
          </div>
        </Section>

        <Section id="announcements" title="Анонс наших мероприятий">
          <div className={styles.announcements}>
            <div className={styles.calendar}>
              <div className={styles.calendarHeader}>
                <span>ФЕВРАЛЬ 2026</span>
                <span className={styles.calendarHint}>
                  Активные даты выделены
                </span>
              </div>
              <div className={styles.calendarGrid}>
                {calendarDays.map((day) => {
                  const isActive = activeDays.includes(day)
                  const isSelected = activeDay === day
                  return (
                    <button
                      key={day}
                      type="button"
                      className={styles.calendarDay}
                      data-active={isActive}
                      data-selected={isSelected}
                      onClick={() => isActive && setActiveDay(day)}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className={styles.eventsList}>
              <h3 className={styles.eventsTitle}>
                События на {activeDay} февраля
              </h3>
              {eventsForDay.length === 0 ? (
                <p className={styles.eventsEmpty}>
                  На выбранную дату нет мероприятий. Выберите активную дату.
                </p>
              ) : (
                eventsForDay.map((event) => (
                  <EventCard key={event.title} event={event} />
                ))
              )}
            </div>
          </div>
        </Section>

        <Section id="reviews" title="Наши отзывы">
          <div className={styles.reviewGrid}>
            {reviews.map((review) => (
              <ReviewCard key={review.name} review={review} />
            ))}
          </div>
        </Section>

        <Section id="contacts" title="Наши контакты и соц. Сети">
          <div className={styles.contactsGrid}>
            <div className={styles.contactCard}>
              <h3>Свяжитесь с нами</h3>
              <p>Телефон: +7 (999) 123-45-67</p>
              <p>Email: hello@polovinka-uspeha.ru</p>
              <p>Город: Красноярск</p>
            </div>
            <div className={styles.contactCard}>
              <h3>Мы в соцсетях</h3>
              <p>Instagram: @polovinka_uspeha</p>
              <p>Telegram: @polovinka_uspeha</p>
              <p>VK: vk.com/polovinka_uspeha</p>
            </div>
          </div>
        </Section>
      </main>
    </div>
  )
}

function Section({ id, title, children }) {
  return (
    <section id={id} className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
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

function HeartList({ items }) {
  return (
    <ul className={styles.heartList}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

HeartList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
}

function StatCard({ number, text }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statNumber}>{number}</div>
      <div className={styles.statText}>{text}</div>
    </div>
  )
}

StatCard.propTypes = {
  number: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
}

function TeamCard({ name, role, photo }) {
  return (
    <div className={styles.teamCard}>
      <img src={photo} alt={name} className={styles.teamPhoto} />
      <div className={styles.teamInfo}>
        <div className={styles.teamName}>{name}</div>
        <div className={styles.teamRole}>{role}</div>
      </div>
    </div>
  )
}

TeamCard.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  photo: PropTypes.string.isRequired,
}

function SpaceCard({ space }) {
  return (
    <div className={styles.spaceCard}>
      <h3 className={styles.spaceTitle}>{space.title}</h3>
      <p className={styles.spaceDescription}>{space.description}</p>
      <div className={styles.spaceTags}>
        {space.tags.map((tag) => (
          <span key={tag} className={styles.spaceTag}>
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
    <div className={styles.serviceCard} data-accent={service.accent || false}>
      <h3 className={styles.serviceTitle}>{service.title}</h3>
      <p className={styles.serviceDescription}>{service.description}</p>
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

function ReviewCard({ review }) {
  return (
    <div className={styles.reviewCard}>
      <img src={review.photo} alt={review.name} className={styles.reviewPhoto} />
      <div className={styles.reviewBody}>
        <p className={styles.reviewText}>{review.text}</p>
        <span className={styles.reviewName}>{review.name}</span>
      </div>
    </div>
  )
}

ReviewCard.propTypes = {
  review: PropTypes.shape({
    name: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
  }).isRequired,
}

function EventCard({ event }) {
  return (
    <div className={styles.eventCard}>
      <div className={styles.eventTitle}>{event.title}</div>
      <div className={styles.eventMeta}>
        <span>{event.time}</span>
        <span>{event.place}</span>
      </div>
    </div>
  )
}

EventCard.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    place: PropTypes.string.isRequired,
  }).isRequired,
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      className={styles.filterButton}
      data-active={active}
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
