import AboutBlock from '@blocks/AboutBlock'
import AdditionalBlocks from '@blocks/AdditionalBlocks'
import ContactsBlock from '@blocks/ContactsBlock'
import DirectionsBlock from '@blocks/DirectionsBlock'
import EventsBlock from '@blocks/EventsBlock'
import ReviewsBlock from '@blocks/ReviewsBlock'
import ServicesBlock from '@blocks/ServicesBlock'
import TitleBlock from '@blocks/TitleBlock'
import FabMenu from '@components/FabMenu'
import StateLoader from '@components/StateLoader'
import Header from '@layouts/Header'
import fetchProps from '@server/fetchProps'
import getServerSidePropsFunc from '@server/getServerSidePropsFunc'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import { useRecoilValue } from 'recoil'

export default function Home(props) {
  const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleSelector)
  const hideFab = loggedUserActiveRole?.hideFab

  return (
    <>
      <Head>
        <title>{`Центр осознанных знакомств - "Половинка успеха"`}</title>
      </Head>
      <StateLoader className="max-h-screen" {...props}>
        <Header />
        <TitleBlock />
        <AboutBlock />
        <EventsBlock maxEvents={4} />
        <DirectionsBlock />
        <ServicesBlock />
        <AdditionalBlocks />
        <ReviewsBlock />
        <ContactsBlock />
        <FabMenu show={!hideFab} />
        {/* <div className="flex flex-col items-start px-10 py-5 text-sm font-thin text-white bg-black min-h-80 tablet:px-20">
            <div>
              © ИП Белинский Алексей Алексеевич, ИНН 245727560982, ОГРНИП
              319246800103511
            </div>
          </div> */}
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
