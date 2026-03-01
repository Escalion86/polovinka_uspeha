import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@server/authOptions'
import LocationRecoveryClient from '../../_components/location/LocationRecoveryClient'

export const metadata = {
  title: 'Восстановление пароля - Половинка успеха',
}

export default async function LocationRecoveryPage({ params, searchParams }) {
  const session = await getServerSession(authOptions)
  const { location } = await params
  const resolvedSearchParams = (await searchParams) || {}
  const eventId = resolvedSearchParams?.event

  if (!location) {
    redirect('/')
  }

  if (session?.location && session.location !== location) {
    redirect(`/${session.location}/cabinet`)
  }

  if (session) {
    if (eventId) {
      redirect(`/${location}/cabinet/eventsCalendar?event=${eventId}`)
    }
    redirect(`/${location}/cabinet`)
  }

  return <LocationRecoveryClient location={location} />
}
