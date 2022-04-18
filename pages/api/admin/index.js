import dbConnect from '@utils/dbConnect'
import Courses from '@models/Courses'
import Chapters from '@models/Chapters'
import Lectures from '@models/Lectures'
import Users from '@models/Users'
import Notifications from '@models/Notifications'
import UsersNotifications from '@models/UsersNotifications'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const { method } = req

  await dbConnect()

  // console.log('1')
  // const session = await getSession({ req })
  // console.log('2')
  // if (!session || !session.user._id)
  //   return res?.status(400).json({ success: false })
  // console.log('3')
  // const { user } = session
  // console.log(`user`, user)

  switch (method) {
    case 'GET':
      try {
        const courses = await Courses.find({})
        const chapters = await Chapters.find({})
        const lectures = await Lectures.find({})
        const users = await Users.find({})

        // const seenUserNotifications = await UsersNotifications.find({
        //   userId: user._id,
        // })
        // const arrayOfIdsSeenUserNotifications = seenUserNotifications.map(
        //   (note) => note.notificationId
        // )

        // const notifications = await Notifications.find({
        //   _id: { $nin: arrayOfIdsSeenUserNotifications },
        //   responsibleUserId: { $ne: user._id },
        // })
        res.status(200).json({
          success: true,
          data: {
            courses,
            chapters,
            lectures,
            users,
          },
        })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    // case 'POST':
    //   try {
    //     const product = await Products.create(
    //       req.body
    //     ) /* create a new model in the database */
    //     res.status(201).json({ success: true, data: product })
    //   } catch (error) {
    //     res.status(400).json({ success: false })
    //   }
    //   break
    default:
      res.status(400).json({ success: false })
      break
  }
}
