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
import { useRecoilState, useSetRecoilState } from 'recoil'
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
import Users from '@models/Users'
import Events from '@models/Events'
import Directions from '@models/Directions'
import Reviews from '@models/Reviews'
import AdditionalBlocksModel from '@models/AdditionalBlocks'
import EventsUsers from '@models/EventsUsers'
import Payments from '@models/Payments'
import Site from '@models/Site'
import dbConnect from '@utils/dbConnect'

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
    loggedUser,
    users,
    events,
    directions,
    reviews,
    additionalBlocks,
    eventsUsers,
    payments,
    siteSettings,
  } = props
  const [loading, setLoading] = useState(true)

  console.log('props.error', props.error)

  const setLoggedUserState = useSetRecoilState(loggedUserAtom)
  const [eventsState, setEventsState] = useRecoilState(eventsAtom)
  const [directionsState, setDirectionsState] = useRecoilState(directionsAtom)
  const [additionalBlocksState, setAdditionalBlocksState] =
    useRecoilState(additionalBlocksAtom)
  const setUsersState = useSetRecoilState(usersAtom)
  const [reviewsState, setReviewsState] = useRecoilState(reviewsAtom)
  const setPaymentsState = useSetRecoilState(paymentsAtom)
  const setEventsUsersState = useSetRecoilState(eventsUsersAtom)

  const setItemsFunc = useSetRecoilState(itemsFuncAtom)
  const setEventsUsers = useSetRecoilState(eventsUsersEditSelector)
  const deleteEventsUsers = useSetRecoilState(eventsUsersDeleteSelector)

  console.log('eventsState', eventsState)
  const filteredEvents = eventsState.filter(
    (event) => event.showOnSite && new Date(event.date) >= new Date()
  )
  const filteredReviews = reviewsState.filter((review) => review.showOnSite)
  const filteredDirections = directionsState.filter(
    (direction) => direction.showOnSite
  )
  const filteredAdditionalBlocks = additionalBlocksState.filter(
    (additionalBlock) => additionalBlock.showOnSite
  )

  useEffect(() => {
    setLoggedUserState(props.loggedUser)
    setEventsState(props.events)
    setDirectionsState(props.directions)
    setAdditionalBlocksState(props.additionalBlocks)
    setUsersState(props.users)
    setReviewsState(props.reviews)
    setPaymentsState(props.payments)
    setEventsUsersState(props.eventsUsers)

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
            {loggedUser?.role === 'dev' && <DeviceCheck right />}
            <Header
              events={filteredEvents}
              directions={filteredDirections}
              additionalBlocks={filteredAdditionalBlocks}
              reviews={filteredReviews}
              loggedUser={loggedUser}
            />
            <TitleBlock userIsLogged={!!loggedUser} />
            <AboutBlock />
            <EventsBlock
              events={filteredEvents}
              maxEvents={4}
              hideBlockOnZeroEvents
            />
            <DirectionsBlock directions={filteredDirections} />
            <AdditionalBlocks
              additionalBlocks={filteredAdditionalBlocks}
              inverse={
                directionsState &&
                directionsState.filter((direction) => direction.showOnSite)
                  .length %
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
  console.log(`start getServerSideProps`)
  const session = await getSession({ req: context.req })
  console.log('session', session)
  // console.log('1')
  // const session = await getSession({ req })
  // console.log('2')
  // if (!session || !session.user._id)
  //   return res?.status(400).json({ success: false })
  // console.log('3')
  // const { user } = session
  // console.log(`user`, user)

  try {
    console.log(`start dbConnect`)
    await dbConnect()
    console.log(`finished dbConnect`)
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
        users: JSON.parse(JSON.stringify(users)),
        events: JSON.parse(JSON.stringify(events)),
        directions: JSON.parse(JSON.stringify(directions)),
        reviews: JSON.parse(JSON.stringify(reviews)),
        additionalBlocks: JSON.parse(JSON.stringify(additionalBlocks)),
        eventsUsers: JSON.parse(JSON.stringify(eventsUsers)),
        payments: JSON.parse(JSON.stringify(payments)),
        siteSettings: JSON.parse(JSON.stringify(siteSettings)),
        loggedUser: session?.user ?? null,
      },
    }
  } catch (error) {
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
        loggedUser: session?.user ?? null,
        error: JSON.parse(JSON.stringify(error)),
      },
      // notFound: true,
    }
  }
}
