import EmailInvitationCourses from '@models/EmailInvitationCourses'
import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD(EmailInvitationCourses, req, res)
}
