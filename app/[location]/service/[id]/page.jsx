import buildPageProps from '@server/getServerSidePropsFunc'
import fetchProps from '@server/fetchProps'
import { authOptions } from '@server/authOptions'
import LocationServiceClient from '../../../_components/location/LocationServiceClient'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Половинка успеха - Услуга',
}

export default async function LocationServicePage({ params }) {
  const session = await getServerSession(authOptions)
  const { location, id } = await params

  if (!location || !id) {
    redirect('/')
  }

  if (session?.user && (session.location !== location || !session.user?._id)) {
    return <LocationServiceClient location={location} id={id} wrongSession />
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

  return <LocationServiceClient {...props} id={id} />
}
