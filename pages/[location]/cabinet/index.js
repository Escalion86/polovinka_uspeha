import { getSession } from 'next-auth/react'
// import Head from 'next/head'

function CabinetPage() {
  return null
  // return (
  //   <>
  //     <Head>
  //       <title>Кабинет</title>
  //       {/* <meta name="description" content={activeLecture.description} /> */}
  //     </Head>
  //     {/* <CabinetWrapper>

  //     </CabinetWrapper> */}
  //   </>
  // )
}

export default CabinetPage

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req })
  const { params } = context
  const { page, location } = params

  if (!location) {
    return {
      redirect: {
        destination: '/',
      },
    }
  }

  if (session) {
    return {
      redirect: {
        destination: `/${location}${page ? `?page=${page}` : ''}`,
      },
    }
  }

  return {
    redirect: {
      destination: `/${location}/`,
    },
  }
}
