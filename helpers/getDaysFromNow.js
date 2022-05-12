import getDaysBetween from './getDaysBetween'
import getNoun from './getNoun'

const getDaysFromNow = (date1, showNoun = true, showPrefix = true) => {
  if (showPrefix) {
    const result = getDaysBetween(date1, new Date(), false)
    const prefix = result < 0 ? 'прошло' : 'через'
    return `${prefix} ${Math.abs(result)} ${getNoun(
      result,
      'день',
      'дня',
      'дней',
      false
    )}`
  } else return getDaysBetween(date1, new Date(), showNoun)
}

export default getDaysFromNow
