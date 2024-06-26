import getDiffBetweenDates from '@helpers/getDiffBetweenDates'

const isEventStartedOrExpired = (event) => {
  if (!event) return
  return getDiffBetweenDates(event.dateStart) >= 0
}

export default isEventStartedOrExpired
