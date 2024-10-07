import isEventClosed from './isEventClosed'

const isEventActive = (event) =>
  (event?.status === 'active' || !event?.status) && !isEventClosed(event)

export default isEventActive
