import SiteSettings from '@models/SiteSettings'
import dbConnect from '@utils/dbConnect'

const fetchSiteSettings = async (user, location, params) => {
  try {
    const db = await dbConnect(location)
    if (!db) return { error: 'db error' }

    const siteSettings = await SiteSettings.find({}).lean()

    const fetchResult = {
      siteSettings: JSON.parse(JSON.stringify(siteSettings[0])),
    }

    return fetchResult
  } catch (error) {
    return {
      siteSettings: JSON.parse(JSON.stringify([])),
      error: JSON.parse(JSON.stringify(error)),
      mode: process.env.NODE_ENV,
      location,
    }
  }
}

export default fetchSiteSettings
