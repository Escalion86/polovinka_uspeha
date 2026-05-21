import checkLocationValid from '@server/checkLocationValid'
import refreshSignedUpEventsCount from '@server/refreshSignedUpEventsCount'
import dbConnect from '@utils/dbConnect'

export default async function handler(req, res) {
  const { query, method } = req

  const location = query?.location
  if (!location)
    return res?.status(400).json({ success: false, error: 'No location' })

  if (!checkLocationValid(location))
    return res?.status(400).json({ success: false, error: 'Invalid location' })

  const db = await dbConnect(location)
  if (!db) return res?.status(400).json({ success: false, error: 'db error' })

  if (method === 'GET') {
    try {
      const result = await refreshSignedUpEventsCount(location, {})

      return res?.status(result?.success ? 201 : 400).json(result)
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }

  return res?.status(400).json({ success: false, error: 'Wrong method' })
}

// const res = await db.model('EventsUsers').aggregate([
//   {
//     $match: {
//       eventId: { $nin: canceledEventsIds },
//       status: { $nin: ['reserve', 'ban'] },
//     },
//   },
//   {
//     $group: { _id: '$userId', total: { $sum: 1 } },
//   },
// ])

// const preparedRes = res.reduce(function (result, { _id, total }) {
//   result[_id] = total
//   return result
// }, {})

// users = users.map((user) => ({
//   ...user,
//   signedUpEventsCount: preparedRes[user._id] || 0,
// }))
