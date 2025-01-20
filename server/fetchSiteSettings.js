import SiteSettings from '@models/SiteSettings'
import dbConnect from '@utils/dbConnect'
import getTelegramBotNameByLocation from './getTelegramBotNameByLocation'

const fetchSiteSettings = async (user, location, params) => {
  const telegramBotName = getTelegramBotNameByLocation(location)

  try {
    const db = await dbConnect(location)
    if (!db) return { error: 'db error' }

    const siteSettings = await SiteSettings.find({}).lean()

    const fetchResult = {
      siteSettings: JSON.parse(JSON.stringify(siteSettings[0])),
      mode: process.env.MODE,
      telegramBotName,
      location,
    }

    return fetchResult
  } catch (error) {
    return {
      siteSettings: JSON.parse(JSON.stringify([])),
      error: JSON.parse(JSON.stringify(error)),
      mode: process.env.MODE,
      telegramBotName,
      location,
    }
  }
}

export default fetchSiteSettings
