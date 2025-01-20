const getGoogleCalendarJSONByLocation = (location) => {
  if (location === 'ekb') return './google_calendar_tokens/ekb.json'
  if (location === 'krsk') return './google_calendar_tokens/krsk.json'
  if (location === 'nrsk') return './google_calendar_tokens/nrsk.json'
  else return
}

export default getGoogleCalendarJSONByLocation
