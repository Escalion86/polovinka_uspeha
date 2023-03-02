import isUserAdmin from '@helpers/isUserAdmin'
import SiteSettings from '@models/SiteSettings'
import Users from '@models/Users'
import dbConnect from '@utils/dbConnect'

const fetchSiteSettings = async (user) => {
  try {
    const db = await dbConnect()

    const siteSettings = await SiteSettings.find({})

    const fetchResult = {
      siteSettings: JSON.parse(JSON.stringify(siteSettings[0])),
    }

    return fetchResult
  } catch (error) {
    return {
      siteSettings: [],
      error: JSON.parse(JSON.stringify(error)),
    }
  }
}

export default fetchSiteSettings
