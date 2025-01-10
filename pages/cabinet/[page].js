import LoadingSpinner from '@components/LoadingSpinner'
import StateLoader from '@components/StateLoader'
import { CONTENTS } from '@helpers/constants'
import isUserQuestionnaireFilled from '@helpers/isUserQuestionnaireFilled'
import dynamic from 'next/dynamic'
const FabMenu = dynamic(() => import('@components/FabMenu'))
const BurgerLayout = dynamic(() => import('@layouts/BurgerLayout'))
const CabinetHeader = dynamic(() => import('@layouts/CabinetHeader'))
const CabinetWrapper = dynamic(() => import('@layouts/wrappers/CabinetWrapper'))
const ContentWrapper = dynamic(() => import('@layouts/wrappers/ContentWrapper'))
// import FabMenu from '@components/FabMenu'
// import BurgerLayout from '@layouts/BurgerLayout'
// import CabinetHeader from '@layouts/CabinetHeader'
// import CabinetWrapper from '@layouts/wrappers/CabinetWrapper'
// import ContentWrapper from '@layouts/wrappers/ContentWrapper'
import fetchProps from '@server/fetchProps'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Suspense, useEffect } from 'react'
import { useAtomValue } from 'jotai'

import loggedUserActiveStatusAtomJ from '@state/atoms/loggedUserActiveStatusAtom'
import loggedUserActiveAtomJ from '@state/atoms/loggedUserActiveAtom'
import loggedUserActiveRoleSelectorJ from '@state/selectors/loggedUserActiveRoleSelector'

const SuspenseChild = () => (
  <div className="z-10 flex items-center justify-center w-full h-[calc(100vh-4rem)]">
    <LoadingSpinner text="идет загрузка...." />
  </div>
)

function CabinetPage(props) {
  const router = useRouter()
  const page = router.asPath.replace('/cabinet/', '').split('?')[0]
  const loggedUserActive = useAtomValue(loggedUserActiveAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const loggedUserActiveStatusName = useAtomValue(loggedUserActiveStatusAtom)
  const loggedUserActiveJ = useAtomValue(loggedUserActiveAtomJ)
  const loggedUserActiveRoleJ = useAtomValue(loggedUserActiveRoleSelectorJ)
  const loggedUserActiveStatusNameJ = useAtomValue(loggedUserActiveStatusAtomJ)
  const showFab = !loggedUserActiveRole?.hideFab || page === 'settingsFabMenu'

  let redirect
  if (!props.loggedUser) redirect = '/'
  else if (
    loggedUserActive &&
    ((page !== 'questionnaire' &&
      !isUserQuestionnaireFilled(loggedUserActive)) ||
      !CONTENTS[page] ||
      !CONTENTS[page].roleAccess(
        loggedUserActiveRole,
        loggedUserActiveStatusName
      ))
    // !CONTENTS[page].accessRoles.includes(loggedUserActiveRoleName) ||
    // (CONTENTS[page].accessStatuses &&
    //   !CONTENTS[page].accessStatuses.includes(loggedUserActiveStatus))
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
        {loggedUserActive && (
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
            {showFab && <FabMenu show={showFab} />}
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
  console.log('query :>> ', context.query)
  console.log('params :>> ', context.params)
  const { params } = context
  const { page, domen } = params

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

  const fetchedProps = await fetchProps(session?.user, domen)

  return {
    props: {
      ...fetchedProps,
      // page,
      loggedUser: session?.user ?? null,
    },
  }
}
