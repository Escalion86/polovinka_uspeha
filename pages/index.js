// import dbConnect from '@utils/dbConnect'
import DeviceCheck from '@components/DeviceCheck'
import { H1, H2, H3, H4, P } from '@components/tags'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  fetchingAdditionalBlocks,
  fetchingDirections,
  fetchingEvents,
  fetchingEventsUsers,
  fetchingPayments,
  fetchingReviews,
  fetchingSiteSettings,
  fetchingUsers,
} from '@helpers/fetchers'
import Header from '@layouts/Header'
import cn from 'classnames'
import { getSession, signOut } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import formatDateTime from '@helpers/formatDateTime'
import Masonry from '@components/Masonry'
import BlockContainer from '@components/BlockContainer'
import DirectionsBlock from '@blocks/DirectionsBlock'
import PulseButton from '@components/PulseButton'
import ContactsBlock from '@blocks/ContactsBlock'
import ReviewsBlock from '@blocks/ReviewsBlock'
import PriceBlock from '@blocks/PriceBlock'
import AdditionalBlocks from '@blocks/AdditionalBlocks'
import EventsBlock from '@blocks/EventsBlock'
import AboutBlock from '@blocks/AboutBlock'
import TitleBlock from '@blocks/TitleBlock'
import { useEffect, useState } from 'react'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import { useSetRecoilState } from 'recoil'
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
    events,
    directions,
    reviews,
    loggedUser,
    additionalBlocks,
    siteSettings,
  } = props
  const [loading, setLoading] = useState(true)

  const setLoggedUserState = useSetRecoilState(loggedUserAtom)
  const setEventsState = useSetRecoilState(eventsAtom)
  const setDirectionsState = useSetRecoilState(directionsAtom)
  const setAdditionalBlocksState = useSetRecoilState(additionalBlocksAtom)
  // const setUsersState = useSetRecoilState(usersAtom)
  const setReviewsState = useSetRecoilState(reviewsAtom)
  // const setPaymentsState = useSetRecoilState(paymentsAtom)
  const setEventsUsersState = useSetRecoilState(eventsUsersAtom)

  const setItemsFunc = useSetRecoilState(itemsFuncAtom)
  const setEventsUsers = useSetRecoilState(eventsUsersEditSelector)
  const deleteEventsUsers = useSetRecoilState(eventsUsersDeleteSelector)

  const filteredEvents = events.filter(
    (event) => event.showOnSite && new Date(event.date) >= new Date()
  )
  const filteredReviews = reviews.filter((review) => review.showOnSite)
  const filteredDirections = directions.filter(
    (direction) => direction.showOnSite
  )
  const filteredAdditionalBlocks = additionalBlocks.filter(
    (additionalBlock) => additionalBlock.showOnSite
  )

  useEffect(() => {
    setLoggedUserState(props.loggedUser)
    setEventsState(props.events)
    setDirectionsState(props.directions)
    setAdditionalBlocksState(props.additionalBlocks)
    // setUsersState(props.users)
    setReviewsState(props.reviews)
    // setPaymentsState(props.payments)
    setEventsUsersState(props.eventsUsers)
  }, [])

  useEffect(() => {
    setItemsFunc(
      itemsFuncGenerator({
        // toggleLoading,
        // setEvent,
        // deleteEvent,
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
    )
    setLoading(false)
  }, [])

  return (
    <>
      <Head>
        <title>Центр осознанных знакомств - "Половинка успеха"</title>
      </Head>
      <div>
        {loading ? (
          <div className="w-full h-screen">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="w-full bg-white">
            {/* <DeviceCheck /> */}
            <Header
              events={filteredEvents}
              directions={filteredDirections}
              additionalBlocks={filteredAdditionalBlocks}
              reviews={filteredReviews}
              loggedUser={loggedUser}
            />
            <TitleBlock userIsLogged={!!loggedUser} />
            <AboutBlock />
            <EventsBlock events={filteredEvents} maxEvents={4} />
            <DirectionsBlock directions={filteredDirections} />
            <AdditionalBlocks
              additionalBlocks={filteredAdditionalBlocks}
              inverse={
                directions &&
                directions.filter((direction) => direction.showOnSite).length %
                  2 ===
                  1
              }
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
  const session = await getSession({ req: context.req })
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
    const siteSettings = await fetchingSiteSettings(process.env.NEXTAUTH_SITE)

    // const events = await fetchingEvents(process.env.NEXTAUTH_SITE)
    // const directions = await fetchingDirections(process.env.NEXTAUTH_SITE)
    // const reviews = await fetchingReviews(process.env.NEXTAUTH_SITE)
    // const additionalBlocks = await fetchingAdditionalBlocks(
    //   process.env.NEXTAUTH_SITE
    // )
    // const eventsUsers = await fetchingEventsUsers(process.env.NEXTAUTH_SITE)
    // const siteSettings = await fetchingSiteSettings(process.env.NEXTAUTH_SITE)
    // console.log('events', events)
    // console.log('directions', directions)
    // console.log('reviews', reviews)
    // console.log('additionalBlocks', additionalBlocks)
    return {
      props: {
        // events,
        // directions: directions.filter((direction) => direction.showOnSite),
        // reviews: reviews.filter((review) => review.showOnSite),
        // additionalBlocks,
        // eventsUsers,
        // siteSettings,
        // loggedUser: session?.user ? session.user : null,
        users,
        events,
        directions,
        reviews,
        additionalBlocks,
        eventsUsers,
        payments,
        siteSettings,
        loggedUser: session?.user ? session.user : null,
      },
    }
  } catch {
    return {
      props: {
        // events: null,
        // directions: null,
        // reviews: null,
        // additionalBlocks: null,
        // eventsUsers: null,
        // siteSettings: null,
        // loggedUser: session?.user ? session.user : null,
        users: null,
        events: null,
        directions: null,
        reviews: null,
        additionalBlocks: null,
        eventsUsers: null,
        payments: null,
        siteSettings: null,
        loggedUser: session?.user ? session.user : null,
      },
      // notFound: true,
    }
  }
}
