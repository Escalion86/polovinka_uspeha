import checkLocationValid from '@server/checkLocationValid'
import dbConnect from '@utils/dbConnect'

export default async function refreshSignedUpEventsCount(
  location,
  { userId, usersIds, eventId }
) {
  if (!location) return { success: false, error: 'No location' }

  if (!checkLocationValid(location))
    return { success: false, error: 'Invalid location' }

  const db = await dbConnect(location)
  if (!db) return { success: false, error: 'db error' }

  try {
    const closedEventsIds = (
      await db.model('Events').find({ status: 'closed' }).lean()
    ).map(({ _id }) => String(_id))

    if (userId) {
      const user = await db.model('Users').findById(userId)

      if (!user) return { success: false, error: 'User not found' }

      const signedUpEventsCount = (
        await db.model('EventsUsers').find({
          userId: user._id,
          eventId: { $in: closedEventsIds },
          status: { $nin: ['reserve', 'ban'] },
        })
      ).length

      const updatedUser = await db
        .model('Users')
        .findByIdAndUpdate(userId, { signedUpEventsCount })

      return {
        success: true,
        data: updatedUser,
      }
    } else {
      const usersIdsToUpdate = usersIds
        ? usersIds
        : eventId
          ? (await db.model('EventsUsers').find({ eventId }).lean()).map(
              ({ userId }) => String(userId)
            )
          : (await db.model('Users').find({}).lean()).map(({ _id }) =>
              String(_id)
            )
      if (!usersIdsToUpdate?.length)
        return { success: true, data: 'No users to update' }

      const allUsersSignedUpEventsCountArray = await db
        .model('EventsUsers')
        .aggregate([
          {
            $match: {
              ...(usersIds || eventId
                ? { userId: { $in: usersIdsToUpdate } }
                : {}),
              eventId: { $in: closedEventsIds },
              status: { $nin: ['reserve', 'ban'] },
            },
          },
          {
            $group: { _id: '$userId', total: { $sum: 1 } },
          },
        ])
      let allUsersSignedUpEventsCountObject =
        allUsersSignedUpEventsCountArray.reduce((obj, item, index) => {
          obj[item._id] = item.total
          return obj
        }, {})

      for (const userId of usersIdsToUpdate) {
        await db.model('Users').findByIdAndUpdate(userId, {
          signedUpEventsCount: allUsersSignedUpEventsCountObject[userId] || 0,
        })
      }

      return {
        success: true,
        data: allUsersSignedUpEventsCountObject,
      }
    }
  } catch (error) {
    console.log(error)
    return { success: false, error }
  }
}
