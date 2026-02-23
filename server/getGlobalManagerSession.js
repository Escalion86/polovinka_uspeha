import { getServerSession } from 'next-auth'
import { authOptions } from '@server/authOptions'
import isUserPresident from '@helpers/isUserPresident'

const getGlobalManagerSession = async (req, res) => {
  const session = req && res
    ? await getServerSession(req, res, authOptions)
    : await getServerSession(authOptions)
  const role = session?.user?.role
  const canManageGlobalContent = isUserPresident(role)

  return {
    session,
    canManageGlobalContent,
  }
}

export default getGlobalManagerSession
