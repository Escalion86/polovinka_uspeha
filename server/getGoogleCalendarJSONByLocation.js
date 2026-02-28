import path from 'path'

const getGoogleCalendarJSONByLocation = (location) => {
  if (location === 'ekb')
    return path.join(process.cwd(), 'google_calendar_tokens', 'ekb.json')
  if (location === 'krsk')
    return path.join(process.cwd(), 'google_calendar_tokens', 'krsk.json')
  if (location === 'nrsk')
    return path.join(process.cwd(), 'google_calendar_tokens', 'nrsk.json')
  else return
}

export default getGoogleCalendarJSONByLocation
