import ContactsBlock from '@blocks/ContactsBlock'
import BlockContainer from '@components/BlockContainer'
import PulseButton from '@components/PulseButton'
import StateLoader from '@components/StateLoader'
import { H2 } from '@components/tags'
import Header from '@layouts/Header'
import serviceViewFunc from '@layouts/modals/modalsFunc/serviceViewFunc'
import fetchProps from '@server/fetchProps'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import servicesAtom from '@state/atoms/servicesAtom'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'

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
  const serviceId = props.id

  // const router = useRouter()

  const servicesState = useRecoilValue(servicesAtom)

  const loggedUser = useRecoilValue(loggedUserAtom)

  // const { canSee } = useRecoilValue(loggedUserToEventStatusSelector(serviceId))

  useEffect(() => {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    })
  }, [])

  const service =
    servicesState?.length > 0
      ? servicesState.find((service) => service._id === serviceId)
      : undefined

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
        <Header />
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
            {!loggedUser && (
              <>
                <Link
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
        <ContactsBlock />
      </StateLoader>
    </>
  )
}

export default ServicePage

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req })

  const { params } = context
  const { id } = params

  const fetchedProps = await fetchProps(session?.user)

  return {
    props: {
      ...fetchedProps,
      id,
      loggedUser: session?.user ?? null,
    },
  }
}
