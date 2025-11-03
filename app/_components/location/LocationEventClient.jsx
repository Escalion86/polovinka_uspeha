'use client'

import ContactsBlock from '@blocks/ContactsBlock'
import BlockContainer from '@components/BlockContainer'
import FabMenu from '@components/FabMenu'
import PulseButton from '@components/PulseButton'
import StateLoader from '@components/StateLoader'
import { H2 } from '@components/tags'
import Header from '@layouts/Header'
import eventViewFunc from '@layouts/modals/modalsFunc/eventViewFunc'
// import eventsAtom from '@state/atoms/eventsAtom'
import isPWAAtom from '@state/atoms/isPWAAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
// import loggedUserToEventStatusSelector from '@state/selectors/loggedUserToEventStatusSelector'
import Link from 'next/link'
// import { useRouter } from 'next/router'
import { Suspense, useEffect } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import Skeleton from 'react-loading-skeleton'
import eventSelector from '@state/selectors/eventSelector'
import SignOut from '@components/SignOut'
import locationAtom from '@state/atoms/locationAtom'

const Event = ({ event }) => {
  const eventView = eventViewFunc(event._id)
  const Component = eventView.Children
  const TopLeftComponent = eventView.TopLeftComponent

  return (
    <>
      <div className="relative">
        {TopLeftComponent && (
          <div className="absolute right-3">
            <Suspense fallback={<Skeleton count={1} height={28} width={60} />}>
              <TopLeftComponent />
            </Suspense>
          </div>
        )}
        <H2 className="mx-10 mb-4">Мероприятие</H2>
      </div>
      <Suspense
        fallback={
          <div className="flex flex-col gap-y-4">
            <Skeleton
              count={1}
              className="h-60 laptop:h-80 max-h-60 laptop:max-h-80"
            />
            <div className="flex justify-between">
              <Skeleton
                count={1}
                height={28}
                containerClassName="w-[120px] max-w-[45%]"
              />
              <Skeleton
                count={1}
                height={28}
                containerClassName="w-[120px] max-w-[45%]"
              />
            </div>
            <div className="flex justify-center">
              <Skeleton
                count={1}
                height={36}
                containerClassName="w-[300px] max-w-full"
              />
            </div>
            <Skeleton count={12} />
          </div>
        }
      >
        <Component />
      </Suspense>
    </>
  )
}

const EventBlock = ({ event }) => {
  const loggedUserActive = useAtomValue(loggedUserActiveAtom)

  return (
    <BlockContainer small>
      {!event || event?.blank ? (
        <H2>Мероприятие отсутствует</H2>
      ) : (
        <Event event={event} />
      )}
      <div className="flex flex-col items-center">
        {loggedUserActive && (
          <Link
            prefetch={false}
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
  const { location } = props
  const [locationState, setLocationState] = useAtom(locationAtom)

  const eventId = props.id
  const event = useAtomValue(eventSelector(eventId))

  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const hideFab = loggedUserActiveRole?.hideFab
  const isPWA = useAtomValue(isPWAAtom)

  useEffect(() => {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    })
  }, [])

  useEffect(() => setLocationState(location), [location])

  if (props.wrongSession) return <SignOut />

  if (!locationState) return null

  // const event =
  //   eventsState?.length > 0
  //     ? eventsState.find((event) => event._id === eventId)
  //     : undefined

  const title = event?.title ?? ''

  return (
    <>
      <StateLoader {...props}>
        <Header noMenu={isPWA} fullLinkInMenu />
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
