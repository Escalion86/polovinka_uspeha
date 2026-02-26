import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import LocationLoginClient from '../../_components/location/LocationLoginClient'
import { authOptions } from '@server/authOptions'
import { isAuthDevOnlyUserAllowed } from '@server/authDevOnlyMode'

export const metadata = {
  title: 'Вход разработчика - Половинка успеха',
}

export default async function LocationDevLoginPage({ params }) {
  const session = await getServerSession(authOptions)
  const { location } = await params

  if (!location) {
    redirect('/')
  }

  if (session?.location && session.location !== location) {
    if (isAuthDevOnlyUserAllowed(session?.user)) {
      redirect(`/${session.location}/cabinet`)
    }
  }

  if (session?.user && isAuthDevOnlyUserAllowed(session.user)) {
    redirect(`/${location}/cabinet`)
  }

  return <LocationLoginClient location={location} forceDisableVkAuth />
}
