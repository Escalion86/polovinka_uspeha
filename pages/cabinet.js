import { getSession } from 'next-auth/react'

import Head from 'next/head'
import 'react-edit-text/dist/index.css'

import { useRouter } from 'next/router'
import SideBar from 'layouts/SideBar'
import CabinetWrapper from '@layouts/content/CabinetWrapper'
import ContentWrapper from '@layouts/content/ContentWrapper'
import CabinetHeader from '@layouts/CabinetHeader'

function CabinetPage({ user }) {
  // const { courses, user, userCourses } = props

  const router = useRouter()

  // const coursesWithMoreInfo = courses.map((course) => {
  //   const chaptersOfCourse = chapters.filter(
  //     (chapter) => chapter.courseId === course._id
  //   )
  //   const chaptersOfCourseIds = getIds(chaptersOfCourse)
  //   const lecturesOfCourse = lectures.filter((lecture) =>
  //     chaptersOfCourseIds.includes(lecture.chapterId)
  //   )
  //   const lecturesOfCourseIds = getIds(lecturesOfCourse)
  //   const tasksOfCourse = tasks.filter((task) =>
  //     lecturesOfCourseIds.includes(task.lectureId)
  //   )
  //   return {
  //     ...course,
  //     chaptersCount: chaptersOfCourseIds.length,
  //     lecturesCount: lecturesOfCourse.length,
  //     tasksCount: tasksOfCourse.length,
  //   }
  // })

  // const accessCourses = coursesWithMoreInfo.filter(
  //   (course) => coursesRole[course._id] !== 'admin'
  // )
  // const adminCourses = coursesWithMoreInfo.filter(
  //   (course) => coursesRole[course._id] === 'admin'
  // )

  return (
    <>
      <Head>
        <title>Кабинет</title>
        {/* <meta name="description" content={activeLecture.description} /> */}
      </Head>
      <CabinetWrapper>
        {/* ----------------------------- HEADER ------------------------------- */}
        <CabinetHeader user={user} title="Кабинет" titleLink={`/cabinet`} />
        <SideBar user={user} />
        <ContentWrapper>
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
  console.log('session', session)
  try {
    const events = await fetchingEvents(process.env.NEXTAUTH_SITE)
    return {
      props: {
        events,
        user: session?.user ? session.user : null,
      },
    }
  } catch {
    return {
      props: {
        events: null,
        user: session?.user ? session.user : null,
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
