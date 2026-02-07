import { redirect } from 'next/navigation'
import LocationIndexClient from '../_components/location/LocationIndexClient'

export const metadata = {
  title: 'Половинка успеха',
}

export default async function LocationRootPage({ params }) {
  const { location } = await params

  if (!location) {
    redirect('/')
  }

  return <LocationIndexClient location={location} />
}
