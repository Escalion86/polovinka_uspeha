import { getSession } from 'next-auth/react'

import Head from 'next/head'

import DeviceCheck from '@components/DeviceCheck'
import eventsAtom from '@state/atoms/eventsAtom'
import fetchProps from '@server/fetchProps'
import Header from '@layouts/Header'
import ContactsBlock from '@blocks/ContactsBlock'
import eventViewFunc from '@layouts/modals/modalsFunc/eventViewFunc'
import { H2 } from '@components/tags'
import StateLoader from '@components/StateLoader'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import BlockContainer from '@components/BlockContainer'

// TODO Сделать копирование БД с main на dev
// TODO Сделать переключение с БД main на dev

const Event = ({ event }) => {
  if (!event?._id) return <div>Ошибка. Мероприятие не найдено</div>
  const eventView = eventViewFunc(event._id)
  const Component = eventView.Children
  const TopLeftComponent = eventView.TopLeftComponent

  return (
    <>
      <div className="relative">
        {TopLeftComponent && (
          <div className="absolute right-3">
            <TopLeftComponent />
          </div>
        )}
        <H2 className="mx-10 mb-4">Мероприятие</H2>
      </div>
      <Component />
    </>
  )
}

function EventPage(props) {
  const eventId = props.id

  const eventsState = useRecoilValue(eventsAtom)

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
        <Header />
        {/* <TitleBlock userIsLogged={!!loggedUserState} /> */}
        <BlockContainer small>
          <Event event={event} />
        </BlockContainer>
        {/* <div className="pb-6 mt-2 border-b border-gray-700 tablet:mt-9">
        </div> */}
        <ContactsBlock />
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
