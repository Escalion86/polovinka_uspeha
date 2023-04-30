// import { getSession } from 'next-auth/react'
// import fetchProps from './fetchProps'

const getServerSidePropsFunc = async (context, getSession, fetchProps) => {
  try {
    const session = await getSession({ req: context.req })

    const fetchedProps = await fetchProps(session?.user)
    return {
      props: {
        users: null,
        events: null,
        directions: null,
        reviews: null,
        additionalBlocks: null,
        eventsUsers: null,
        payments: null,
        siteSettings: null,
        histories: null,
        questionnaires: null,
        questionnairesUsers: null,
        services: null,
        servicesUsers: null,
        ...fetchedProps,
        loggedUser: session?.user ?? null,
        mode: process.env.NODE_ENV,
      },
    }
  } catch (error) {
    return {
      props: {
        users: null,
        events: null,
        directions: null,
        reviews: null,
        additionalBlocks: null,
        eventsUsers: null,
        payments: null,
        siteSettings: null,
        histories: null,
        questionnaires: null,
        questionnairesUsers: null,
        services: null,
        servicesUsers: null,
        loggedUser: session?.user ?? null,
        mode: process.env.NODE_ENV,
        error: JSON.parse(JSON.stringify(error)),
      },
    }
  }
}

export default getServerSidePropsFunc
