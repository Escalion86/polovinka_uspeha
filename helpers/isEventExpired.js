import getDiffBetweenDates from './getDiffBetweenDates'
// import getMinutesBetween from './getMinutesBetween'

const isEventExpired = (event) => getDiffBetweenDates(event?.dateEnd) >= 0
// getMinutesBetween(event.date) >= (event.duration ?? 0)

export default isEventExpired
