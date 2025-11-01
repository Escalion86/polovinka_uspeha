import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import LocationHomeClient from '../_components/location/LocationHomeClient'
import buildPageProps from '@server/getServerSidePropsFunc'
import fetchProps from '@server/fetchProps'
import { authOptions } from '@server/authOptions'

export default async function LocationPage({ params }) {
  const session = await getServerSession(authOptions)
  const { location } = params

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
      directions: { shortDescription: true },
    },
  })

  return <LocationHomeClient {...props} />
}
