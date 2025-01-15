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
import { useAtom, useAtomValue } from 'jotai'
import { useEffect } from 'react'
import locationAtom from '@state/atoms/locationAtom'

export default function Home(props) {
  const [locationState, setLocationState] = useAtom(locationAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const hideFab = loggedUserActiveRole?.hideFab
  const isPWA = useAtomValue(isPWAAtom)
  const router = useRouter()
  const query = { ...router.query }
  delete query.location
  const { location } = props

  useEffect(() => setLocationState(location), [location])

  if (isPWA) {
    router.push(
      {
        pathname: `/${location}/login`,
        query,
      },
      '',
      { shallow: true }
    )
    return null
  }

  if (!locationState) return null

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

  const { params } = context
  const location = params?.location

  if (session) {
    return {
      redirect: {
        destination: `/${location}/cabinet`,
      },
    }
  }
  const response = await getServerSidePropsFunc(
    context,
    getSession,
    fetchProps,
    location,
    {
      additionalBlocks: false,
    }
  )

  return response
}
