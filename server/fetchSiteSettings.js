import SiteSettings from '@models/SiteSettings'
import dbConnect from '@utils/dbConnect'

const fetchSiteSettings = async (user) => {
  try {
    const db = await dbConnect()

    const siteSettings = await SiteSettings.find({}).lean()

    const fetchResult = {
      siteSettings: JSON.parse(JSON.stringify(siteSettings[0])),
    }

    return fetchResult
  } catch (error) {
    return {
      siteSettings: JSON.parse(JSON.stringify([])),
      error: JSON.parse(JSON.stringify(error)),
    }
  }
}

export default fetchSiteSettings
