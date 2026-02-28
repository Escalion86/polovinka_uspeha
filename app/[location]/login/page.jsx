import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import LocationLoginClient from '../../_components/location/LocationLoginClient'
import { authOptions } from '@server/authOptions'

export const metadata = {
  title: 'Вход в кабинет - Половинка успеха',
}

export default async function LocationLoginPage({ params, searchParams }) {
  const session = await getServerSession(authOptions)
  const { location } = await params
  const eventId = searchParams?.event

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

  return <LocationLoginClient location={location} />
}
