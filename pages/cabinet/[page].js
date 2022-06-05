import { getSession } from 'next-auth/react'

import Head from 'next/head'
import 'react-edit-text/dist/index.css'

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
  fetchingPayments,
} from '@helpers/fetchers'
import { useState, useEffect } from 'react'

import ModalsPortal from '@layouts/modals/ModalsPortal'
import BurgerLayout from '@layouts/BurgerLayout'
import DeviceCheck from '@components/DeviceCheck'
import { useSetRecoilState } from 'recoil'
import eventsAtom from '@state/atoms/eventsAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import itemsFuncGenerator from '@state/itemsFuncGenerator'
import toggleLoadingSelector from '@state/selectors/toggleLoadingSelector'
import eventEditSelector from '@state/selectors/eventEditSelector'
import directionsAtom from '@state/atoms/directionsAtom'
import directionEditSelector from '@state/selectors/directionEditSelector'
import eventDeleteSelector from '@state/selectors/eventDeleteSelector'
import directionDeleteSelector from '@state/selectors/directionDeleteSelector'
import reviewEditSelector from '@state/selectors/reviewEditSelector'
import reviewDeleteSelector from '@state/selectors/reviewDeleteSelector'
import userEditSelector from '@state/selectors/userEditSelector'
import userDeleteSelector from '@state/selectors/userDeleteSelector'
import additionalBlockEditSelector from '@state/selectors/additionalBlockEditSelector'
import additionalBlockDeleteSelector from '@state/selectors/additionalBlockDeleteSelector'
import additionalBlocksAtom from '@state/atoms/additionalBlocksAtom'
import usersAtom from '@state/atoms/usersAtom'
import reviewsAtom from '@state/atoms/reviewsAtom'
import paymentEditSelector from '@state/selectors/paymentEditSelector'
import paymentsDeleteSelector from '@state/selectors/paymentsDeleteSelector'
import paymentsAtom from '@state/atoms/paymentsAtom'

function CabinetPage(props) {
  const { page, loggedUser } = props

  const setEventsState = useSetRecoilState(eventsAtom)
  const setDirectionsState = useSetRecoilState(directionsAtom)
  const setAdditionalBlocksState = useSetRecoilState(additionalBlocksAtom)
  const setUsersState = useSetRecoilState(usersAtom)
  const setReviewsState = useSetRecoilState(reviewsAtom)
  const setPaymentsState = useSetRecoilState(paymentsAtom)

  const setEvent = useSetRecoilState(eventEditSelector)
  const deleteEvent = useSetRecoilState(eventDeleteSelector)
  const setDirection = useSetRecoilState(directionEditSelector)
  const deleteDirection = useSetRecoilState(directionDeleteSelector)
  const setAdditionalBlock = useSetRecoilState(additionalBlockEditSelector)
  const deleteAdditionalBlock = useSetRecoilState(additionalBlockDeleteSelector)
  const setUser = useSetRecoilState(userEditSelector)
  const deleteUser = useSetRecoilState(userDeleteSelector)
  const setReview = useSetRecoilState(reviewEditSelector)
  const deleteReview = useSetRecoilState(reviewDeleteSelector)
  const setPayment = useSetRecoilState(paymentEditSelector)
  const deletePayment = useSetRecoilState(paymentsDeleteSelector)

  const setItemsFunc = useSetRecoilState(itemsFuncAtom)
  const toggleLoading = useSetRecoilState(toggleLoadingSelector)

  useEffect(
    () =>
      setItemsFunc(
        itemsFuncGenerator({
          toggleLoading,
          setEvent,
          deleteEvent,
          setDirection,
          deleteDirection,
          setAdditionalBlock,
          deleteAdditionalBlock,
          setUser,
          deleteUser,
          setReview,
          deleteReview,
          setPayment,
          deletePayment,
        })
      ),
    []
  )

  // const setEvent = useSetRecoilState(eventAtom())
  // const setItemFunc = useSetRecoilState(itemsAtom)

  // const setEventAtom = useRecoilCallback(
  //   ({ set }) =>
  //     (event) => {
  //       set(eventsIds, (prev) => {
  //         if (prev.includes(event._id)) return prev
  //         return [...prev, event._id]
  //       })
  //       set(eventsAtom(event._id), event)
  //     },
  //   []
  // )

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
    setEventsState(props.events)
    setDirectionsState(props.directions)
    setAdditionalBlocksState(props.additionalBlocks)
    setUsersState(props.users)
    setReviewsState(props.reviews)
    setPaymentsState(props.payments)

    // props.events.forEach((event) => {
    //   setEventAtom(event)
    // })
    // setPropsState(props)
    setLoading(false)
    // setItemFunc({
    //   event: {setShowOnSite:
    //     async (eventId) => {
    //       const event = useRecoilValue(eventAtom(eventId))
    //       setLoading(true)
    //       await putData(
    //         `/api/events/${eventId}`,
    //         {
    //           showOnSite: !event.showOnSite,
    //         },
    //         (data) => {
    //           setEvent(data)
    //           setLoading(false)
    //         }
    //       )
    //     }
    //   }
    // })
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
    const payments = await fetchingPayments(process.env.NEXTAUTH_SITE)
    return {
      props: {
        users,
        events,
        directions,
        reviews,
        page,
        additionalBlocks,
        eventsUsers,
        payments,
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
        payments: null,
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
