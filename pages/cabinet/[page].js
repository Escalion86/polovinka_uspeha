import { getSession } from 'next-auth/react'

import Head from 'next/head'
import 'react-edit-text/dist/index.css'

import { useRouter } from 'next/router'
import SideBar from 'layouts/SideBar'
import CabinetWrapper from '@layouts/wrappers/CabinetWrapper'
import ContentWrapper from '@layouts/wrappers/ContentWrapper'
import CabinetHeader from '@layouts/CabinetHeader'
import { CONTENTS } from '@helpers/constants'
import {
  fetchingDirections,
  fetchingEvents,
  fetchingReviews,
  fetchingUsers,
  fetchingEventsUsers,
  fetchingAdditionalBlocks,
} from '@helpers/fetchers'
import { useState, useEffect } from 'react'
import LoadingContent from '@layouts/content/LoadingContent'

import Modal from '@layouts/modals/Modal'
import ModalsPortal from '@layouts/modals/ModalsPortal'
import BurgerLayout from '@layouts/BurgerLayout'
import DeviceCheck from '@components/DeviceCheck'
import loadingEventsAtom from '@state/atoms/loadingEventsAtom'
import propsAtom from '@state/atoms/propsAtom'
import { useRecoilCallback, useRecoilState, useSetRecoilState } from 'recoil'
import eventsSelector, { eventsAtom, eventsIds } from '@state/atoms/eventsAtom'

function CabinetPage(props) {
  const { page, loggedUser } = props
  // const [propsState, setPropsState] = useRecoilState(propsAtom)

  const setEventAtom = useRecoilCallback(
    ({ set }) =>
      (event) => {
        set(eventsIds, (prev) => {
          if (prev.includes(event._id)) return prev
          return [...prev, event._id]
        })
        set(eventsAtom(event._id), event)
      },
    []
  )

  const [loading, setLoading] = useState(true)

  // if (loading) {
  //   props.events.forEach((event) => {
  //     createEventAtom(event)
  //   })
  // }

  const Component = CONTENTS[page]
    ? CONTENTS[page].Component
    : (props) => <div className="flex justify-center px-2">Ошибка 404</div>

  const title = CONTENTS[page] ? CONTENTS[page].name : ''

  useEffect(() => {
    props.events.forEach((event) => {
      setEventAtom(event)
    })
    // setPropsState(props)
    setLoading(false)
  }, [])

  return (
    <>
      <Head>
        <title>Половинка успеха - Кабинет{title ? ' / ' + title : ''}</title>
        {/* <meta name="description" content={activeLecture.description} /> */}
      </Head>
      <CabinetWrapper>
        {loading ? (
          <div>Загрузка</div>
        ) : (
          <>
            {/* ----------------------------- HEADER ------------------------------- */}
            <DeviceCheck right />
            <CabinetHeader user={loggedUser} title={title} />
            <BurgerLayout />
            <ContentWrapper user={loggedUser} page={page}>
              <Component {...props} />
            </ContentWrapper>
            <ModalsPortal />
          </>
        )}
      </CabinetWrapper>
    </>
  )
}

export default CabinetPage

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
  const { page } = params

  console.log('session', session)
  if (!session?.user) {
    return {
      redirect: {
        destination: `/`,
      },
    }
  }

  try {
    const users = await fetchingUsers(process.env.NEXTAUTH_SITE)
    const events = await fetchingEvents(process.env.NEXTAUTH_SITE)
    const directions = await fetchingDirections(process.env.NEXTAUTH_SITE)
    const reviews = await fetchingReviews(process.env.NEXTAUTH_SITE)
    const additionalBlocks = await fetchingAdditionalBlocks(
      process.env.NEXTAUTH_SITE
    )
    const eventsUsers = await fetchingEventsUsers(process.env.NEXTAUTH_SITE)
    return {
      props: {
        users,
        events,
        directions,
        reviews,
        page,
        additionalBlocks,
        eventsUsers,
        loggedUser: session?.user ? session.user : null,
      },
    }
  } catch {
    return {
      props: {
        users: null,
        events: null,
        directions: null,
        reviews: null,
        page,
        additionalBlocks: null,
        eventsUsers: null,
        loggedUser: session?.user ? session.user : null,
      },
      // notFound: true,
    }
  }

  // try {
  //   await dbConnect()

  //   // Сначала проверяем - возможно было приглашение на курс
  //   const emailInvitationCourses = await EmailInvitationCourses.find({
  //     email: session.user.email,
  //   })
  //   // Если приглашение было, то сначала создаем пользователя как участника курса и только потом удаляем приглашение
  //   if (emailInvitationCourses.length > 0) {
  //     for (let i = 0; i < emailInvitationCourses.length; i++) {
  //       const checkUserInCourse = await UsersCourses.find({
  //         userId: session.user._id,
  //         courseId: emailInvitationCourses[i].courseId,
  //       })
  //       if (checkUserInCourse.length === 0) {
  //         await UsersCourses.create({
  //           userId: session.user._id,
  //           courseId: emailInvitationCourses[i].courseId,
  //           role: emailInvitationCourses[i].role,
  //         })
  //       }
  //     }
  //     await EmailInvitationCourses.deleteMany({ email: session.user.email })
  //   }

  //   // Получаем список Id курсов доступных для пользователя

  //   const userCourses = await UsersCourses.find({ userId: session.user._id })

  //   console.log('emailInvitationCourses', emailInvitationCourses)

  //   const coursesIds = getIds(userCourses, 'courseId')

  //   const courses = JSON.parse(
  //     JSON.stringify(
  //       await Courses.find({
  //         _id: { $in: coursesIds },
  //       })
  //     )
  //   )

  //   const coursesRole = {}
  //   userCourses.forEach((userCourse) => {
  //     coursesRole[userCourse.courseId] = userCourse.role
  //   })

  //   const chapters = JSON.parse(
  //     JSON.stringify(
  //       await Chapters.find({
  //         courseId: { $in: coursesIds },
  //       })
  //     )
  //   )

  //   if (!chapters) {
  //     return {
  //       notFound: true,
  //     }
  //   }

  //   const lectures = JSON.parse(
  //     JSON.stringify(
  //       await Lectures.find({
  //         chapterId: { $in: getIds(chapters) },
  //       })
  //     )
  //   )

  //   if (!lectures) {
  //     return {
  //       notFound: true,
  //     }
  //   }

  //   const tasks = JSON.parse(
  //     JSON.stringify(
  //       await Tasks.find({
  //         lectureId: { $in: getIds(lectures) },
  //       })
  //     )
  //   )

  //   if (!tasks) {
  //     return {
  //       notFound: true,
  //     }
  //   }

  //   const answers = JSON.parse(
  //     JSON.stringify(await Answers.find({ taskId: { $in: getIds(tasks) } }))
  //   )

  //   if (!answers) {
  //     return {
  //       notFound: true,
  //     }
  //   }

  //   return {
  //     props: {
  //       courses,
  //       coursesRole,
  //       chapters,
  //       lectures,
  //       tasks,
  //       answers,
  //       user: session?.user ? session.user : null,
  //     },
  //   }
  // } catch {
  //   return {
  //     props: {
  //       courses: [],
  //       coursesRole: {},
  //       chapters: [],
  //       lectures: [],
  //       tasks: [],
  //       answers: [],
  //       user: session?.user ? session.user : null,
  //     },
  //     // notFound: true,
  //   }
  // }
}
