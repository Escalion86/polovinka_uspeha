import isEventCanceled from './isEventCanceled'
import isEventExpired from './isEventExpired'
import isEventInProcess from './isEventInProcess'

const eventStatus = (event) => {
  if (isEventCanceled(event)) return 'canceled'
  if (isEventExpired(event)) return 'finished'
  if (isEventInProcess(event)) return 'inProgress'
  return 'active'
}

export default eventStatus
