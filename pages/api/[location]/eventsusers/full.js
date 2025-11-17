import checkLocationValid from '@server/checkLocationValid'
import dbConnect from '@utils/dbConnect'

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

    const eventsUsers = await db.model('EventsUsers').aggregate([
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
      { $unwind: { path: '$event', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'userObjectId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          eventId: 1,
          userId: 1,
          status: 1,
          userStatus: 1,
          comment: 1,
          likes: 1,
          seeLikesResult: 1,
          likeSortNum: 1,
          subEventId: 1,
          createdAt: 1,
          updatedAt: 1,
          event: {
            _id: '$event._id',
            title: '$event.title',
            dateStart: '$event.dateStart',
            dateEnd: '$event.dateEnd',
            status: '$event.status',
            subEvents: '$event.subEvents',
          },
          user: {
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
    ])

    return res?.status(200).json({ success: true, data: eventsUsers })
  } catch (error) {
    console.error('Failed to fetch events users with details', error)
    return res
      ?.status(500)
      .json({ success: false, error: 'Failed to load events users' })
  }
}
