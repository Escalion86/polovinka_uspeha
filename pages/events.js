import ContactsBlock from '@blocks/ContactsBlock'
import EventsBlock from '@blocks/EventsBlock'
import Fab from '@components/Fab'
import StateLoader from '@components/StateLoader'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import Header from '@layouts/Header'
import fetchProps from '@server/fetchProps'
import getServerSidePropsFunc from '@server/getServerSidePropsFunc'
import isLoggedUserModerSelector from '@state/selectors/isLoggedUserModerSelector'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import { useRecoilValue } from 'recoil'

export default function Home(props) {
  const isLoggedUserModer = useRecoilValue(isLoggedUserModerSelector)
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
