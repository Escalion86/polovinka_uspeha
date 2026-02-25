import { notFound, redirect } from 'next/navigation'
import LocationIndexClient from '../_components/location/LocationIndexClient'
import checkLocationValid from '@server/checkLocationValid'
import getCityPolicy from '@server/getCityPolicy'
import { getLocationTitle, getSiteUrl, getKnownLocations } from '@server/seo'
import getGlobalAboutSpaceCards from '@server/getGlobalAboutSpaceCards'
import getLocationLandingInitialData from '@server/getLocationLandingInitialData'

export const revalidate = 300
export const dynamicParams = false

export async function generateMetadata({ params }) {
  const { location } = await params
  if (!checkLocationValid(location)) {
    return {
      title: 'Город не найден',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const cityTitle = getLocationTitle(location)
  const siteUrl = getSiteUrl()
  const policyResult = await getCityPolicy(location)
  const policy = policyResult?.success ? policyResult.data?.policy : null
  const isIndexable = Boolean(policy?.allowPublicListing)
  const path = `/${location}`

  return {
    title: `${cityTitle} - Половинка успеха`,
    description: `Половинка успеха в городе ${cityTitle}: живые встречи, мероприятия и пространство легкого общения.`,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: 'website',
      url: `${siteUrl}${path}`,
      title: `Половинка успеха - ${cityTitle}`,
      description: `Офлайн-мероприятия и знакомства в ${cityTitle}.`,
      locale: 'ru_RU',
      siteName: 'Половинка успеха',
    },
    robots: {
      index: isIndexable,
      follow: isIndexable,
    },
  }
}

export function generateStaticParams() {
  return getKnownLocations().map((location) => ({ location }))
}

export default async function LocationRootPage({ params }) {
  const { location } = await params

  if (!location) {
    redirect('/')
  }
  if (!checkLocationValid(location)) {
    notFound()
  }

  const [initialGlobalAboutSpaceCards, initialData] = await Promise.all([
    getGlobalAboutSpaceCards(),
    getLocationLandingInitialData(location),
  ])

  return (
    <LocationIndexClient
      location={location}
      initialGlobalAboutSpaceCards={initialGlobalAboutSpaceCards}
      initialDirections={initialData?.directions}
      initialSiteSettings={initialData?.siteSettings}
    />
  )
}
