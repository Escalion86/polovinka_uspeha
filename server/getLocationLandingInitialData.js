import dbConnect from '@utils/dbConnect'

const serializeLeanDoc = (doc) => {
  if (doc == null) return doc
  if (doc instanceof Date) return doc.toISOString()
  if (Array.isArray(doc)) return doc.map(serializeLeanDoc)
  if (typeof doc === 'object') {
    if (doc?.constructor?.name === 'ObjectId') return String(doc)
    return Object.entries(doc).reduce((acc, [key, value]) => {
      acc[key] = serializeLeanDoc(value)
      return acc
    }, {})
  }

  return doc
}

export default async function getLocationLandingInitialData(location) {
  const db = await dbConnect(location)
  if (!db) {
    return {
      directions: [],
      siteSettings: {},
    }
  }

  try {
    const [directions, siteSettingsList] = await Promise.all([
      db
        .model('Directions')
        .find({})
        .select({
          title: 1,
          shortDescription: 1,
          description: 1,
          images: 1,
          showOnSite: 1,
          index: 1,
        })
        .lean(),
      db
        .model('SiteSettings')
        .find({})
        .select({
          founder: 1,
          supervisor: 1,
          spaceStats: 1,
          closedSpace: 1,
          phone: 1,
          email: 1,
          whatsapp: 1,
          ok: 1,
          telegram: 1,
          instagram: 1,
          vk: 1,
        })
        .lean(),
    ])

    return {
      directions: serializeLeanDoc(Array.isArray(directions) ? directions : []),
      siteSettings: serializeLeanDoc(
        Array.isArray(siteSettingsList) && siteSettingsList.length > 0
          ? siteSettingsList[0]
          : {}
      ),
    }
  } catch (error) {
    console.log('getLocationLandingInitialData error:', error)
    return {
      directions: [],
      siteSettings: {},
    }
  }
}
