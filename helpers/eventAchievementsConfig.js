const RARE_THRESHOLDS = [
  [20, 12, 7, 4, 2],
  [40, 25, 14, 8, 4],
  [50, 30, 18, 10, 5],
  [60, 35, 20, 12, 6],
  [80, 50, 28, 16, 8],
  [100, 60, 35, 20, 10],
]

export const EVENT_ACHIEVEMENTS_CONFIG = [
  {
    key: 'activist',
    name: 'Активист',
    cause: 'Количество посещенных мероприятий',
    thresholds: RARE_THRESHOLDS[5],
    metric: 'totalVisits',
  },
  {
    key: 'explorer',
    name: 'Исследователь',
    cause: 'Количество разных направлений, в которых вы были',
    thresholds: [15, 12, 9, 6, 3],
    metric: 'uniqueDirections',
  },
  {
    key: 'consistent',
    name: 'Постоянство',
    cause: 'Количество месяцев с посещенными мероприятиями',
    thresholds: [24, 18, 12, 8, 4],
    metric: 'activeMonths',
  },
  {
    key: 'weekender',
    name: 'Выходного дня',
    cause: 'Количество посещенных мероприятий в субботу и воскресенье',
    thresholds: RARE_THRESHOLDS[1],
    metric: 'weekendVisits',
  },
]

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
