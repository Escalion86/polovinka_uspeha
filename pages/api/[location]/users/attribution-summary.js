import checkLocationValid from '@server/checkLocationValid'
import dbConnect from '@utils/dbConnect'

const pickTop = (mapObj, limit = 10) =>
  Object.entries(mapObj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }))

const normalizeAttribution = (attr) => {
  if (!attr) return null

  const source = attr.get ? attr.get('utm_source') : attr.utm_source
  const medium = attr.get ? attr.get('utm_medium') : attr.utm_medium
  const campaign = attr.get ? attr.get('utm_campaign') : attr.utm_campaign

  return {
    utm_source: source ? String(source) : null,
    utm_medium: medium ? String(medium) : null,
    utm_campaign: campaign ? String(campaign) : null,
  }
}

export default async function handler(req, res) {
  const { method, query } = req
  const location = query?.location

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res?.status(405).json({
      success: false,
      data: { error: { type: 'method_not_allowed', message: 'Method not allowed' } },
    })
  }

  if (!location || !checkLocationValid(location)) {
    return res?.status(400).json({
      success: false,
      data: { error: { type: 'invalid_location', message: 'Invalid location' } },
    })
  }

  try {
    const db = await dbConnect(location)
    if (!db) {
      return res?.status(500).json({
        success: false,
        data: { error: { type: 'db_error', message: 'db error' } },
      })
    }

    const users = await db
      .model('Users')
      .find({}, { attribution: 1, createdAt: 1 })
      .lean()

    const stats = {
      totalUsers: users.length,
      withAttribution: 0,
      withoutAttribution: 0,
      sources: {},
      mediums: {},
      campaigns: {},
    }

    users.forEach((user) => {
      const attr = normalizeAttribution(user?.attribution)
      if (!attr || (!attr.utm_source && !attr.utm_medium && !attr.utm_campaign)) {
        stats.withoutAttribution += 1
        return
      }

      stats.withAttribution += 1
      const sourceKey = attr.utm_source || '(no_source)'
      const mediumKey = attr.utm_medium || '(no_medium)'
      const campaignKey = attr.utm_campaign || '(no_campaign)'

      stats.sources[sourceKey] = (stats.sources[sourceKey] || 0) + 1
      stats.mediums[mediumKey] = (stats.mediums[mediumKey] || 0) + 1
      stats.campaigns[campaignKey] = (stats.campaigns[campaignKey] || 0) + 1
    })

    return res?.status(200).json({
      success: true,
      data: {
        location,
        totalUsers: stats.totalUsers,
        withAttribution: stats.withAttribution,
        withoutAttribution: stats.withoutAttribution,
        topSources: pickTop(stats.sources, 10),
        topMediums: pickTop(stats.mediums, 10),
        topCampaigns: pickTop(stats.campaigns, 10),
      },
    })
  } catch (error) {
    console.error('attribution-summary error', error)
    return res?.status(500).json({
      success: false,
      data: {
        error: {
          type: 'internal_error',
          message: 'Failed to load attribution summary',
        },
      },
    })
  }
}
