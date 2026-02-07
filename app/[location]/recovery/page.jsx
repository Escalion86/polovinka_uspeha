import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@server/authOptions'
import LocationRecovery3Client from '../../_components/location/LocationRecovery3Client'

export const metadata = {
  title: 'Восстановление пароля - Половинка успеха',
}

export default async function LocationRecoveryPage({ params }) {
  const session = await getServerSession(authOptions)
  const { location } = await params

  if (!location) {
    redirect('/')
  }

  if (session?.location && session.location !== location) {
    redirect(`/${session.location}/cabinet`)
  }

  if (session) {
    redirect(`/${location}/cabinet`)
  }

  return <LocationRecovery3Client location={location} />
}
