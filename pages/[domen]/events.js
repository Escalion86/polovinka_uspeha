import ContactsBlock from '@blocks/ContactsBlock'
import EventsBlock from '@blocks/EventsBlock'
import FooterBlock from '@blocks/FooterBlock'
import FabMenu from '@components/FabMenu'
import StateLoader from '@components/StateLoader'
import Header from '@layouts/Header'
import fetchProps from '@server/fetchProps'
import getServerSidePropsFunc from '@server/getServerSidePropsFunc'
import isPWAAtom from '@state/atoms/isPWAAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'

export default function Home(props) {
  const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleSelector)
  const hideFab = loggedUserActiveRole?.hideFab
  const isPWA = useRecoilValue(isPWAAtom)
  const router = useRouter()

  if (isPWA) {
    router.push('/login', '', { shallow: true })
    return null
  }

  return (
    <>
      <Head>
        <title>{`Мероприятия - ЦОЗ "Половинка успеха"`}</title>
      </Head>
      <StateLoader {...props}>
        <Header />
        {/* <TitleBlock /> */}
        <EventsBlock />
        <ContactsBlock />
        <FooterBlock />
        <FabMenu show={!hideFab} />
      </StateLoader>
    </>
  )
}

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req })

  if (session) {
    return {
      redirect: {
        destination: `/cabinet`,
      },
    }
  }
  const response = await getServerSidePropsFunc(context, getSession, fetchProps)

  return response
}
