import { getServerSession } from 'next-auth'
import { authOptions } from '@server/authOptions'
import checkLocationValid from '@server/checkLocationValid'
import dbConnect from '@utils/dbConnect'
import { completeGoogleCalendarAuth } from '@server/userGoogleCalendar'

const makeCabinetUrl = (location, status) =>
  `/${location}/cabinet/googleCalendarIntegration?gcalStatus=${status}`

export default async function handler(req, res) {
  const location = req?.query?.location
  const code = String(req?.query?.code || '').trim()
  const state = String(req?.query?.state || '').trim()

  if (!location || !checkLocationValid(location)) {
    return res.redirect('/krsk/cabinet/googleCalendarIntegration?gcalStatus=locationError')
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?._id) {
    return res.redirect(`/${location}/login`)
  }

  if (session.location !== location) {
    return res.redirect(makeCabinetUrl(session.location, 'locationMismatch'))
  }

  if (!code || !state) {
    return res.redirect(makeCabinetUrl(location, 'oauthError'))
  }

  const db = await dbConnect(location)
  if (!db) {
    return res.redirect(makeCabinetUrl(location, 'dbError'))
  }

  try {
    const result = await completeGoogleCalendarAuth({
      db,
      location,
      userId: String(session.user._id),
      code,
      state,
    })

    if (!result?.success) {
      return res.redirect(makeCabinetUrl(location, 'oauthError'))
    }

    return res.redirect(makeCabinetUrl(location, 'oauthSuccess'))
  } catch (error) {
    console.log('google-calendar callback error:', error)
    return res.redirect(makeCabinetUrl(location, 'oauthError'))
  }
}
