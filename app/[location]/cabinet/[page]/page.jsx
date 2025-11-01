import { CABINET_PAGE_TITLES } from '@helpers/contentsMetadata'
import isUserQuestionnaireFilled from '@helpers/isUserQuestionnaireFilled'
import buildPageProps from '@server/getServerSidePropsFunc'
import fetchProps from '@server/fetchProps'
import { authOptions } from '@server/authOptions'
import LocationCabinetClient from '../../../_components/location/LocationCabinetClient'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export function generateMetadata({ params }) {
  const pageTitle = CABINET_PAGE_TITLES[params.page]
  const suffix = pageTitle ? ` / ${pageTitle}` : ''
  return {
    title: `Половинка успеха - Кабинет${suffix}`,
  }
}

export default async function LocationCabinetPage({ params, searchParams }) {
  const session = await getServerSession(authOptions)
  const { location, page } = params

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

  if (session.location !== location || !session.user?._id) {
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
