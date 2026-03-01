import { CABINET_PAGE_TITLES } from '@helpers/contentsMetadata'
import isUserQuestionnaireFilled from '@helpers/isUserQuestionnaireFilled'
import buildPageProps from '@server/getServerSidePropsFunc'
import fetchProps from '@server/fetchProps'
import { authOptions } from '@server/authOptions'
import LocationCabinetClient from '../../../_components/location/LocationCabinetClient'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export async function generateMetadata({ params }) {
  const { page } = await params
  const normalizedPage =
    page === 'events' || page === 'eventsTest' ? 'eventsCalendar' : page
  const pageTitle = CABINET_PAGE_TITLES[normalizedPage]
  const suffix = pageTitle ? ` / ${pageTitle}` : ''
  return {
    title: `Половинка успеха - Кабинет${suffix}`,
  }
}

export default async function LocationCabinetPage({ params, searchParams }) {
  const session = await getServerSession(authOptions)
  const { location, page } = await params
  const resolvedSearchParams = (await searchParams) || {}
  const normalizedPage =
    page === 'events' || page === 'eventsTest' ? 'eventsCalendar' : page

  if (!location) {
    redirect('/')
  }
  if (page === 'events' || page === 'eventsTest') {
    redirect(`/${location}/cabinet/eventsCalendar`)
  }
  if (!session?.user) {
    const target = new URLSearchParams()
    if (normalizedPage) target.set('page', normalizedPage)
    if (resolvedSearchParams?.ref) target.set('ref', resolvedSearchParams.ref)
    if (resolvedSearchParams?.event)
      target.set('event', resolvedSearchParams.event)
    if (resolvedSearchParams?.service)
      target.set('service', resolvedSearchParams.service)
    const query = target.toString()
    redirect(`/${location}/login${query ? `?${query}` : ''}`)
  }

  if (session.location !== location) {
    const targetPage =
      normalizedPage && normalizedPage !== 'eventsCalendar'
        ? normalizedPage
        : 'eventsCalendar'
    redirect(`/${session.location}/cabinet/${targetPage}`)
  }

  if (!session.user?._id) {
    return <LocationCabinetClient location={location} wrongSession />
  }
  if (
    normalizedPage !== 'questionnaire' &&
    !isUserQuestionnaireFilled(session.user)
  ) {
    redirect(`/${location}/cabinet/questionnaire`)
  }

  const props = await buildPageProps({
    session,
    fetcher: fetchProps,
    location,
    params: {
      additionalBlocks: false,
      reviews: normalizedPage === 'reviews',
      directions: true,
    },
  })

  return <LocationCabinetClient {...props} />
}
