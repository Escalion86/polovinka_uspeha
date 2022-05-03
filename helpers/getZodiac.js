import { ZODIAC } from './constants'

const getZodiac = (date) => {
  if (!date) return undefined

  const d = new Date(date)
  const day = d.getDate()
  const month = d.getMonth() + 1
  // for (let i = 0; i < ZODIAC.length; i++) {
  return ZODIAC.find((zodiac) => {
    const from = zodiac.dateFrom.split('.')
    const to = zodiac.dateTo.split('.')
    const zodiacDayFrom = Number(from[0])
    const zodiacMonthFrom = Number(from[1])
    const zodiacDayTo = Number(to[0])
    const zodiacMonthTo = Number(to[1])
    return (
      (month === zodiacMonthFrom && day >= zodiacDayFrom) ||
      (month === zodiacMonthTo && day <= zodiacDayTo)
    )
  })
}

export default getZodiac
