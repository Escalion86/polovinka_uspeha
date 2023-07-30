import { DAYS_OF_WEEK, MONTHS, MONTHS_FULL } from './constants'
import dateToDateTimeStr from './dateToDateTimeStr'

function formatEventDateTime(event, props = {}) {
  if (!event) return undefined

  const { dontShowDayOfWeek, fullWeek, showYear, fullMonth, weekInBrackets } =
    props

  const dateStart = dateToDateTimeStr(
    event.dateStart,
    !dontShowDayOfWeek,
    fullMonth,
    showYear,
    true,
    fullWeek
  )
  const dateEnd = dateToDateTimeStr(
    event.dateEnd,
    !dontShowDayOfWeek,
    fullMonth,
    showYear,
    true,
    fullWeek
  )
  var date = ''
  if (
    dateStart[0] === dateEnd[0] &&
    dateStart[1] === dateEnd[1] &&
    dateStart[3] === dateEnd[3]
  ) {
    date = `${dateStart[0]} ${dateStart[1]} ${
      weekInBrackets ? `(${dateStart[2]})` : dateStart[2]
    } ${dateStart[4]}:${dateStart[5]} - ${dateEnd[4]}:${dateEnd[5]}`
  } else {
    date = `${dateStart[0]} ${dateStart[1]} ${
      weekInBrackets ? `(${dateStart[2]})` : dateStart[2]
    } ${dateStart[4]}:${dateStart[5]} - ${dateEnd[0]} ${dateEnd[1]} ${
      weekInBrackets ? `(${dateEnd[2]})` : dateEnd[2]
    } ${dateEnd[4]}:${dateEnd[5]}`
  }
  return date
}

export default formatEventDateTime
