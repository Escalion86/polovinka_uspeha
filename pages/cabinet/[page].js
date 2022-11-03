import { getSession } from 'next-auth/react'

import Head from 'next/head'

import CabinetWrapper from '@layouts/wrappers/CabinetWrapper'
import ContentWrapper from '@layouts/wrappers/ContentWrapper'
import CabinetHeader from '@layouts/CabinetHeader'
import { CONTENTS } from '@helpers/constants'

import { useEffect } from 'react'
import { useRouter } from 'next/router'

// import ModalsPortal from '@layouts/modals/ModalsPortal'
import BurgerLayout from '@layouts/BurgerLayout'
import DeviceCheck from '@components/DeviceCheck'
import isUserQuestionnaireFilled from '@helpers/isUserQuestionnaireFilled'
import fetchProps from '@server/fetchProps'
import isUserAdmin from '@helpers/isUserAdmin'
import StateLoader from '@components/StateLoader'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import { useRecoilValue } from 'recoil'

// TODO Сделать копирование БД с main на dev
// TODO Сделать переключение с БД main на dev

function CabinetPage(props) {
  const router = useRouter()
  const page = router.asPath.replace('/cabinet/', '')
  // const { page } = props
  // const { loggedUser } = props
  const loggedUser = useRecoilValue(loggedUserAtom)

  let redirect
  if (!props.loggedUser) redirect = '/'
  else if (
    loggedUser &&
    ((page !== 'questionnaire' && !isUserQuestionnaireFilled(loggedUser)) ||
      (!['events', 'questionnaire'].includes(page) && !isUserAdmin(loggedUser)))
  )
    redirect = '/cabinet/questionnaire'

  // Ограничиваем пользователям доступ к страницам
  useEffect(() => {
    if (redirect) router.push(redirect, '', { shallow: true })
  }, [redirect])

  const Component = CONTENTS[page]
    ? CONTENTS[page].Component
    : (props) => <div className="flex justify-center px-2">Ошибка 404</div>

  const title = CONTENTS[page] ? CONTENTS[page].name : ''

  return (
    <>
      <Head>
        <title>{`Половинка успеха - Кабинет${
          title ? ' / ' + title : ''
        }`}</title>
        {/* <meta name="description" content={activeLecture.description} /> */}
      </Head>

      <StateLoader {...props}>
        {loggedUser && (
          <CabinetWrapper>
            {/* ----------------------------- HEADER ------------------------------- */}
            <DeviceCheck right />
            <CabinetHeader title={title} />
            <BurgerLayout />
            <ContentWrapper page={page}>
              {!redirect && <Component {...props} />}
            </ContentWrapper>
            {/* <ModalsPortal /> */}
          </CabinetWrapper>
        )}
      </StateLoader>
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

  if (!session?.user) {
    return {
      redirect: {
        destination: `/`,
      },
    }
  }

  // Ограничиваем пользователям доступ к страницам
  if (
    (page !== 'questionnaire' && !isUserQuestionnaireFilled(session.user)) ||
    (!['events', 'questionnaire'].includes(page) && !isUserAdmin(session?.user))
  ) {
    return {
      redirect: {
        destination: `/cabinet/questionnaire`,
      },
    }
  }

  const fetchedProps = await fetchProps(session?.user)

  return {
    props: {
      ...fetchedProps,
      // page,
      loggedUser: session?.user ?? null,
    },
  }
}
