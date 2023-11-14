import isUserAdmin from '@helpers/isUserAdmin'
import isUserModer from '@helpers/isUserModer'
import AdditionalBlocks from '@models/AdditionalBlocks'
import Directions from '@models/Directions'
import Events from '@models/Events'
// import EventsUsers from '@models/EventsUsers'
// import Histories from '@models/Histories'
import Payments from '@models/Payments'
import Questionnaires from '@models/Questionnaires'
import QuestionnairesUsers from '@models/QuestionnairesUsers'
import Reviews from '@models/Reviews'
import Services from '@models/Services'
import ServicesUsers from '@models/ServicesUsers'
import SiteSettings from '@models/SiteSettings'
import Users from '@models/Users'
import dbConnect from '@utils/dbConnect'

const fetchProps = async (user, pageName = 'cabinet') => {
  const serverDateTime = new Date()
  try {
    const db = await dbConnect()
    const isModer = isUserModer(user)
    const isAdmin = isUserAdmin(user)
    var users = JSON.parse(
      JSON.stringify(await Users.find({}).select('-password'))
    )
    if (!(isModer || isAdmin)) {
      users = JSON.parse(JSON.stringify(users)).map((user) => {
        return {
          ...user,
          secondName: user.secondName
            ? user.security?.fullSecondName
              ? user.secondName
              : user.secondName[0] + '.'
            : '',
          thirdName: user.thirdName
            ? user.security?.fullThirdName
              ? user.thirdName
              : user.thirdName[0] + '.'
            : '',
        }
      })
    }

    const events = await Events.find({})
    const directions = await Directions.find({})
    const reviews = await Reviews.find({})
    const additionalBlocks = await AdditionalBlocks.find({})
    // const eventsUsers = await EventsUsers.find({})
    const payments = await Payments.find({})
    const siteSettings = await SiteSettings.find({})
    const questionnaires = await Questionnaires.find({})
    const questionnairesUsers = await QuestionnairesUsers.find({})
    // const histories = isModer
    //   ? await Histories.find({
    //       // createdAt: { $gt: user.prevActivityAt },
    //     })
    //   : []

    const services = await Services.find({})
    const servicesUsers = await ServicesUsers.find({})

    const fetchResult = {
      users,
      events: JSON.parse(JSON.stringify(events)),
      directions: JSON.parse(JSON.stringify(directions)),
      reviews: JSON.parse(JSON.stringify(reviews)),
      additionalBlocks: JSON.parse(JSON.stringify(additionalBlocks)),
      // eventsUsers: JSON.parse(JSON.stringify(eventsUsers)),
      payments: JSON.parse(JSON.stringify(payments)),
      siteSettings: JSON.parse(
        JSON.stringify(siteSettings?.length > 0 ? siteSettings[0] : {})
      ),
      // histories: JSON.parse(JSON.stringify(histories)),
      questionnaires: JSON.parse(JSON.stringify(questionnaires)),
      questionnairesUsers: JSON.parse(JSON.stringify(questionnairesUsers)),
      services: JSON.parse(JSON.stringify(services)),
      servicesUsers: JSON.parse(JSON.stringify(servicesUsers)),
      serverSettings: {
        dateTime: JSON.parse(JSON.stringify(serverDateTime)),
      },
    }

    return fetchResult
  } catch (error) {
    return {
      users: [],
      events: [],
      directions: [],
      reviews: [],
      additionalBlocks: [],
      // eventsUsers: [],
      payments: [],
      siteSettings: {},
      // histories: [],
      questionnaires: [],
      questionnairesUsers: [],
      services: [],
      servicesUsers: [],
      serverSettings: {
        dateTime: JSON.parse(JSON.stringify(serverDateTime)),
      },
      error: JSON.parse(JSON.stringify(error)),
    }
  }
}

export default fetchProps
