// import { getSession } from 'next-auth/react'
// import fetchProps from './fetchProps'

const getServerSidePropsFunc = async (
  context,
  getSession,
  fetchProps,
  domen,
  params
) => {
  var session
  try {
    session = await getSession({ req: context.req })

    const fetchedProps = await fetchProps(session?.user, domen, params)
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
        location: process.env.LOCATION,
        ...fetchedProps,
        loggedUser: session?.user ?? null,
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
        location: process.env.LOCATION,
        loggedUser: session?.user ?? null,
        error: JSON.parse(JSON.stringify(error)),
      },
    }
  }
}

export default getServerSidePropsFunc
