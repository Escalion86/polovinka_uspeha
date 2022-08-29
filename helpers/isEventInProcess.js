import getMinutesBetween from './getMinutesBetween'

const isEventInProcess = (event) => {
  const minutesBetween = getMinutesBetween(event.date)

  return minutesBetween >= 0 && minutesBetween <= event.duration
}
export default isEventInProcess
