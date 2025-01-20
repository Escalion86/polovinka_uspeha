const getGoogleCalendarConstantsByLocation = (location) => {
  if (location === 'krsk')
    return {
      calendarId: process.env.GOOGLE_CALENDAR_ID_KRSK,
      email: process.env.GOOGLE_CLIENT_EMAIL_KRSK,
      privateKey: process.env.GOOGLE_PRIVATE_KEY_KRSK,
      projectNumber: process.env.GOOGLE_PROJECT_NUMBER_KRSK,
    }
  if (location === 'nrsk')
    return {
      calendarId: process.env.GOOGLE_CALENDAR_ID_NRSK,
      email: process.env.GOOGLE_CLIENT_EMAIL_NRSK,
      privateKey: process.env.GOOGLE_PRIVATE_KEY_NRSK,
      projectNumber: process.env.GOOGLE_PROJECT_NUMBER_NRSK,
    }
  if (location === 'ekb')
    return {
      calendarId: process.env.GOOGLE_CALENDAR_ID_EKB,
      email: process.env.GOOGLE_CLIENT_EMAIL_EKB,
      privateKey: process.env.GOOGLE_PRIVATE_KEY_EKB,
      projectNumber: process.env.GOOGLE_PROJECT_NUMBER_EKB,
    }
  else return
}

export default getGoogleCalendarConstantsByLocation
