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
  const pageTitle = CABINET_PAGE_TITLES[page]
  const suffix = pageTitle ? ` / ${pageTitle}` : ''
  return {
    title: `Половинка успеха - Кабинет${suffix}`,
  }
}

export default async function LocationCabinetPage({ params, searchParams }) {
  const session = await getServerSession(authOptions)
  const { location, page } = await params

  if (!location) {
    redirect('/')
  }
  if (!session?.user) {
    const target = new URLSearchParams()
    if (page) target.set('page', page)
    if (searchParams?.ref) target.set('ref', searchParams.ref)
    if (searchParams?.event) target.set('event', searchParams.event)
    if (searchParams?.service) target.set('service', searchParams.service)
    const query = target.toString()
    redirect(`/${location}/login${query ? `?${query}` : ''}`)
  }

  if (session.location !== location) {
    const targetPage = page && page !== 'events' ? page : 'events'
    redirect(`/${session.location}/cabinet/${targetPage}`)
  }

  if (!session.user?._id) {
    return <LocationCabinetClient location={location} wrongSession />
  }
  if (page !== 'questionnaire' && !isUserQuestionnaireFilled(session.user)) {
    redirect(`/${location}/cabinet/questionnaire`)
  }

  const props = await buildPageProps({
    session,
    fetcher: fetchProps,
    location,
    params: {
      additionalBlocks: false,
      reviews: false,
    },
  })

  return <LocationCabinetClient {...props} />
}
