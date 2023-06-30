import {
  DAYS_OF_WEEK,
  DAYS_OF_WEEK_FULL,
  MONTHS,
  MONTHS_FULL,
} from './constants'

const dateToDateTimeStr = (
  date,
  showDayOfWeek = true,
  fullMonth,
  showYear = true,
  fullSeparete = false,
  dayOfWeekFull = false
) => {
  var d = new Date(date),
    minutes = '' + d.getMinutes(),
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

export default dateToDateTimeStr
