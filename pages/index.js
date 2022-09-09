// import dbConnect from '@utils/dbConnect'
import DeviceCheck from '@components/DeviceCheck'
// import { H1, H2, H3, H4, P } from '@components/tags'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import {
//   fetchingAdditionalBlocks,
//   fetchingDirections,
//   fetchingEvents,
//   fetchingEventsUsers,
//   fetchingPayments,
//   fetchingReviews,
//   fetchingSiteSettings,
//   fetchingUsers,
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
import DirectionsBlock from '@blocks/DirectionsBlock'
// import PulseButton from '@components/PulseButton'
import ContactsBlock from '@blocks/ContactsBlock'
import ReviewsBlock from '@blocks/ReviewsBlock'
// import PriceBlock from '@blocks/PriceBlock'
import AdditionalBlocks from '@blocks/AdditionalBlocks'
import EventsBlock from '@blocks/EventsBlock'
import AboutBlock from '@blocks/AboutBlock'
import TitleBlock from '@blocks/TitleBlock'
import { useEffect, useState } from 'react'
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
import LoadingSpinner from '@components/LoadingSpinner'
// import Users from '@models/Users'
// import Events from '@models/Events'
// import Directions from '@models/Directions'
// import Reviews from '@models/Reviews'
// import AdditionalBlocksModel from '@models/AdditionalBlocks'
// import EventsUsers from '@models/EventsUsers'
// import Payments from '@models/Payments'
// import SiteSettings from '@models/SiteSettings'
// import dbConnect from '@utils/dbConnect'
import fetchProps from '@server/fetchProps'
import { fetchingLog } from '@helpers/fetchers'
import eventEditSelector from '@state/selectors/eventEditSelector'
import eventDeleteSelector from '@state/selectors/eventDeleteSelector'
import directionEditSelector from '@state/selectors/directionEditSelector'
import directionDeleteSelector from '@state/selectors/directionDeleteSelector'
import additionalBlockEditSelector from '@state/selectors/additionalBlockEditSelector'
import additionalBlockDeleteSelector from '@state/selectors/additionalBlockDeleteSelector'
import userEditSelector from '@state/selectors/userEditSelector'
import userDeleteSelector from '@state/selectors/userDeleteSelector'
import reviewEditSelector from '@state/selectors/reviewEditSelector'
import reviewDeleteSelector from '@state/selectors/reviewDeleteSelector'
import paymentEditSelector from '@state/selectors/paymentEditSelector'
import paymentsDeleteSelector from '@state/selectors/paymentsDeleteSelector'
import eventsUsersDeleteByEventIdSelector from '@state/selectors/eventsUsersDeleteByEventIdSelector'
// import toggleLoadingSelector from '@state/selectors/toggleLoadingSelector'
// import eventsUsersByUserIdSelector from '@state/selectors/eventsUsersByUserIdSelector'
import visibleEventsForUser from '@helpers/visibleEventsForUser'
import setLoadingSelector from '@state/selectors/setLoadingSelector'
import setNotLoadingSelector from '@state/selectors/setNotLoadingSelector'
import setErrorSelector from '@state/selectors/setErrorSelector'
import setNotErrorSelector from '@state/selectors/setNotErrorSelector'
import { modalsFuncAtom } from '@state/atoms'
import loggedUserActiveRoleAtom from '@state/atoms/loggedUserActiveRoleAtom'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'

