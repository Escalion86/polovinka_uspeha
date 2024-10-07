import isEventExpired from './isEventExpired'

const isEventClosed = (event) =>
  event?.status === 'closed' || (event?.blank && isEventExpired(event))

export default isEventClosed
