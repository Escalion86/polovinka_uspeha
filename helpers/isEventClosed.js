const isEventClosed = (event) =>
  event?.status === 'closed' || (event?.blank && isEventExpired(event))

export default isEventClosed
