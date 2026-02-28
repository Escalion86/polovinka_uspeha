import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@server/authOptions'
import LocationRegisterClient from '../../_components/location/LocationRegisterClient'

export const metadata = {
  title: 'Регистрация - Половинка успеха',
}

export default async function LocationRegisterPage({ params, searchParams }) {
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

  return <LocationRegisterClient location={location} />
}
