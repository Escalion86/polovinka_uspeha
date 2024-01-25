const getEventsYears = (events) => {
  const tempYears = []
  events.forEach((event) => {
    const date = new Date(event.dateStart)
    const eventYear = date.getFullYear()
    if (!tempYears.includes(eventYear)) tempYears.push(eventYear)
  })
  tempYears.sort((a, b) => a - b)
  return tempYears
}

export default getEventsYears
