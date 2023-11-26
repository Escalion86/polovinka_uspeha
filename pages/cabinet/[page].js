import Fab from '@components/Fab'
import FabMenu from '@components/FabMenu'
import LoadingSpinner from '@components/LoadingSpinner'
import StateLoader from '@components/StateLoader'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { CONTENTS } from '@helpers/constants'
import isUserQuestionnaireFilled from '@helpers/isUserQuestionnaireFilled'
import BurgerLayout from '@layouts/BurgerLayout'
import CabinetHeader from '@layouts/CabinetHeader'
import CabinetWrapper from '@layouts/wrappers/CabinetWrapper'
import ContentWrapper from '@layouts/wrappers/ContentWrapper'
import fetchProps from '@server/fetchProps'
import loggedUserActiveRoleAtom from '@state/atoms/loggedUserActiveRoleAtom'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import isLoggedUserModerSelector from '@state/selectors/isLoggedUserModerSelector'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Suspense, useEffect } from 'react'
import { useRecoilValue } from 'recoil'

const SuspenseChild = () => (
  <div className="z-10 flex items-center justify-center w-full h-[calc(100vh-4rem)]">
    <LoadingSpinner text="идет загрузка...." />
  </div>
)

function CabinetPage(props) {
  const router = useRouter()
  const page = router.asPath.replace('/cabinet/', '')
  const loggedUser = useRecoilValue(loggedUserAtom)
  const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleAtom)
  const loggedUserActiveStatus = useRecoilValue(loggedUserActiveStatusAtom)
  const isLoggedUserModer = useRecoilValue(isLoggedUserModerSelector)
  const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)

  let redirect
  if (!props.loggedUser) redirect = '/'
  else if (
    loggedUser &&
    ((page !== 'questionnaire' && !isUserQuestionnaireFilled(loggedUser)) ||
      !CONTENTS[page] ||
      !CONTENTS[page].accessRoles.includes(loggedUserActiveRole) ||
      (CONTENTS[page].accessStatuses &&
        !CONTENTS[page].accessStatuses.includes(loggedUserActiveStatus)))
  )
    redirect = '/cabinet/questionnaire'

  // Ограничиваем пользователям доступ к страницам
  useEffect(() => {
    if (redirect) router.push(redirect, '', { shallow: true })
  }, [redirect])

  if (redirect) return null

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

      <StateLoader {...props} isCabinet>
        {loggedUser && (
          <CabinetWrapper>
            <CabinetHeader title={title} />
            <BurgerLayout />
            <ContentWrapper page={page}>
              {!redirect && (
                <Suspense fallback={<SuspenseChild />}>
                  <Component {...props} />
                </Suspense>
              )}
            </ContentWrapper>
            <FabMenu
              show={
                !(isLoggedUserModer || isLoggedUserAdmin) ||
                page === 'settingsFabMenu'
              }
            />
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

  // Редиректим пользователей незаполнившим профиль
  if (page !== 'questionnaire' && !isUserQuestionnaireFilled(session.user)) {
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
