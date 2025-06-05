import AboutBlock from '@blocks/AboutBlock'
// import AdditionalBlocks from '@blocks/AdditionalBlocks'
import ContactsBlock from '@blocks/ContactsBlock'
import DirectionsBlock from '@blocks/DirectionsBlock'
// import EventsBlock from '@blocks/EventsBlock'
import FooterBlock from '@blocks/FooterBlock'
import ReviewsBlock from '@blocks/ReviewsBlock'
// import ServicesBlock from '@blocks/ServicesBlock'
// import SupervisorBlock from '@blocks/SupervisorBlock'
import TitleBlock from '@blocks/TitleBlock'
import FabMenu from '@components/FabMenu'
import StateLoader from '@components/StateLoader'
import Header from '@layouts/Header'
import fetchProps from '@server/fetchProps'
import getServerSidePropsFunc from '@server/getServerSidePropsFunc'
import isPWAAtom from '@state/atoms/isPWAAtom'
// import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useAtomValue } from 'jotai'

export default function Home(props) {
  const isPWA = useAtomValue(isPWAAtom)
  const router = useRouter()

  if (isPWA) {
    router.push(
      {
        pathname: `/krsk/login`,
      },
      '',
      { shallow: true }
    )
    return null
  }

  return (
    <>
      <Head>
        <title>{`Центр серьёзных знакомств - "Половинка успеха"`}</title>
      </Head>
      <StateLoader className="max-h-screen" {...props}>
        <Header short />
        <TitleBlock />
        {/* <BlockContainer className="items-center">
          <FlipClockCountdown
            to={new Date().getTime() + 24 * 3600 * 1000 + 5000}
            labels={['Дни', 'Часы', 'Минуты', 'Секунды']}
            labelStyle={{
              fontSize: 10,
              fontWeight: 500,
              textTransform: 'uppercase',
              color: '#7a5151',
            }}
            digitBlockStyle={{
              width: 40,
              height: 60,
              fontSize: 30,
              color: 'black',
              background: 'white',
            }}
            dividerStyle={{ color: 'rgba(0,0,0,0.1)', height: 1 }}
            separatorStyle={{ color: '#7a5151', size: '5px' }}
            duration={0.5}
          />
        </BlockContainer> */}
        <AboutBlock />
        {/* <SupervisorBlock /> */}
        {/* <EventsBlock maxEvents={4} /> */}
        <DirectionsBlock />
        {/* <ServicesBlock />
        <AdditionalBlocks /> */}
        <ReviewsBlock />
        <ContactsBlock />
        <FooterBlock />
        <FabMenu show />
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
        destination: `/${session.location ?? 'krsk'}/cabinet`,
      },
    }
  }

  const response = await getServerSidePropsFunc(
    context,
    getSession,
    fetchProps,
    'krsk',
    {
      directions: { shortDescription: true },
      additionalBlocks: false,
      rolesSettings: false,
      services: false,
      questionnaires: false,
      events: false,
    }
  )

  return response
}
