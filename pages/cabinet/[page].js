import { getSession } from 'next-auth/react'

import Head from 'next/head'

import CabinetWrapper from '@layouts/wrappers/CabinetWrapper'
import ContentWrapper from '@layouts/wrappers/ContentWrapper'
import CabinetHeader from '@layouts/CabinetHeader'
import { CONTENTS } from '@helpers/constants'

import { Suspense, useEffect } from 'react'
import { useRouter } from 'next/router'

// import ModalsPortal from '@layouts/modals/ModalsPortal'
import BurgerLayout from '@layouts/BurgerLayout'
// import DeviceCheck from '@components/DeviceCheck'
import isUserQuestionnaireFilled from '@helpers/isUserQuestionnaireFilled'
import fetchProps from '@server/fetchProps'
// import isUserAdmin from '@helpers/isUserAdmin'
import StateLoader from '@components/StateLoader'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import { useRecoilValue } from 'recoil'
// import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'
// import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import loggedUserActiveRoleAtom from '@state/atoms/loggedUserActiveRoleAtom'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import LoadingSpinner from '@components/LoadingSpinner'
import Fab from '@components/Fab'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

// TODO Сделать копирование БД с main на dev
// TODO Сделать переключение с БД main на dev

function CabinetPage(props) {
  const router = useRouter()
  const page = router.asPath.replace('/cabinet/', '')
  // const { page } = props
  // const { loggedUser } = props
  const loggedUser = useRecoilValue(loggedUserAtom)
  // const isLoggedUserMember = useRecoilValue(isLoggedUserMemberSelector)
  // const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)
  const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleAtom)
  const loggedUserActiveStatus = useRecoilValue(loggedUserActiveStatusAtom)

  let redirect
  if (!props.loggedUser) redirect = '/'
  else if (
    loggedUser &&
    ((page !== 'questionnaire' && !isUserQuestionnaireFilled(loggedUser)) ||
      !CONTENTS[page] ||
      !CONTENTS[page].accessRoles.includes(loggedUserActiveRole) ||
      (CONTENTS[page].accessStatuses &&
        !CONTENTS[page].accessStatuses.includes(loggedUserActiveStatus)))
    //     (!['events', 'questionnaire', 'members', 'services'].includes(page) &&
    //       !isLoggedUserAdmin))) ||
    // (page === 'members' && !isLoggedUserMember && !isLoggedUserAdmin
  )
    redirect = '/cabinet/questionnaire'

  //   (page !== 'questionnaire' && !isUserQuestionnaireFilled(session.user)) ||
  //   !CONTENTS[page] ||
  //   !CONTENTS[page].accessRoles.includes(loggedUserActiveRole) ||
  //   (CONTENTS[page].accessStatuses &&
  //     !CONTENTS[page].accessStatuses.includes(loggedUserActiveStatus))

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

      <StateLoader {...props} isCabinet>
        {loggedUser && (
          <CabinetWrapper>
            <CabinetHeader title={title} />
            <BurgerLayout />
            <ContentWrapper page={page}>
              {!redirect && (
                <Suspense
                  fallback={
                    <div className="z-10 flex items-center justify-center w-full h-[calc(100vh-4rem)]">
                      <LoadingSpinner text="идет загрузка...." />
                    </div>
                  }
                >
                  <Component {...props} />
                </Suspense>
              )}
            </ContentWrapper>
            {/* <ModalsPortal /> */}
            <Fab
              show
              icon={faWhatsapp}
              bgClass="bg-green-700"
              href="https://wa.me/79504280891"
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
