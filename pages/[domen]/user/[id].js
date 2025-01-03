import { getSession } from 'next-auth/react'
import Head from 'next/head'
import usersAtom from '@state/atoms/usersAtom'
import fetchProps from '@server/fetchProps'
import Header from '@layouts/Header'
import ContactsBlock from '@blocks/ContactsBlock'
import userViewFunc from '@layouts/modals/modalsFunc/userViewFunc'
import { H2 } from '@components/tags'
import StateLoader from '@components/StateLoader'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import BlockContainer from '@components/BlockContainer'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'

const User = ({ user }) => {
  const userView = userViewFunc(user._id)
  const Component = userView.Children
  const TopLeftComponent = userView.TopLeftComponent

  return (
    <>
      <div className="relative">
        {TopLeftComponent && (
          <div className="absolute right-3">
            <TopLeftComponent />
          </div>
        )}
        <H2 className="mx-10 mb-4">Пользователь</H2>
      </div>
      <Component />
    </>
  )
}

function UserPage(props) {
  const userId = props.id

  // const router = useRouter()

  const usersState = useRecoilValue(usersAtom)

  const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleSelector)
  const seeMembersOnly = loggedUserActiveRole?.users?.seeMembersOnly

  const user =
    usersState?.length > 0
      ? usersState.find((user) => user?._id === userId)
      : undefined

  const canSee =
    loggedUserActiveRole?.users?.see &&
    (!seeMembersOnly || user?.status === 'member')

  useEffect(() => {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    })
  }, [])

  // const title = event?.title ?? ''
  // const query = event?._id ? { event: event._id } : {}

  return (
    <>
      <Head>
        <title>{`Половинка успеха - Пользователь`}</title>
        {/* <meta name="description" content={activeLecture.description} /> */}
      </Head>
      <StateLoader {...props}>
        <Header />
        {/* <TitleBlock userIsLogged={!!loggedUserState} /> */}
        <BlockContainer small>
          {user?._id && canSee && <User user={user} />}
          <div className="flex flex-col items-center">
            {!user?._id && (
              <span className="text-xl">Ошибка. Пользователь не найден</span>
            )}
            {!canSee && (
              <span className="text-xl">
                Информация о пользователе не доступна для просмотра
                неавторизированным пользователям, пожалуйста авторизируйтесь
              </span>
            )}
            {/* {!loggedUser && (
              <>
                <Link prefetch={false}
                  href={{
                    pathname: '/login',
                    query,
                  }}
                  shallow
                >
                  <PulseButton
                    className="mt-4 text-white"
                    title="Авторизироваться"
                    // onClick={() => router.push('./login', '', { shallow: true })}
                  />
                </Link>
                <Link prefetch={false}
                  href={{
                    pathname: '/login',
                    query: { ...query, registration: true },
                  }}
                  shallow
                >
                  <PulseButton
                    className="mt-4 text-white"
                    title="Зарегистрироваться"
                    // onClick={() => router.push('./login', '', { shallow: true })}
                  />
                </Link>
              </>
            )} */}
          </div>
        </BlockContainer>
        {/* <div className="pb-6 mt-2 border-b border-gray-700 tablet:mt-9">
        </div> */}
        <ContactsBlock />
      </StateLoader>
    </>
  )
}

export default UserPage

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

  const fetchedProps = await fetchProps(session?.user)

  return {
    props: {
      ...fetchedProps,
      id,
      loggedUser: session?.user ?? null,
    },
  }
}
