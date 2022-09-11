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
  fetchingLog,
} from '@helpers/fetchers'
import { useState, useEffect } from 'react'

import ModalsPortal from '@layouts/modals/ModalsPortal'
import BurgerLayout from '@layouts/BurgerLayout'
import DeviceCheck from '@components/DeviceCheck'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import eventsAtom from '@state/atoms/eventsAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import itemsFuncGenerator from '@state/itemsFuncGenerator'
// import toggleLoadingSelector from '@state/selectors/toggleLoadingSelector'
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
// import dbConnect from '@utils/dbConnect'
// import SiteSettings from '@models/SiteSettings'
// import Payments from '@models/Payments'
// import EventsUsers from '@models/EventsUsers'
// import Reviews from '@models/Reviews'
// import Directions from '@models/Directions'
// import Events from '@models/Events'
// import Users from '@models/Users'
// import AdditionalBlocksModel from '@models/AdditionalBlocks'
import fetchProps from '@server/fetchProps'
// import stateAtom from '@state/atoms/stateAtom'
import setLoadingSelector from '@state/selectors/setLoadingSelector'
// import setNotLoadingSelector from '@state/selectors/setNotLoadingSelector'
import setErrorSelector from '@state/selectors/setErrorSelector'
import setNotLoadingSelector from '@state/selectors/setNotLoadingSelector'
import setNotErrorSelector from '@state/selectors/setNotErrorSelector'
import { modalsFuncAtom } from '@state/atoms'
import LoadingSpinner from '@components/LoadingSpinner'
import Header from '@layouts/Header'
import TitleBlock from '@blocks/TitleBlock'
import ContactsBlock from '@blocks/ContactsBlock'
import visibleEventsForUser from '@helpers/visibleEventsForUser'
import eventFunc from '@layouts/modals/modalsFunc/eventFunc'
import eventViewFunc from '@layouts/modals/modalsFunc/eventViewFunc'
import { H2 } from '@components/tags'
import loggedUserActiveRoleAtom from '@state/atoms/loggedUserActiveRoleAtom'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'

// TODO Сделать копирование БД с main на dev
// TODO Сделать переключение с БД main на dev

function EventPage(props) {
  const { siteSettings } = props
  const eventId = props.id

  const [loading, setLoading] = useState(true)

  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const setLoggedUserState = useSetRecoilState(loggedUserAtom)
  const [loggedUserActiveRole, setLoggedUserActiveRole] = useRecoilState(
    loggedUserActiveRoleAtom
  )
  const [loggedUserActiveStatus, setLoggedUserActiveStatus] = useRecoilState(
    loggedUserActiveStatusAtom
  )
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

  const [itemsFunc, setItemsFunc] = useRecoilState(itemsFuncAtom)
  const setLoadingCard = useSetRecoilState(setLoadingSelector)
  const setNotLoadingCard = useSetRecoilState(setNotLoadingSelector)
  const setErrorCard = useSetRecoilState(setErrorSelector)
  const setNotErrorCard = useSetRecoilState(setNotErrorSelector)

  useEffect(() => {
    if (Object.keys(modalsFunc).length > 0 && !itemsFunc)
      setItemsFunc(
        itemsFuncGenerator({
          // toggleLoadingCard,
          modalsFunc,
          setLoading,
          setLoadingCard,
          setNotLoadingCard,
          setErrorCard,
          setNotErrorCard,
          // setError,
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
      )
  }, [modalsFunc])

  useEffect(() => {
    if (!loggedUserActiveRole || props.loggedUser?.role !== loggedUser?.role)
      setLoggedUserActiveRole(props.loggedUser?.role ?? 'client')
    if (!loggedUserActiveStatus || props.loggedUser?.role !== 'dev')
      setLoggedUserActiveStatus(props.loggedUser?.status ?? 'novice')
    setLoggedUserState(props.loggedUser)
    setEventsState(props.events)
    setDirectionsState(props.directions)
    setAdditionalBlocksState(props.additionalBlocks)
    setUsersState(props.users)
    setReviewsState(props.reviews)
    setPaymentsState(props.payments)
    setEventsUsersState(props.eventsUsers)

    setLoading(false)
  }, [])

  const event =
    eventsState?.length > 0 && !loading
      ? eventsState.find((event) => event._id === eventId)
      : undefined
  const title = event?.title ?? ''

  const Event = () =>
    eventsState?.length > 0 && !loading
      ? eventViewFunc(eventId).Children({})
      : null

  return (
    <>
      <Head>
        <title>
          {`Половинка успеха - Мероприятие${title ? ' "' + title + '"' : ''}`}
        </title>
        {/* <meta name="description" content={activeLecture.description} /> */}
      </Head>
      {loading ? (
        <div className="w-full h-screen">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="w-full bg-white">
          <DeviceCheck right />
          <Header />
          {/* <TitleBlock userIsLogged={!!loggedUserState} /> */}
          <div className="pb-6 mt-2 border-b border-gray-700 tablet:mt-9">
            <H2 className="mb-4">Мероприятие</H2>
            <Event />
          </div>
          <ContactsBlock siteSettings={siteSettings} />
        </div>
      )}
      <ModalsPortal />
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

  const fetchedProps = await fetchProps()

  return {
    props: {
      ...fetchedProps,
      id,
      loggedUser: session?.user ?? null,
    },
  }
}
