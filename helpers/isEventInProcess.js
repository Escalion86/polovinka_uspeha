import getDiffBetweenDates from './getDiffBetweenDates'
import getMinutesBetween from './getMinutesBetween'

const isEventInProcess = (event) => {
  // const minutesBetween = getMinutesBetween(event.date)
  return (
    getDiffBetweenDates(event.dateStart) >= 0 &&
    getDiffBetweenDates(event.dateEnd) <= 0
  )

  // return minutesBetween >= 0 && minutesBetween <= event.duration
}
export default isEventInProcess
