import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import HomeClient from './_components/home/HomeClient'
import buildPageProps from '@server/getServerSidePropsFunc'
import fetchProps from '@server/fetchProps'
import { authOptions } from '@server/authOptions'

export const metadata = {
  title: 'Центр серьёзных знакомств - «Половинка успеха»',
}

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (session?.location) {
    redirect(`/${session.location}/cabinet`)
  }

  const props = await buildPageProps({
    session,
    fetcher: fetchProps,
    location: 'krsk',
    params: {
      directions: { shortDescription: true },
      additionalBlocks: false,
      rolesSettings: false,
      services: false,
      questionnaires: false,
      events: false,
    },
  })

  return <HomeClient {...props} />
}
