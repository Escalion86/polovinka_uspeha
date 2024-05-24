import getDiffBetweenDates from './getDiffBetweenDates'

const isEventInProcess = (event) => {
  if (!event) return
  return (
    getDiffBetweenDates(event.dateStart) >= 0 &&
    getDiffBetweenDates(event.dateEnd) <= 0
  )
}

export default isEventInProcess
