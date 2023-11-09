import ContactsBlock from '@blocks/ContactsBlock'
import EventsBlock from '@blocks/EventsBlock'
import Fab from '@components/Fab'
import LoadingSpinner from '@components/LoadingSpinner'
import StateLoader from '@components/StateLoader'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import Header from '@layouts/Header'
import fetchProps from '@server/fetchProps'
import getServerSidePropsFunc from '@server/getServerSidePropsFunc'
import isLoggedUserModerSelector from '@state/selectors/isLoggedUserModerSelector'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'

export default function Home(props) {
  const isLoggedUserModer = useRecoilValue(isLoggedUserModerSelector)

  const router = useRouter()

  let redirect
  if (props.loggedUser) redirect = '/cabinet/events'

  useEffect(() => {
    if (redirect) router.push(redirect, '', { shallow: true })
  }, [redirect])

  if (redirect)
    return (
      <div className="w-full h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )

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
        <Fab
          show={!isLoggedUserModer}
          icon={faWhatsapp}
          bgClass="bg-green-700"
          href="https://wa.me/79504280891"
        />
      </StateLoader>
    </>
  )
}

export const getServerSideProps = async (context) =>
  await getServerSidePropsFunc(context, getSession, fetchProps)
