import getTelegramBotNameByLocation from './getTelegramBotNameByLocation'

const EMPTY_PROPS = {
  events: null,
  directions: null,
  reviews: null,
  additionalBlocks: null,
  eventsUsers: null,
  payments: null,
  siteSettings: null,
  rolesSettings: null,
  questionnaires: null,
  questionnairesUsers: null,
  services: null,
  servicesUsers: null,
}

const buildBaseProps = (location, telegramBotName, loggedUser) => ({
  ...EMPTY_PROPS,
  mode: process.env.MODE,
  loggedUser: loggedUser ?? null,
  location,
  telegramBotName,
})

const buildPageProps = async ({ session, fetcher, location, params }) => {
  const telegramBotName = getTelegramBotNameByLocation(location)
  const loggedUser = session?.user ?? null

  try {
    const fetchedProps = await fetcher(loggedUser, location, params)

    return {
      ...buildBaseProps(location, telegramBotName, loggedUser),
      ...fetchedProps,
      telegramBotName,
    }
  } catch (error) {
    return {
      ...buildBaseProps(location, telegramBotName, loggedUser),
      error: JSON.parse(JSON.stringify(error)),
    }
  }
}

export default buildPageProps
