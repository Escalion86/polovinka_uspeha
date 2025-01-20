import ContactsBlock from '@blocks/ContactsBlock'
import BlockContainer from '@components/BlockContainer'
import FabMenu from '@components/FabMenu'
import PulseButton from '@components/PulseButton'
import StateLoader from '@components/StateLoader'
import { H2 } from '@components/tags'
import Header from '@layouts/Header'
import serviceViewFunc from '@layouts/modals/modalsFunc/serviceViewFunc'
import fetchProps from '@server/fetchProps'
import isPWAAtom from '@state/atoms/isPWAAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
// import servicesAtom from '@state/atoms/servicesAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import serviceSelector from '@state/selectors/serviceSelector'
import SignOut from '@components/SignOut'
import locationAtom from '@state/atoms/locationAtom'

const Service = ({ service }) => {
  const serviceView = serviceViewFunc(service._id)
  const Component = serviceView.Children
  const TopLeftComponent = serviceView.TopLeftComponent

  return (
    <>
      <div className="relative">
        {TopLeftComponent && (
          <div className="absolute right-3">
            <TopLeftComponent />
          </div>
        )}
        <H2 className="mx-10 mb-4">Услуга</H2>
      </div>
      <Component />
    </>
  )
}

function ServicePage(props) {
  const { location } = props
  const [locationState, setLocationState] = useAtom(locationAtom)

  const serviceId = props.id

  // const router = useRouter()

  const service = useAtomValue(serviceSelector(serviceId))

  const loggedUserActive = useAtomValue(loggedUserActiveAtom)

  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const hideFab = loggedUserActiveRole?.hideFab
  const isPWA = useAtomValue(isPWAAtom)

  // const { canSee } = useAtomValue(loggedUserToEventStatusSelector(serviceId))

  useEffect(() => {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    })
  }, [])

  // const service =
  //   servicesState?.length > 0
  //     ? servicesState.find((service) => service._id === serviceId)
  //     : undefined

  useEffect(() => setLocationState(location), [location])

  if (props.wrongSession) return <SignOut />

  if (!locationState) return null

  const title = service?.title ?? ''
  const query = service?._id ? { service: service._id } : {}

  return (
    <>
      <Head>
        <title>
          {`Половинка успеха - Услуга${title ? ' "' + title + '"' : ''}`}
        </title>
        {/* <meta name="description" content={activeLecture.description} /> */}
      </Head>
      <StateLoader {...props}>
        <Header noMenu={isPWA} />
        {/* <TitleBlock userIsLogged={!!loggedUserState} /> */}
        <BlockContainer small>
          {service?._id && (
            // && canSee
            <Service service={service} />
          )}
          <div className="flex flex-col items-center">
            {!service?._id && (
              <span className="text-xl">Ошибка. Услуга не найдена</span>
            )}
            {/* {!canSee && (
              <span className="text-xl">
                Услуга не доступна для просмотра неавторизированным
                пользователям, пожалуйста авторизируйтесь
              </span>
            )} */}
            {!loggedUserActive && (
              <>
                <Link
                  prefetch={false}
                  href={{
                    pathname: '/login',
                    query,
                  }}
                  shallow
                >
                  <PulseButton
                    className="mt-4 text-white"
                    title="Авторизироваться"
                    // onClick={() => router.push('./login', '', { shallow: true })}
                  />
                </Link>
                <Link
                  prefetch={false}
                  href={{
                    pathname: '/login',
                    query: { ...query, registration: true },
                  }}
                  shallow
                >
                  <PulseButton
                    className="mt-4 text-white"
                    title="Зарегистрироваться"
                    // onClick={() => router.push('./login', '', { shallow: true })}
                  />
                </Link>
              </>
            )}
          </div>
        </BlockContainer>
        {/* <div className="pb-6 mt-2 border-b border-gray-700 tablet:mt-9">
        </div> */}
        {!isPWA && <ContactsBlock />}
        <FabMenu show={!hideFab} />
      </StateLoader>
    </>
  )
}

export default ServicePage

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req })

  const { params } = context
  const { id, location } = params

  const fetchedProps = await fetchProps(session?.user, location, {
    additionalBlocks: false,
  })

  if (session?.user && (session.location !== location || !session?.user?._id)) {
    return {
      props: {
        location,
        wrongSession: true,
      },
    }
  }

  return {
    props: {
      ...fetchedProps,
      id,
      loggedUser: session?.user ?? null,
      location,
    },
  }
}
