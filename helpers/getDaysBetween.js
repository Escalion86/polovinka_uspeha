import getNoun from './getNoun'

const getDaysBetween = (
  date1,
  date2 = new Date(),
  showNoun = true,
  removeTime = false
) => {
  if (!date1) return null
  var difference = removeTime
    ? new Date(new Date(date1).toDateString()).getTime() -
      new Date(new Date().toDateString()).getTime()
    : new Date(date1).getTime() - new Date(date2).getTime()

  const result = Math.floor(difference / (1000 * 3600 * 24))
  if (showNoun) return getNoun(result, 'день', 'дня', 'дней', true)
  else return result
}

export default getDaysBetween
