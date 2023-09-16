import getNoun, {
  getNounDays,
  getNounHours,
  getNounMinutes,
  getNounMonths,
  getNounSeconds,
  getNounYears,
} from './getNoun'
import getSecondsBetween from './getSecondsBetween'

const getDataStringBetweenDates = (date1, date2) => {
  var diff = getSecondsBetween(date2, date1)
  var secs = Math.floor(diff)
  var mins = Math.floor(secs / 60)
  var hours = Math.floor(mins / 60)
  var days = Math.floor(hours / 24)
  var months = Math.floor(days / 31)
  var years = Math.floor(months / 12)
  months = Math.floor(months % 12)
  days = Math.floor(days % 31)
  hours = Math.floor(hours % 24)
  mins = Math.floor(mins % 60)
  secs = Math.floor(secs % 60)
  var message = []
  if (days <= 0) {
    message.push(getNounSeconds(secs))
    message.push(getNounMinutes(mins))
    message.push(getNounHours(hours))
  } else {
    message.push(getNounDays(days))
    if (months > 0 || years > 0) {
      message.push(getNounMonths(months))
    }
    if (years > 0) {
      message.push(getNounYears(years))
    }
  }
  return message.reverse().join(' ')
}

export default getDataStringBetweenDates
