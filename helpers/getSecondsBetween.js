const getSecondsBetween = (
  date1 = new Date(),
  date2 = new Date(),
  removeTime = false
) => {
  if (!date1) return null
  var difference = removeTime
    ? new Date(new Date(date1).toDateString()).getTime() -
      new Date(new Date().toDateString()).getTime()
    : new Date(date1).getTime() - new Date(date2).getTime()

  return Math.floor(difference / 1000)
}

export default getSecondsBetween
