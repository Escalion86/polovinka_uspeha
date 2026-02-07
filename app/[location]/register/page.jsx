import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@server/authOptions'
import LocationRegister3Client from '../../_components/location/LocationRegister3Client'

export const metadata = {
  title: 'Регистрация - Половинка успеха',
}

export default async function LocationRegisterPage({ params }) {
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

  return <LocationRegister3Client location={location} />
}
