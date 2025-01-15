import { getSession } from 'next-auth/react'
import Head from 'next/head'

function CabinetPage() {
  return (
    <>
      <Head>
        <title>Кабинет</title>
        {/* <meta name="description" content={activeLecture.description} /> */}
      </Head>
      {/* <CabinetWrapper>

      </CabinetWrapper> */}
    </>
  )
}

export default CabinetPage

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req })
  const { params } = context
  const { location } = params

  if (session) {
    return {
      redirect: {
        destination: `/${location}/cabinet/events`,
      },
    }
  } else {
    return {
      redirect: {
        destination: `/${location}/`,
      },
    }
  }
}
