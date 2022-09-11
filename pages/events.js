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
import { useEffect } from 'react'

export default function Home(props) {
  useEffect(() => {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    })
  }, [])

  return (
    <>
      <Head>
        <title>{`Мероприятия - ЦОЗ "Половинка успеха"`}</title>
      </Head>
      <StateLoader {...props}>
        <DeviceCheck right />
        <Header />
        <TitleBlock />
        <EventsBlock />
        <ContactsBlock />
      </StateLoader>
    </>
  )
}

export const getServerSideProps = async (context) =>
  await getServerSidePropsFunc(context, getSession, fetchProps)