// const sertificat = {
//   image: '/img/other/IF8t5okaUQI_1.webp',
//   title: 'Подарочный сертификат',
//   description:
//     'Лучший подарок для человека - это эмоции! Наш подарочный сертификат: способ подарить эти незабываемые эмоции. Подарочный сертификат нашего Центра осознанных знакомств номиналом 1500 руб, можно использовать на одно мероприятие на выбор в течение года: 1. Быстрые свидания Speed-Dating 1 раз в месяц. 2. Одно индивидуальное свидание (подбираются партнёры с учетом психологической совместимости и возрастной категории). 3. Свидание по-новому — новые интересные форматы общих встреч (мастер-классы, "Мафия", прогулки, походы и пикники знакомств) проводятся 1 раз в месяц. Подарите сертификат близкому человеку: подруге или другу, сестре или брату - тому, кто в поисках своей второй половинки, но ещё не встретил её в силу занятости и других причин. На встрече он (она) получит: - новые эмоции - приятные и полезные знакомства, как для личной жизни, так и для своего увлечения или профессиональной деятельности - романтическую обстановку. Возрастная категория участника по сертификату 25-40 лет. Сертификат можно приобрести как электронно, так и в печатном виде с доставкой.',
// }

// const CardEvent = ({ event }) => (
//   <div className="flex flex-col items-center bg-white border border-gray-600 rounded-lg gap-y-2">
//     {event.image && (
//       <img
//         className="object-cover w-full h-80"
//         src={event.image}
//         alt="event"
//         // width={48}
//         // height={48}
//       />
//     )}
//     <div className="w-full p-4">
//       <div className="flex items-center justify-center w-full laptop:h-16">
//         <H4>{event.title}</H4>
//       </div>
//       <P>{event.description}</P>
//     </div>
//   </div>
// )

