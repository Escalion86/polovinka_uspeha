import buildPageProps from '@server/getServerSidePropsFunc'
import fetchProps from '@server/fetchProps'
import { authOptions } from '@server/authOptions'
import LocationEventClient from '../../../_components/location/LocationEventClient'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Половинка успеха - Мероприятие',
}

export default async function LocationEventPage({ params }) {
  const session = await getServerSession(authOptions)
  const { location, id } = params

  if (!location || !id) {
    redirect('/')
  }

  if (session?.user && (session.location !== location || !session.user?._id)) {
    return <LocationEventClient location={location} id={id} wrongSession />
  }

  const props = await buildPageProps({
    session,
    fetcher: fetchProps,
    location,
    params: {
      additionalBlocks: false,
    },
  })

  return <LocationEventClient {...props} id={id} />
}
