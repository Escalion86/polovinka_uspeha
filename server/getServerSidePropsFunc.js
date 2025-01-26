import getTelegramBotNameByLocation from './getTelegramBotNameByLocation'

const getServerSidePropsFunc = async (
  context,
  getSession,
  fetchProps,
  location,
  params
) => {
  const telegramBotName = getTelegramBotNameByLocation(location)
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
        mode: process.env.MODE,
        ...fetchedProps,
        loggedUser: session?.user ?? null,
        location,
        telegramBotName,
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
        mode: process.env.MODE,
        loggedUser: session?.user ?? null,
        error: JSON.parse(JSON.stringify(error)),
        location,
        telegramBotName,
      },
    }
  }
}

export default getServerSidePropsFunc
