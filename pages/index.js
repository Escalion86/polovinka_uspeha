// import dbConnect from '@utils/dbConnect'
import DeviceCheck from '@components/DeviceCheck'
import { H1, H2, H3, H4, P } from '@components/tags'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  fetchingDirections,
  fetchingEvents,
  fetchingReviews,
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
import SertificatBlock from '@blocks/SertificatBlock'
import TimeTableBlock from '@blocks/TimeTableBlock'
import AboutBlock from '@blocks/AboutBlock'
import TitleBlock from '@blocks/TitleBlock'

const sertificat = {
  image: '/img/other/IF8t5okaUQI_1.webp',
  title: 'Подарочный сертификат',
  description:
    'Лучший подарок для человека - это эмоции! Наш подарочный сертификат: способ подарить эти незабываемые эмоции. Подарочный сертификат нашего Центра осознанных знакомств номиналом 1500 руб, можно использовать на одно мероприятие на выбор в течение года: 1. Быстрые свидания Speed-Dating 1 раз в месяц. 2. Одно индивидуальное свидание (подбираются партнёры с учетом психологической совместимости и возрастной категории). 3. Свидание по-новому — новые интересные форматы общих встреч (мастер-классы, "Мафия", прогулки, походы и пикники знакомств) проводятся 1 раз в месяц. Подарите сертификат близкому человеку: подруге или другу, сестре или брату - тому, кто в поисках своей второй половинки, но ещё не встретил её в силу занятости и других причин. На встрече он (она) получит: - новые эмоции - приятные и полезные знакомства, как для личной жизни, так и для своего увлечения или профессиональной деятельности - романтическую обстановку. Возрастная категория участника по сертификату 25-40 лет. Сертификат можно приобрести как электронно, так и в печатном виде с доставкой.',
}

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
  const { events, directions, reviews, user } = props

  // const otziviRef = useRef([])

  const router = useRouter()
  // const { height, width } = useWindowDimensions()
  // const { data: session, status } = useSession()
  // const loading = status === 'loading'

  // if (session) console.log(`session`, session)
  // console.log('events', events)
  // console.log('user', user)

  // useEffect(() => {
  //   console.log('otziviRef', otziviRef.current)
  //   for (let i = 0; i < otziviRef.current.length; i++) {
  //     console.log(i, otziviRef.current[i].offsetHeight)
  //   }
  // }, [])

  return (
    <>
      <Head>
        <title>Центр осознанных знакомств - "Половинка успеха"</title>
      </Head>
      {/* <CourseWrapper>
        <Header user={user} title="Uniplatform" />
        <ContentWrapper>
          {courses.map((course) => {
            return (
              <Link key={course._id} href={`/course/${course._id}`}>
                <a className="px-2 py-1 text-left border-b border-gray-300 cursor-pointer hover:bg-gray-400">
                  {course.title}
                </a>
              </Link>
            )
          })}
        </ContentWrapper>
      </CourseWrapper> */}
      <div className="w-full bg-white">
        <DeviceCheck />
        <Header user={user} />
        <TitleBlock userIsLogged={!!user} />
        <AboutBlock />
        <TimeTableBlock events={events} />
        <DirectionsBlock directions={directions} />
        <SertificatBlock
          sertificat={sertificat}
          inverse={
            directions &&
            directions.filter((direction) => direction.showOnSite).length %
              2 ===
              1
          }
        />
        {/* <PriceBlock /> */}
        <ReviewsBlock reviews={reviews} />
        <ContactsBlock />
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
    </>
  )
}

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req })
  console.log('session', session)
  try {
    const events = await fetchingEvents(process.env.NEXTAUTH_SITE)
    const directions = await fetchingDirections(process.env.NEXTAUTH_SITE)
    const reviews = await fetchingReviews(process.env.NEXTAUTH_SITE)
    return {
      props: {
        events,
        directions: directions.filter((direction) => direction.showOnSite),
        reviews: reviews.filter((review) => review.showOnSite),
        user: session?.user ? session.user : null,
      },
    }
  } catch {
    return {
      props: {
        events: null,
        directions: null,
        reviews: null,
        user: session?.user ? session.user : null,
      },
      // notFound: true,
    }
  }
}
