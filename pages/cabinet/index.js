import { getSession } from 'next-auth/react'

import Head from 'next/head'

// import CabinetWrapper from '@layouts/wrappers/CabinetWrapper'

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

  if (session) {
    return {
      redirect: {
        destination: `/cabinet/events`,
      },
    }
  } else {
    return {
      redirect: {
        destination: `/`,
      },
    }
  }
}
