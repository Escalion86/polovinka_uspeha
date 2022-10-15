import getMinutesBetween from './getMinutesBetween'

const getEventDuration = (event) =>
  getMinutesBetween(event.dateStart, event.dateEnd)

export default getEventDuration
