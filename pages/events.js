// import dbConnect from '@utils/dbConnect'
// import DeviceCheck from '@components/DeviceCheck'
// import { H1, H2, H3, H4, P } from '@components/tags'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import {
//   fetchingAdditionalBlocks,
//   fetchingDirections,
//   fetchingEvents,
//   fetchingEventsUsers,
//   fetchingReviews,
//   fetchingSiteSettings,
// } from '@helpers/fetchers'
import Header from '@layouts/Header'
// import cn from 'classnames'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
// import Link from 'next/link'
// import { useRouter } from 'next/router'
// import formatDateTime from '@helpers/formatDateTime'
// import Masonry from '@components/Masonry'
// import BlockContainer from '@components/BlockContainer'
// import DirectionsBlock from '@blocks/DirectionsBlock'
// import PulseButton from '@components/PulseButton'
import ContactsBlock from '@blocks/ContactsBlock'
// import ReviewsBlock from '@blocks/ReviewsBlock'
// import PriceBlock from '@blocks/PriceBlock'
// import AdditionalBlocks from '@blocks/AdditionalBlocks'
import EventsBlock from '@blocks/EventsBlock'
// import AboutBlock from '@blocks/AboutBlock'
import TitleBlock from '@blocks/TitleBlock'
import { useEffect } from 'react'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import ModalsPortal from '@layouts/modals/ModalsPortal'
import eventsAtom from '@state/atoms/eventsAtom'
import directionsAtom from '@state/atoms/directionsAtom'
import additionalBlocksAtom from '@state/atoms/additionalBlocksAtom'
import usersAtom from '@state/atoms/usersAtom'
import reviewsAtom from '@state/atoms/reviewsAtom'
import paymentsAtom from '@state/atoms/paymentsAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import itemsFuncGenerator from '@state/itemsFuncGenerator'
import eventsUsersEditSelector from '@state/selectors/eventsUsersEditSelector'
import eventsUsersDeleteSelector from '@state/selectors/eventsUsersDeleteSelector'
import eventsUsersAtom from '@state/atoms/eventsUsersAtom'
import fetchProps from '@server/fetchProps'
import eventEditSelector from '@state/selectors/eventEditSelector'
import eventDeleteSelector from '@state/selectors/eventDeleteSelector'
import loggedUserActiveRoleAtom from '@state/atoms/loggedUserActiveRoleAtom'
import DeviceCheck from '@components/DeviceCheck'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'

export default function Home(props) {
  const { siteSettings } = props

  // const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)
  const [loggedUser, setLoggedUser] = useRecoilState(loggedUserAtom)
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
  // const eventsLoggedUser = useRecoilValue(
  //   eventsUsersByUserIdSelector(loggedUser?._id)
  // )

  const setItemsFunc = useSetRecoilState(itemsFuncAtom)
  const setEventsUsers = useSetRecoilState(eventsUsersEditSelector)
  const deleteEventsUsers = useSetRecoilState(eventsUsersDeleteSelector)

  const setEvent = useSetRecoilState(eventEditSelector)
  const deleteEvent = useSetRecoilState(eventDeleteSelector)

  useEffect(() => {
    if (!loggedUserActiveRole || props.loggedUser?.role !== loggedUser?.role)
      setLoggedUserActiveRole(props.loggedUser?.role ?? 'client')
    if (!loggedUserActiveStatus || props.loggedUser?.role !== 'dev')
      setLoggedUserActiveStatus(props.loggedUser?.status ?? 'novice')
    setLoggedUser(props.loggedUser)
    setLoggedUserActiveRole(props.loggedUser?.role ?? 'client')
    setLoggedUserActiveStatus(props.loggedUser?.status ?? 'novice')
    setEventsState(props.events)
    setDirectionsState(props.directions)
    setAdditionalBlocksState(props.additionalBlocks)
    setUsersState(props.users)
    setReviewsState(props.reviews)
    setPaymentsState(props.payments)
    setEventsUsersState(props.eventsUsers)
  }, [])

  useEffect(
    () =>
      setItemsFunc(
        itemsFuncGenerator({
          // toggleLoading,
          setEvent,
          deleteEvent,
          // setDirection,
          // deleteDirection,
          // setAdditionalBlock,
          // deleteAdditionalBlock,
          // setUser,
          // deleteUser,
          // setReview,
          // deleteReview,
          // setPayment,
          // deletePayment,
          setEventsUsers,
          deleteEventsUsers,
        })
      ),
    []
  )

  return (
    <>
      <Head>
        <title>{`Мероприятия - ЦОЗ "Половинка успеха"`}</title>
      </Head>
      <div>
        <div className="w-full bg-white">
          <DeviceCheck right />
          <Header />
          <TitleBlock userIsLogged={!!loggedUser} />
          <EventsBlock />
          <ContactsBlock siteSettings={siteSettings} />
        </div>
        <ModalsPortal />
      </div>
    </>
  )
}

export const getServerSideProps = async (context) => {
  try {
    const session = await getSession({ req: context.req })

    const fetchedProps = await fetchProps()

    return {
      props: {
        ...fetchedProps,
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
        loggedUser: session?.user ?? null,
        error: JSON.parse(JSON.stringify(error)),
      },
    }
  }
}
