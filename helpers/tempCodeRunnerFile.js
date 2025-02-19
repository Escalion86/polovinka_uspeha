export const MONTHS = [
  'янв',
  'фев',
  'мар',
  'апр',
  'май',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек',
]

export const MONTHS_FULL_1 = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
]

export const MONTHS_FULL = [
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

export const DAYS_OF_WEEK = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ']

export const DAYS_OF_WEEK_FULL = [
  'воскресенье',
  'понедельник',
  'вторник',
  'среда',
  'четверг',
  'пятница',
  'суббота',
]

const dateToDateTimeStr = (
  date,
  showDayOfWeek = true,
  fullMonth,
  showYear = true,
  fullSeparete = false,
  dayOfWeekFull = false,
  timeZone
) => {
  var d = new Date(date)
  if (timeZone) d = moment(date).tz(timeZone)
  var minutes = '' + d.getMinutes(),
    hours = '' + d.getHours(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    week = d.getDay(),
    year = d.getFullYear()

  if (minutes.length < 2) minutes = '0' + minutes
  if (hours.length < 2) hours = '0' + hours

  if (fullSeparete)
    return [
      day,
      MONTHS_FULL[month - 1],
      dayOfWeekFull ? DAYS_OF_WEEK_FULL[week] : DAYS_OF_WEEK[week],
      year.toString(),
      hours,
      minutes,
    ]

  const strDateStart =
    day +
    ' ' +
    (fullMonth ? MONTHS_FULL[month - 1] : MONTHS[month - 1]) +
    (showYear ? ' ' + year.toString() : '') +
    (showDayOfWeek
      ? ' ' + (dayOfWeekFull ? DAYS_OF_WEEK_FULL[week] : DAYS_OF_WEEK[week])
      : '')

  const strTimeStart = hours + ':' + minutes
  return [strDateStart, strTimeStart]
}

console.log(
  'object :>> ',
  dateToDateTimeStr(
    new Date(),
    true,
    true,
    true,
    false,
    false,
    'Asia/Yekaterinburg'
  )
)