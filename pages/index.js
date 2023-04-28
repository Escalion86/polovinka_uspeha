// import dbConnect from '@utils/dbConnect'
// import DeviceCheck from '@components/DeviceCheck'
// import { H1, H2, H3, H4, P } from '@components/tags'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import {
//   fetchingAdditionalBlocks,
//   fetchingDirections,
//   fetchingEvents,
//   fetchingEventsUsers,
//   fetchingPayments,
//   fetchingReviews,
//   fetchingSiteSettings,
//   fetchingUsers,
// } from '@helpers/fetchers'
import Header from '@layouts/Header'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import DirectionsBlock from '@blocks/DirectionsBlock'
import ContactsBlock from '@blocks/ContactsBlock'
import ReviewsBlock from '@blocks/ReviewsBlock'
import AdditionalBlocks from '@blocks/AdditionalBlocks'
import EventsBlock from '@blocks/EventsBlock'
import AboutBlock from '@blocks/AboutBlock'
import TitleBlock from '@blocks/TitleBlock'
import fetchProps from '@server/fetchProps'
import StateLoader from '@components/StateLoader'
import getServerSidePropsFunc from '@server/getServerSidePropsFunc'
import filteredEventsSelector from '@state/selectors/filteredEventsSelector'
import { useRecoilValue } from 'recoil'
import filteredDirectionsSelector from '@state/selectors/filteredDirectionsSelector'

export default function Home(props) {
  const filteredEvents = useRecoilValue(filteredEventsSelector)
  const filteredDirections = useRecoilValue(filteredDirectionsSelector)
  const directionsBlocksInverse = filteredEvents.length > 0
  const additionalBlocksInverse =
    ((directionsBlocksInverse ? 1 : 0) + filteredDirections.length) % 2 === 0

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
        <DirectionsBlock startInverse={directionsBlocksInverse} />
        <AdditionalBlocks startInverse={additionalBlocksInverse} />
        <ReviewsBlock />
        <ContactsBlock />
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

export const getServerSideProps = async (context) =>
  await getServerSidePropsFunc(context, getSession, fetchProps)
