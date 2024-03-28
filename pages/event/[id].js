import ContactsBlock from '@blocks/ContactsBlock'
import BlockContainer from '@components/BlockContainer'
import FabMenu from '@components/FabMenu'
import PulseButton from '@components/PulseButton'
import StateLoader from '@components/StateLoader'
import { H2 } from '@components/tags'
import Header from '@layouts/Header'
import eventViewFunc from '@layouts/modals/modalsFunc/eventViewFunc'
import fetchProps from '@server/fetchProps'
import eventsAtom from '@state/atoms/eventsAtom'
import isPWAAtom from '@state/atoms/isPWAAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
// import loggedUserToEventStatusSelector from '@state/selectors/loggedUserToEventStatusSelector'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
// import { useRouter } from 'next/router'
import { Suspense, useEffect } from 'react'
import { useRecoilValue } from 'recoil'

const Event = ({ event }) => {
  const eventView = eventViewFunc(event._id)
  const Component = eventView.Children
  const TopLeftComponent = eventView.TopLeftComponent

  return (
    <Suspense>
      <div className="relative">
        {TopLeftComponent && (
          <div className="absolute right-3">
            <TopLeftComponent />
          </div>
        )}
        <H2 className="mx-10 mb-4">Мероприятие</H2>
      </div>
      <Component />
    </Suspense>
  )
}

const EventBlock = ({ event }) => {
  const loggedUserActive = useRecoilValue(loggedUserActiveAtom)

  return (
    <BlockContainer small>
      <Event event={event} />
      <div className="flex flex-col items-center">
        {loggedUserActive && (
          <Link
            className="max-w-[76%]"
            href={{
              pathname: '/cabinet/events',
            }}
            shallow
          >
            <PulseButton
              className="mt-4 text-white"
              title="Посмотреть список всех мероприятий"
            />
          </Link>
        )}
      </div>
    </BlockContainer>
  )
}

function EventPage(props) {
  const eventId = props.id
  const eventsState = useRecoilValue(eventsAtom)

  const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleSelector)
  const hideFab = loggedUserActiveRole?.hideFab
  const isPWA = useRecoilValue(isPWAAtom)

  useEffect(() => {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    })
  }, [])

  const event =
    eventsState?.length > 0
      ? eventsState.find((event) => event._id === eventId)
      : undefined

  const title = event?.title ?? ''

  return (
    <>
      <Head>
        <title>
          {`Половинка успеха - Мероприятие${title ? ' "' + title + '"' : ''}`}
        </title>
        {/* <meta name="description" content={activeLecture.description} /> */}
      </Head>
      <StateLoader {...props}>
        <Header noMenu={isPWA} />
        <EventBlock event={event} />
        {/* <TitleBlock userIsLogged={!!loggedUserState} /> */}

        {/* <div className="pb-6 mt-2 border-b border-gray-700 tablet:mt-9">
        </div> */}
        {!isPWA && <ContactsBlock />}
        <FabMenu show={!hideFab} />
      </StateLoader>
    </>
  )
}

export default EventPage

// export const getStaticPaths = async () => {
//   console.log('getStaticPaths fetching...')
//   const courses = await fetchingCourses(null, 'http://localhost:3000')
//   const chapters = await fetchingChapters(null, 'http://localhost:3000')
//   const lectures = await fetchingLectures(null, 'http://localhost:3000')

//   let paths = []
//   courses.forEach((course) => {
//     const courseChapters = chapters.filter(
//       (chapter) => chapter.courseId === course._id
//     )
//     courseChapters.forEach((chapter) => {
//       const chapterLectures = lectures.filter(
//         (lecture) => lecture.chapterId === chapter._id
//       )
//       chapterLectures.forEach((lecture) =>
//         paths.push(`/course/${course._id}/${lecture._id}`)
//       )
//     })
//   })

//   console.log('paths', paths)

//   return {
//     paths,
//     fallback: true,
//   }
// }

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
