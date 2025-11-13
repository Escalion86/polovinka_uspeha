import buildPageProps from '@server/getServerSidePropsFunc'
import fetchProps from '@server/fetchProps'
import { authOptions } from '@server/authOptions'
import LocationUserClient from '../../../_components/location/LocationUserClient'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Половинка успеха - Пользователь',
}

export default async function LocationUserPage({ params }) {
  const session = await getServerSession(authOptions)
  const { location, id } = await params

  if (!location || !id) {
    redirect('/')
  }

  if (session?.user && (session.location !== location || !session.user?._id)) {
    return <LocationUserClient location={location} id={id} wrongSession />
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

  return <LocationUserClient {...props} id={id} />
}
