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
  fetchingSertificates,
  fetchingUsers,
  fetchingEventsUsers,
} from '@helpers/fetchers'
import { useState, useEffect } from 'react'
import LoadingContent from '@layouts/content/LoadingContent'

import Modal from '@layouts/modals/Modal'
import ModalsPortal from '@layouts/modals/ModalsPortal'
import BurgerLayout from '@layouts/BurgerLayout'
import DeviceCheck from '@components/DeviceCheck'

function CabinetPage(props) {
  const { page, loggedUser } = props
  const Component = CONTENTS[page]
    ? CONTENTS[page].Component
    : (props) => <div className="flex justify-center px-2">Ошибка 404</div>

  const title = CONTENTS[page] ? CONTENTS[page].name : ''

  return (
    <>
      <Head>
        <title>Половинка успеха - Кабинет{title ? ' / ' + title : ''}</title>
        {/* <meta name="description" content={activeLecture.description} /> */}
      </Head>
      <CabinetWrapper>
        {/* ----------------------------- HEADER ------------------------------- */}
        <DeviceCheck right />
        <CabinetHeader user={loggedUser} title={title} />
        <BurgerLayout />
        <ContentWrapper user={loggedUser} page={page}>
          <Component {...props} />
          {/* <H2>Доступные курсы</H2>
          <div className="w-full">
            {accessCourses.length > 0 ? (
              <ul className="w-full">
                {accessCourses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    chaptersCount={course.chaptersCount}
                    lecturesCount={course.lecturesCount}
                    tasksCount={course.tasksCount}
                  />
                ))}
              </ul>
            ) : (
              <div>Нет доступных курсов</div>
            )}
          </div>
          <H2>Мои курсы</H2>
          <div className="w-full">
            {adminCourses.length > 0 ? (
              <ul className="w-full">
                {adminCourses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </ul>
            ) : (
              <div>Нет курсов созданных мною</div>
            )}
          </div>
          <button
            onClick={() => {
              postData(`/api/courses/${user._id}`, {}, (data) => {
                console.log('data', data)

                router.push(`./course/${data.course._id}/general`)
              })
            }}
            className="w-40 px-2 py-1 text-white duration-300 bg-purple-700 border border-purple-200 rounded-md tablet:w-auto hover:text-purple-700 hover:bg-white hover:border-purple-700"
          >
            Создать свой курс
          </button> */}
        </ContentWrapper>
        <ModalsPortal />
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
    const sertificates = await fetchingSertificates(process.env.NEXTAUTH_SITE)
    const eventsUsers = await fetchingEventsUsers(process.env.NEXTAUTH_SITE)
    return {
      props: {
        users,
        events,
        directions,
        reviews,
        page,
        sertificates,
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
        sertificates: null,
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
