const buildEventsQueryOptions = (eventsParam, now = new Date()) => {
  if (eventsParam === false) return null

  const option =
    eventsParam == null || eventsParam === true
      ? { mode: 'all' }
      : typeof eventsParam === 'string'
        ? { mode: eventsParam }
        : eventsParam

  const mode = option?.mode ?? 'all'
  const filter = {}

  if (mode === 'upcoming') {
    filter.$or = [
      { dateEnd: { $gte: now } },
      { dateEnd: null, dateStart: { $gte: now } },
      { dateEnd: null, dateStart: null },
    ]
  } else if (mode === 'past') {
    filter.$or = [
      { dateEnd: { $lt: now } },
      { dateEnd: null, dateStart: { $lt: now } },
    ]
  }

  const sort =
    option?.sort ?? (mode === 'past' ? { dateStart: -1, _id: -1 } : { dateStart: 1, _id: 1 })
  const limit =
    typeof option?.limit === 'number' && option.limit > 0 ? option.limit : undefined

  return { filter, sort, limit, mode }
}

export default buildEventsQueryOptions
