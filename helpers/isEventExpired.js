import getMinutesBetween from './getMinutesBetween'

const isEventExpired = (event) =>
  getMinutesBetween(event.date) >= (event.duration ?? 0)

export default isEventExpired
