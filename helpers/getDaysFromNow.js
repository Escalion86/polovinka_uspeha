import getDaysBetween from './getDaysBetween'
import getNoun from './getNoun'

const getDaysFromNow = (date1, showNoun = true, showPrefix = true) => {
  if (showPrefix) {
    const result = getDaysBetween(date1, new Date(), false, true)
    if (result === 2) return 'послезавтра'
    if (result === 1) return 'завтра'
    if (result === 0) return 'сегодня'
    if (result === -1) return 'прошло сегодня'
    if (result === -2) return 'прошло вчера'
    if (result === -3) return 'прошло позавчера'

    const prefix = result < 0 ? 'прошло' : 'через'
    return `${prefix} ${result} ${getNoun(
      result < 0 ? result + 1 : result - 1,
      'день',
      'дня',
      'дней',
      false
    )}`
  } else return getDaysBetween(date1, new Date(), showNoun)
}

export default getDaysFromNow
