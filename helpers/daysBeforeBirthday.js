var daysBeforeBirthday = (birthday, dateNow = new Date()) => {
  if (!birthday) return undefined
  var today, bday, diff, days
  const [bDate, bTime] = birthday.split('T')
  const day = new Date(bDate).getDate() + (bTime !== '00:00:00.000Z' ? 1 : 0)
  const month = new Date(bDate).getMonth() + 1
  const tempDateNow = dateNow
  today = new Date(
    tempDateNow.getFullYear(),
    tempDateNow.getMonth(),
    tempDateNow.getDate()
  )
  bday = new Date(today.getFullYear(), month - 1, day)
  if (today.getTime() > bday.getTime()) {
    bday.setFullYear(bday.getFullYear() + 1)
  }
  diff = bday.getTime() - today.getTime()
  days = Math.floor(diff / (1000 * 60 * 60 * 24))
  return days
}

export default daysBeforeBirthday
