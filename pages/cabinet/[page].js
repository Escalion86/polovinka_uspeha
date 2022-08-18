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
  fetchingSiteSettings,
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
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import eventsUsersEditSelector from '@state/selectors/eventsUsersEditSelector'
import eventsUsersDeleteSelector from '@state/selectors/eventsUsersDeleteSelector'
import eventsUsersAtom from '@state/atoms/eventsUsersAtom'
import eventsUsersDeleteByEventIdSelector from '@state/selectors/eventsUsersDeleteByEventIdSelector'
import isUserQuestionnaireFilled from '@helpers/isUserQuestionnaireFilled'
import dbConnect from '@utils/dbConnect'
import Site from '@models/Site'
import Payments from '@models/Payments'
import EventsUsers from '@models/EventsUsers'
import Reviews from '@models/Reviews'
import Directions from '@models/Directions'
import Events from '@models/Events'
import Users from '@models/Users'
import AdditionalBlocksModel from '@models/AdditionalBlocks'

// TODO Сделать копирование БД с main на dev
// TODO Сделать переключение с БД main на dev

function CabinetPage(props) {
  const { page, loggedUser } = props

  const [loading, setLoading] = useState(true)

  const setLoggedUserState = useSetRecoilState(loggedUserAtom)
  const setEventsState = useSetRecoilState(eventsAtom)
  const setDirectionsState = useSetRecoilState(directionsAtom)
  const setAdditionalBlocksState = useSetRecoilState(additionalBlocksAtom)
  const setUsersState = useSetRecoilState(usersAtom)
  const setReviewsState = useSetRecoilState(reviewsAtom)
  const setPaymentsState = useSetRecoilState(paymentsAtom)
  const setEventsUsersState = useSetRecoilState(eventsUsersAtom)

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
  const setEventsUsers = useSetRecoilState(eventsUsersEditSelector)
  const deleteEventsUsers = useSetRecoilState(eventsUsersDeleteSelector)
  const deleteEventsUsersByEventId = useSetRecoilState(
    eventsUsersDeleteByEventIdSelector
  )

  const setItemsFunc = useSetRecoilState(itemsFuncAtom)
  const toggleLoading = useSetRecoilState(toggleLoadingSelector)

  useEffect(() => {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    })
  }, [])

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
          setEventsUsers,
          deleteEventsUsers,
          deleteEventsUsersByEventId,
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
    setLoggedUserState(props.loggedUser)
    setEventsState(props.events)
    setDirectionsState(props.directions)
    setAdditionalBlocksState(props.additionalBlocks)
    setUsersState(props.users)
    setReviewsState(props.reviews)
    setPaymentsState(props.payments)
    setEventsUsersState(props.eventsUsers)

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
            {loggedUser?.role === 'dev' && <DeviceCheck right />}
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

  console.log('params', params)
  console.log('page', page)

  console.log('session', session)
  if (!session?.user) {
    return {
      redirect: {
        destination: `/`,
      },
    }
  }

  if (page !== 'questionnaire' && !isUserQuestionnaireFilled(session.user)) {
    return {
      redirect: {
        destination: `/cabinet/questionnaire`,
      },
    }
  }

  try {
    await dbConnect()
    // const users = await Users.find({})
    // const events = await Events.find({})
    // const directions = await Directions.find({})
    // const reviews = await Reviews.find({})
    // const additionalBlocks = await AdditionalBlocksModel.find({})
    // const eventsUsers = await EventsUsers.find({})
    // const payments = await Payments.find({})
    // const siteSettings = await Site.find({})
    console.time('Loading time')
    console.time('users')
    const users = await Users.find({})
    // const users = await fetchingUsers(process.env.NEXTAUTH_SITE)
    console.timeEnd('users')
    console.time('events')
    const events = await Events.find({})
    // const events = await fetchingEvents(process.env.NEXTAUTH_SITE)
    console.timeEnd('events')
    console.time('directions')
    const directions = await Directions.find({})
    // const directions = await fetchingDirections(process.env.NEXTAUTH_SITE)
    console.timeEnd('directions')
    console.time('reviews')
    const reviews = await Reviews.find({})
    // const reviews = await fetchingReviews(process.env.NEXTAUTH_SITE)
    console.timeEnd('reviews')
    console.time('additionalBlocks')
    const additionalBlocks = await AdditionalBlocksModel.find({})
    // const additionalBlocks = await fetchingAdditionalBlocks(
    //   process.env.NEXTAUTH_SITE
    // )
    console.timeEnd('additionalBlocks')
    console.time('eventsUsers')
    const eventsUsers = await EventsUsers.find({})
    // const eventsUsers = await fetchingEventsUsers(process.env.NEXTAUTH_SITE)
    console.timeEnd('eventsUsers')
    console.time('payments')
    const payments = await Payments.find({})
    // const payments = await fetchingPayments(process.env.NEXTAUTH_SITE)
    console.timeEnd('payments')
    console.time('siteSettings')
    const siteSettings = await Site.find({})
    // const siteSettings = await fetchingSiteSettings(process.env.NEXTAUTH_SITE)
    console.timeEnd('siteSettings')
    console.timeEnd('Loading time')
    // dbDisconnect()

    return {
      props: {
        // users,
        // events,
        // directions,
        // reviews,
        // additionalBlocks,
        // eventsUsers,
        // payments,
        // siteSettings,
        users: JSON.parse(JSON.stringify(users)),
        events: JSON.parse(JSON.stringify(events)),
        directions: JSON.parse(JSON.stringify(directions)),
        reviews: JSON.parse(JSON.stringify(reviews)),
        additionalBlocks: JSON.parse(JSON.stringify(additionalBlocks)),
        eventsUsers: JSON.parse(JSON.stringify(eventsUsers)),
        payments: JSON.parse(JSON.stringify(payments)),
        siteSettings: JSON.parse(JSON.stringify(siteSettings)),
        page,
        loggedUser: session?.user ?? null,
      },
    }
  } catch (error) {
    return {
      props: {
        users: null,
        events: null,
        directions: null,
        reviews: null,
        additionalBlocks: null,
        eventsUsers: null,
        payments: null,
        siteSettings: null,
        page,
        loggedUser: session?.user ?? null,
        error: JSON.parse(JSON.stringify(error)),
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
