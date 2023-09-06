import Header from '@layouts/Header'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import ContactsBlock from '@blocks/ContactsBlock'
import EventsBlock from '@blocks/EventsBlock'
import TitleBlock from '@blocks/TitleBlock'
import fetchProps from '@server/fetchProps'
import DeviceCheck from '@components/DeviceCheck'
import StateLoader from '@components/StateLoader'
import getServerSidePropsFunc from '@server/getServerSidePropsFunc'
import Fab from '@components/Fab'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import isLoggedUserModerSelector from '@state/selectors/isLoggedUserModerSelector'
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
