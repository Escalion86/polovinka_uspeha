const RARE_THRESHOLDS = [
  [20, 12, 7, 4, 2],
  [40, 25, 14, 8, 4],
  [50, 30, 18, 10, 5],
  [60, 35, 20, 12, 6],
  [80, 50, 28, 16, 8],
  [100, 60, 35, 20, 10],
]

export const EVENT_ACHIEVEMENTS_THRESHOLDS = RARE_THRESHOLDS

export const EVENT_ACHIEVEMENTS_CONFIG = [
  {
    key: 'activist',
    name: 'Активист',
    cause: 'Количество посещенных мероприятий',
    thresholds: RARE_THRESHOLDS[5],
    tag: null,
  },
  {
    key: 'gambler',
    name: 'Лудоман',
    cause: 'Количество посещенных мероприятий с тэгом "Азарт"',
    thresholds: RARE_THRESHOLDS[2],
    tag: 'азарт',
  },
  {
    key: 'traveler',
    name: 'Путешественник',
    cause: 'Количество посещенных мероприятий с тэгом "Путешествие"',
    thresholds: RARE_THRESHOLDS[0],
    tag: 'путешествие',
  },
  {
    key: 'tourist',
    name: 'Турист',
    cause: 'Количество посещенных мероприятий с тэгом "Поход"',
    thresholds: RARE_THRESHOLDS[0],
    tag: 'поход',
  },
  {
    key: 'healthy',
    name: 'ЗОЖник',
    cause: 'Количество посещенных мероприятий с тэгом "Здоровье"',
    thresholds: RARE_THRESHOLDS[2],
    tag: 'здоровье',
  },
  {
    key: 'boardGamer',
    name: 'Настольщик',
    cause: 'Количество посещенных мероприятий с тэгом "Настолки"',
    thresholds: RARE_THRESHOLDS[2],
    tag: 'настолки',
  },
  {
    key: 'evolutionist',
    name: 'Эволюционер',
    cause: 'Количество посещенных мероприятий с тэгом "Развитие"',
    thresholds: RARE_THRESHOLDS[0],
    tag: 'развитие',
  },
  {
    key: 'urbanist',
    name: 'Урбанист',
    cause: 'Количество посещенных мероприятий с тэгом "Город"',
    thresholds: RARE_THRESHOLDS[3],
    tag: 'город',
  },
  {
    key: 'dateLover',
    name: 'Рандевушник',
    cause: 'Количество посещенных мероприятий с тэгом "Свидание"',
    thresholds: RARE_THRESHOLDS[0],
    tag: 'свидание',
  },
  {
    key: 'questMaster',
    name: 'Загадочник',
    cause: 'Количество посещенных мероприятий с тэгом "Квест"',
    thresholds: RARE_THRESHOLDS[0],
    tag: 'квест',
  },
  {
    key: 'sportsman',
    name: 'Спортсмен',
    cause: 'Количество посещенных мероприятий с тэгом "Спорт"',
    thresholds: RARE_THRESHOLDS[1],
    tag: 'спорт',
  },
  {
    key: 'partygoer',
    name: 'Тусовщик',
    cause: 'Количество посещенных мероприятий с тэгом "Вечеринка"',
    thresholds: RARE_THRESHOLDS[0],
    tag: 'вечеринка',
  },
  {
    key: 'steamLover',
    name: 'Парильщик',
    cause: 'Количество посещенных мероприятий с тэгом "Баня"',
    thresholds: RARE_THRESHOLDS[1],
    tag: 'баня',
  },
  {
    key: 'walker',
    name: 'Гулёна',
    cause: 'Количество посещенных мероприятий с тэгом "Прогулка"',
    thresholds: RARE_THRESHOLDS[1],
    tag: 'прогулка',
  },
  {
    key: 'forestSpirit',
    name: 'Леший',
    cause: 'Количество посещенных мероприятий с тэгом "Природа"',
    thresholds: RARE_THRESHOLDS[3],
    tag: 'природа',
  },
  {
    key: 'psychic',
    name: 'Экстрасенс',
    cause: 'Количество посещенных мероприятий с тэгом "Эзотерика"',
    thresholds: RARE_THRESHOLDS[0],
    tag: 'эзотерика',
  },
  {
    key: 'movieCritic',
    name: 'Кинокритик',
    cause: 'Количество посещенных мероприятий с тэгом "Кино"',
    thresholds: RARE_THRESHOLDS[0],
    tag: 'кино',
  },
  {
    key: 'artist',
    name: 'АРТист',
    cause: 'Количество посещенных мероприятий с тэгом "Искусство"',
    thresholds: RARE_THRESHOLDS[0],
    tag: 'искусство',
  },
  {
    key: 'feaster',
    name: 'Пирушник',
    cause: 'Количество посещенных мероприятий с тэгом "Застолье"',
    thresholds: RARE_THRESHOLDS[1],
    tag: 'застолье',
  },
  {
    key: 'motherTeresa',
    name: 'Мать Тереза',
    cause: 'Количество посещенных мероприятий с тэгом "Благотворительность"',
    thresholds: RARE_THRESHOLDS[0],
    tag: 'благотворительность',
  },
  {
    key: 'freud',
    name: 'Зигмунд Фрейд',
    cause: 'Количество посещенных мероприятий с тэгом "Психология"',
    thresholds: RARE_THRESHOLDS[0],
    tag: 'психология',
  },
  {
    key: 'genius',
    name: 'Гений',
    cause: 'Количество посещенных мероприятий с тэгом "Квиз"',
    thresholds: RARE_THRESHOLDS[1],
    tag: 'квиз',
  },
]

export const normalizeEventTag = (tag) =>
  typeof tag === 'string' ? tag.trim().toLowerCase() : ''

export const calculateEventAchievementPlace = (value, thresholds) => {
  if (!thresholds || !Array.isArray(thresholds) || typeof value !== 'number') {
    return undefined
  }

  for (let index = 0; index < thresholds.length; index += 1) {
    const currentThreshold = thresholds[index]
    if (typeof currentThreshold === 'number' && currentThreshold <= value) {
      return index
    }
  }

  return undefined
}
