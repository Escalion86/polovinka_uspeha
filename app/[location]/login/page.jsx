import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import LocationLoginClient from '../../_components/location/LocationLoginClient'
import buildPageProps from '@server/getServerSidePropsFunc'
import fetchSiteSettings from '@server/fetchSiteSettings'
import { authOptions } from '@server/authOptions'

export const metadata = {
  title: 'Вход в кабинет - Половинка успеха',
}

export default async function LocationLoginPage({ params }) {
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
    fetcher: fetchSiteSettings,
    location,
  })

  return <LocationLoginClient {...props} />
}
