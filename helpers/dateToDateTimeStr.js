import { DAYS_OF_WEEK, MONTHS, MONTHS_FULL } from './constants'

const dateToDateTimeStr = (date, showDayOfWeek = true, fullMonth) => {
  var d = new Date(date),
    minutes = '' + d.getMinutes(),
    hours = '' + d.getHours(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    week = d.getDay(),
    year = d.getFullYear()

  if (minutes.length < 2) minutes = '0' + minutes
  if (hours.length < 2) hours = '0' + hours

  const strDateStart =
    day +
    ' ' +
    (fullMonth ? MONTHS_FULL[month - 1] : MONTHS[month - 1]) +
    ' ' +
    year.toString() +
    (showDayOfWeek ? ' ' + DAYS_OF_WEEK[week] : '')

  const strTimeStart = hours + ':' + minutes
  return [strDateStart, strTimeStart]
}

export default dateToDateTimeStr
