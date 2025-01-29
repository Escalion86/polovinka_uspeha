const isEventCanceled = (event) => {
  if (!event) return
  return event?.status === 'canceled'
}

export default isEventCanceled
