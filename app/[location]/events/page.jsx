import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import LocationEventsClient from '../../_components/location/LocationEventsClient'
import buildPageProps from '@server/getServerSidePropsFunc'
import fetchProps from '@server/fetchProps'
import { authOptions } from '@server/authOptions'

export const metadata = {
  title: 'Мероприятия - ЦОЗ «Половинка успеха»',
}

export default async function LocationEventsPage({ params }) {
  const session = await getServerSession(authOptions)
  const { location } = await params

  if (!location) {
    redirect('/')
  }

  if (session) {
    redirect(`/${location}/cabinet`)
  }

  const props = await buildPageProps({
    session,
    fetcher: fetchProps,
    location,
    params: {
      additionalBlocks: false,
      events: false,
    },
  })

  return <LocationEventsClient {...props} />
}
