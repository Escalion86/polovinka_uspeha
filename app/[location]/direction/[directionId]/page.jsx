import buildPageProps from '@server/getServerSidePropsFunc'
import fetchProps from '@server/fetchProps'
import { authOptions } from '@server/authOptions'
import LocationDirectionClient from '../../../_components/location/LocationDirectionClient'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Пространство - ЦОЗ «Половинка успеха»',
}

export default async function LocationDirectionPage({ params }) {
  const session = await getServerSession(authOptions)
  const { location, directionId } = await params

  if (!location || !directionId) {
    redirect('/')
  }

  if (
    session?.user &&
    (session.location !== location || !session.user?._id)
  ) {
    return (
      <LocationDirectionClient
        location={location}
        directionId={directionId}
        wrongSession
      />
    )
  }

  const props = await buildPageProps({
    session,
    fetcher: fetchProps,
    location,
    params: {
      additionalBlocks: false,
      directions: { includeDescription: true },
    },
  })

  return <LocationDirectionClient {...props} directionId={directionId} />
}

