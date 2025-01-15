// import { getSession } from 'next-auth/react'
// import fetchProps from './fetchProps'

const getServerSidePropsFunc = async (
  context,
  getSession,
  fetchProps,
  location,
  params
) => {
  var session
  try {
    session = await getSession({ req: context.req })

    const fetchedProps = await fetchProps(session?.user, location, params)
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
        rolesSettings: null,
        // histories: null,
        questionnaires: null,
        questionnairesUsers: null,
        services: null,
        servicesUsers: null,
        mode: process.env.NODE_ENV,
        ...fetchedProps,
        loggedUser: session?.user ?? null,
        location,
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
        rolesSettings: null,
        // histories: null,
        questionnaires: null,
        questionnairesUsers: null,
        services: null,
        servicesUsers: null,
        mode: process.env.NODE_ENV,
        loggedUser: session?.user ?? null,
        error: JSON.parse(JSON.stringify(error)),
        location,
      },
    }
  }
}

export default getServerSidePropsFunc
