import isUserQuestionnaireFilled from '@helpers/isUserQuestionnaireFilled'
import buildPageProps from '@server/getServerSidePropsFunc'
import fetchProps from '@server/fetchProps'
import { authOptions } from '@server/authOptions'
import CabinetDirectionClient from '../../../../_components/location/CabinetDirectionClient'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Половинка успеха - Кабинет / Пространство',
}

export default async function CabinetDirectionPage({ params }) {
  const session = await getServerSession(authOptions)
  const { location, directionId } = await params

  if (!location || !directionId) {
    redirect('/')
  }

  if (!session?.user) {
    redirect(`/${location}/login?page=direction`)
  }

  if (session.location !== location) {
    redirect(`/${session.location}/cabinet/direction/${directionId}`)
  }

  if (!session.user?._id) {
    return (
      <CabinetDirectionClient
        location={location}
        directionId={directionId}
        wrongSession
      />
    )
  }

  if (!isUserQuestionnaireFilled(session.user)) {
    redirect(`/${location}/cabinet/questionnaire`)
  }

  const props = await buildPageProps({
    session,
    fetcher: fetchProps,
    location,
    params: {
      additionalBlocks: false,
      reviews: false,
      directions: { includeDescription: true },
    },
  })

  return <CabinetDirectionClient {...props} directionId={directionId} />
}

