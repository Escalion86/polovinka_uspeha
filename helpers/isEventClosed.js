import isEventExpired from './isEventExpired'

const isEventClosed = (event) => {
  if (!event) return
  return event?.status === 'closed' || (event?.blank && isEventExpired(event))
}

export default isEventClosed
