const mergeEventsById = (current = [], incoming = []) => {
  if (!Array.isArray(current) || current.length === 0) {
    return Array.isArray(incoming) ? [...incoming] : []
  }

  if (!Array.isArray(incoming) || incoming.length === 0) {
    return [...current]
  }

  const map = new Map()
  current.forEach((event) => {
    if (event?._id) {
      map.set(String(event._id), event)
    }
  })

  incoming.forEach((event) => {
    if (event?._id) {
      map.set(String(event._id), { ...map.get(String(event._id)), ...event })
    }
  })

  return Array.from(map.values())
}

export default mergeEventsById
