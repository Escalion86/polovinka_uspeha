import checkLocationValid from '@server/checkLocationValid'
import dbConnect from '@utils/dbConnect'

const parseJson = (value) => {
  if (!value || typeof value !== 'string') return value
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

const parseDate = (value) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

export default async function handler(req, res) {
  const { query, method } = req
  const location = query?.location

  if (!location) {
    return res?.status(400).json({ success: false, error: 'No location' })
  }

  if (!checkLocationValid(location)) {
    return res
      ?.status(400)
      .json({ success: false, error: 'Invalid location' })
  }

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res
      ?.status(405)
      .json({ success: false, error: `Method ${method} Not Allowed` })
  }

  try {
    const db = await dbConnect(location)
    if (!db) {
      return res?.status(500).json({ success: false, error: 'db error' })
    }

    const periodStart = parseDate(query?.periodStart)
    const periodEnd = parseDate(query?.periodEnd)
    const filters = parseJson(query?.filters) || {}

    const match = {}
    if (periodStart) match['event.dateStart'] = { $gte: periodStart }
    if (periodEnd) match['event.dateEnd'] = { $lte: periodEnd }

    const statusFilter = filters?.status || {}
    const allowedStatuses = Object.keys(statusFilter).filter(
      (key) => statusFilter[key]
    )
    if (allowedStatuses.length === 0) {
      return res?.status(200).json({ success: true, data: [] })
    }
    if (allowedStatuses.length > 0) {
      match['user.status'] = { $in: allowedStatuses }
    }

    const genderFilter = filters?.gender || {}
    const allowedGenders = []
    if (genderFilter.male) allowedGenders.push('male')
    if (genderFilter.famale) allowedGenders.push('famale')
    if (genderFilter.null) allowedGenders.push('other')
    if (allowedGenders.length === 0) {
      return res?.status(200).json({ success: true, data: [] })
    }
    if (
      genderFilter.male ||
      genderFilter.famale ||
      genderFilter.null === true
    ) {
      const genderClauses = []
      if (genderFilter.male) genderClauses.push({ 'user.gender': 'male' })
      if (genderFilter.famale) genderClauses.push({ 'user.gender': 'famale' })
      if (genderFilter.null)
        genderClauses.push({ 'user.gender': { $nin: ['male', 'famale'] } })
      match.$or = genderClauses
    }

    const relationshipFilter = filters?.relationship || {}
    if (relationshipFilter.havePartner && !relationshipFilter.noPartner) {
      match['user.relationship'] = { $nin: [null, false, ''] }
    }
    if (!relationshipFilter.havePartner && relationshipFilter.noPartner) {
      match['user.relationship'] = { $in: [null, false, ''] }
    }

    const result = await db.model('EventsUsers').aggregate([
      {
        $addFields: {
          eventObjectId: {
            $cond: [
              { $regexMatch: { input: '$eventId', regex: '^[a-fA-F0-9]{24}$' } },
              { $toObjectId: '$eventId' },
              null,
            ],
          },
          userObjectId: {
            $cond: [
              { $regexMatch: { input: '$userId', regex: '^[a-fA-F0-9]{24}$' } },
              { $toObjectId: '$userId' },
              null,
            ],
          },
        },
      },
      {
        $lookup: {
          from: 'events',
          localField: 'eventObjectId',
          foreignField: '_id',
          as: 'event',
        },
      },
      { $unwind: { path: '$event', preserveNullAndEmptyArrays: false } },
      {
        $lookup: {
          from: 'users',
          localField: 'userObjectId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: false } },
      { $match: match },
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 },
          user: {
            $first: {
              _id: '$user._id',
              firstName: '$user.firstName',
              secondName: '$user.secondName',
              thirdName: '$user.thirdName',
              gender: '$user.gender',
              status: '$user.status',
              relationship: '$user.relationship',
              birthday: '$user.birthday',
              security: '$user.security',
            },
          },
        },
      },
      { $sort: { count: -1 } },
    ])

    const data = result.map((item) => ({
      userId: item._id,
      count: item.count,
      user: item.user,
    }))

    return res?.status(200).json({ success: true, data })
  } catch (error) {
    console.error('Failed to fetch users visits stats', error)
    return res?.status(500).json({
      success: false,
      error: 'Failed to load users visits stats',
    })
  }
}
