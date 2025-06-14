import AboutBlock from '@blocks/AboutBlock'
import AdditionalBlocks from '@blocks/AdditionalBlocks'
import ContactsBlock from '@blocks/ContactsBlock'
import DirectionsBlock from '@blocks/DirectionsBlock'
import EventsBlock from '@blocks/EventsBlock'
import FooterBlock from '@blocks/FooterBlock'
import ReviewsBlock from '@blocks/ReviewsBlock'
import ServicesBlock from '@blocks/ServicesBlock'
import SupervisorBlock from '@blocks/SupervisorBlock'
import TitleBlock from '@blocks/TitleBlock'
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
import { useEffect, useMemo } from 'react'
import locationAtom from '@state/atoms/locationAtom'

export default function Home(props) {
  const [locationState, setLocationState] = useAtom(locationAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const hideFab = loggedUserActiveRole?.hideFab
  const isPWA = useAtomValue(isPWAAtom)
  const router = useRouter()

  const query = useMemo(() => {
    const newQuery = { ...router.query }
    delete newQuery.location
    return newQuery
  }, [router])

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
        <title>{`Центр серьёзных знакомств - "Половинка успеха"`}</title>
      </Head>
      <StateLoader className="max-h-screen" {...props}>
        <Header />
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
        <SupervisorBlock />
        <EventsBlock maxEvents={4} />
        <DirectionsBlock />
        <ServicesBlock />
        <AdditionalBlocks />
        <ReviewsBlock />
        <ContactsBlock />
        <FooterBlock />
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

  const { params } = context
  const location = params?.location

  if (session) {
    console.log('SESSION')
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
    { directions: { shortDescription: true } }
  )
  console.log('response :>> ', Object.keys(response))

  return response
}
