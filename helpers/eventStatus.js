import isEventCanceled from './isEventCanceled'
import isEventClosed from './isEventClosed'
import isEventExpired from './isEventExpired'
import isEventInProcess from './isEventInProcess'

const eventStatus = (event) => {
  if (isEventCanceled(event)) return 'canceled'
  if (isEventClosed(event)) return 'closed'
  if (isEventExpired(event)) return 'finished'
  if (isEventInProcess(event)) return 'inProgress'
  return 'active'
}

export default eventStatus
