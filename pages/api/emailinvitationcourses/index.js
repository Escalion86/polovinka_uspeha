import emailSend from '@helpers/emailSend'
import Courses from '@models/Courses'
import EmailInvitationCourses from '@models/EmailInvitationCourses'
import CRUD from '@server/CRUD'
import dbConnect from '@utils/dbConnect'

export default async function handler(req, res) {
  const { query, method, body } = req

  if (method === 'POST') {
    try {
      await dbConnect()
      console.log('body', body)
      const { email, courseId, role, sendEmail } = body
      const data = await EmailInvitationCourses.create({
        email,
        courseId,
        role,
      })
      if (!data) {
        return res?.status(400).json({ success: false })
      }
      if (sendEmail) {
        const course = await Courses.findOne({ _id: courseId })
        console.log('course', course)
        const urlToConfirm = `${process.env.NEXTAUTH_SITE}/course/${courseId}`
        // const domenName = new URL(process.env.NEXTAUTH_SITE).hostname
        const emailRes = await emailSend(
          email,
          `Приглашение на курс "${course.title}"`,
          `
            <h3><a href="${urlToConfirm}">Кликните по мне для просмотра курса "${course.title}"</a></h3>
          `
        )
      }

      return res?.status(201).json({ success: true, data })
      // return { newData: data, oldData }
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  } else {
    return await CRUD(EmailInvitationCourses, req, res)
  }
}