export default function Home(props) {
  const {
    // loggedUser,
    // users,
    // events,
    // directions,
    // reviews,
    // additionalBlocks,
    // eventsUsers,
    // payments,
    siteSettings,
  } = props
  const [loading, setLoading] = useState(true)

  if (props.error && Object.keys(props.error).length > 0)
    console.log('props.error', props.error)

  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)
  const [loggedUserState, setLoggedUserState] = useRecoilState(loggedUserAtom)
  const setLoggedUserActiveRole = useSetRecoilState(loggedUserActiveRoleAtom)
  const [loggedUserActiveStatus, setLoggedUserActiveStatus] = useRecoilState(
    loggedUserActiveStatusAtom
  )
  const [eventsState, setEventsState] = useRecoilState(eventsAtom)
  const [directionsState, setDirectionsState] = useRecoilState(directionsAtom)
  const [additionalBlocksState, setAdditionalBlocksState] =
    useRecoilState(additionalBlocksAtom)
  const setUsersState = useSetRecoilState(usersAtom)
  const [reviewsState, setReviewsState] = useRecoilState(reviewsAtom)
  const setPaymentsState = useSetRecoilState(paymentsAtom)
  const [eventsUsersState, setEventsUsersState] =
    useRecoilState(eventsUsersAtom)

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
  // const toggleLoading = useSetRecoilState(toggleLoadingSelector)
  const setLoadingCard = useSetRecoilState(setLoadingSelector)
  const setNotLoadingCard = useSetRecoilState(setNotLoadingSelector)
  const setErrorCard = useSetRecoilState(setErrorSelector)
  const setNotErrorCard = useSetRecoilState(setNotErrorSelector)

  // const loggedUser = useRecoilValue(loggedUserAtom)
  // const eventsLoggedUser = useRecoilValue(
  //   eventsUsersByUserIdSelector(loggedUser?._id)
  // )

  const filteredEvents = visibleEventsForUser(
    eventsState,
    eventsUsersState,
    loggedUserState,
    true,
    isLoggedUserAdmin,
    loggedUserActiveStatus
  )
  // loggedUser?.role === 'admin' || loggedUser?.role === 'dev'
  //   ? events
  //   : events.filter((event) => {
  //       if (!event.showOnSite || new Date(event.date) < new Date()) return false

  //       const eventUser = eventsLoggedUser.find(
  //         (eventUser) => eventUser.eventId === event._id
  //       )
  //       return (
  //         eventUser?.status !== 'ban' &&
  //         (!event.usersStatusAccess ||
  //           event.usersStatusAccess[loggedUser?.status ?? 'novice'])
  //       )
  //     })

  // const filteredEvents = eventsState.filter(
  //   (event) => event.showOnSite && new Date(event.date) >= new Date()
  // )
  const filteredReviews = reviewsState.filter((review) => review.showOnSite)
  const filteredDirections = directionsState.filter(
    (direction) => direction.showOnSite
  )
  const filteredAdditionalBlocks = additionalBlocksState.filter(
    (additionalBlock) => additionalBlock.showOnSite
  )

  useEffect(() => {
    setLoggedUserState(props.loggedUser)
    setLoggedUserActiveRole(props.loggedUser?.role ?? 'client')
    setLoggedUserActiveStatus(props.loggedUser?.status ?? 'novice')
    setEventsState(props.events)
    setDirectionsState(props.directions)
    setAdditionalBlocksState(props.additionalBlocks)
    setUsersState(props.users)
    setReviewsState(props.reviews)
    setPaymentsState(props.payments)
    setEventsUsersState(props.eventsUsers)

    setLoading(false)
  }, [])

  useEffect(() => {
    if (Object.keys(modalsFunc).length > 0 && !itemsFunc)
      setItemsFunc(
        itemsFuncGenerator({
          setLoading,
          modalsFunc,
          setLoadingCard,
          setNotLoadingCard,
          setErrorCard,
          setNotErrorCard,
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

  const directionsBlocksInverse = filteredEvents.length > 0
  const additionalBlocksInverse =
    ((directionsBlocksInverse ? 1 : 0) + filteredDirections.length) % 2 === 0

  return (
    <>
      <Head>
        <title>{`Центр осознанных знакомств - "Половинка успеха"`}</title>
      </Head>
      <div>
        {loading ? (
          <div className="w-full h-screen">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="w-full bg-white">
            <DeviceCheck right />
            <Header
              events={filteredEvents}
              directions={filteredDirections}
              additionalBlocks={filteredAdditionalBlocks}
              reviews={filteredReviews}
              loggedUser={loggedUserState}
            />
            <TitleBlock userIsLogged={!!loggedUserState} />
            <AboutBlock />
            <EventsBlock
              title="Ближайшие мероприятия"
              events={filteredEvents}
              maxEvents={4}
              hideBlockOnZeroEvents
            />
            <DirectionsBlock
              directions={filteredDirections}
              startInverse={directionsBlocksInverse}
            />
            <AdditionalBlocks
              additionalBlocks={filteredAdditionalBlocks}
              startInverse={additionalBlocksInverse}
            />
            {/* <PriceBlock /> */}
            <ReviewsBlock reviews={filteredReviews} />
            <ContactsBlock siteSettings={siteSettings} />
            {/* <BlockContainer className="text-white bg-black">
          <H3>Есть знания, но не знаете как ими поделиться?</H3>
          <P>
            Просто зарегистрируйтесь в системе и начните заполнять курс своими
            знаниями. Не беспокойтесь если у Вас в голове "каша", система
            позволит менять местами блоки и структурировать Ваши знания
          </P>
        </BlockContainer>
        <BlockContainer id="tarifs" className="bg-gray-200">
          <H3>Тарифы</H3>
          <P>
            Проект находится в стадии разработки и тестирования. Размещение по
            индивидуальным условиям.
          </P>
        </BlockContainer> */}
            {/* <BlockContainer id="contacts" className="bg-gray-200">
          <H3>Контакты</H3>
        </BlockContainer> */}
            {/* <div className="flex flex-col items-start px-10 py-5 text-sm font-thin text-white bg-black min-h-80 tablet:px-20">
          <div>
            © ИП Белинский Алексей Алексеевич, ИНН 245727560982, ОГРНИП
            319246800103511
          </div>
        </div> */}
          </div>
        )}
        <ModalsPortal />
      </div>
    </>
  )
}

export const getServerSideProps = async (context) => {
  try {
    await fetchingLog(
      { from: 'start getServerSideProps in index' },
      process.env.NEXTAUTH_SITE
    )
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
