import { DEFAULT_ROLES } from '@helpers/constants'
import getUserRole from '@helpers/getUserRole'
import isUserAdmin from '@helpers/isUserAdmin'
import AdditionalBlocks from '@models/AdditionalBlocks'
import Directions from '@models/Directions'
import Events from '@models/Events'
import EventsUsers from '@models/EventsUsers'
// import EventsUsers from '@models/EventsUsers'
// import Histories from '@models/Histories'
// import Payments from '@models/Payments'
import Questionnaires from '@models/Questionnaires'
import QuestionnairesUsers from '@models/QuestionnairesUsers'
import Reviews from '@models/Reviews'
import Roles from '@models/Roles'
import Services from '@models/Services'
// import ServicesUsers from '@models/ServicesUsers'
import SiteSettings from '@models/SiteSettings'
import Users from '@models/Users'
import dbConnect from '@utils/dbConnect'

const fetchProps = async (user, domen) => {
  const serverDateTime = new Date()
  try {
    const db = await dbConnect(domen)

    var users = await Users.find({}).select('-password').lean()

    // if (!(isModer || isAdmin)) {
    //   users = JSON.parse(JSON.stringify(users)).map((user) => {
    //     return {
    //       ...user,
    //       secondName: user.secondName
    //         ? user.security?.fullSecondName
    //           ? user.secondName
    //           : user.secondName[0] + '.'
    //         : '',
    //       thirdName: user.thirdName
    //         ? user.security?.fullThirdName
    //           ? user.thirdName
    //           : user.thirdName[0] + '.'
    //         : '',
    //     }
    //   })
    // }
    //1570383

    const events = await Events.find({})
      .select({
        description: 0,
        address: 0,
        images: 0,
        organizerId: 0,
        warning: 0,
        googleCalendarId: 0,
      })
      .lean()

    const directions = await Directions.find({}).lean()
    const reviews = await Reviews.find({}).lean()
    const additionalBlocks = await AdditionalBlocks.find({}).lean()
    // const eventsUsers = await EventsUsers.find({}).lean()
    // const payments = await Payments.find({})
    //   .select({
    //     status: 0,
    //   })
    //   .lean()
    const siteSettings = await SiteSettings.find({}).lean()
    const rolesSettings = await Roles.find({}).lean()
    const questionnaires = await Questionnaires.find({}).lean()
    const questionnairesUsers = await QuestionnairesUsers.find({}).lean()
    // const histories = isModer
    //   ? await Histories.find({
    //       // createdAt: { $gt: user.prevActivityAt },
    //     })
    //   : []

    const services = await Services.find({}).lean()
    // const servicesUsers = await ServicesUsers.find({}).lean()

    const userRole = getUserRole(user, [...DEFAULT_ROLES, ...rolesSettings])
    const seeFullNames = userRole?.users?.seeFullNames
    const isAdmin = isUserAdmin(user)

    if (isAdmin) {
      const canceledEventsIds = events
        .filter(({ status }) => status === 'canceled')
        .map(({ _id }) => String(_id))

      const res = await EventsUsers.aggregate([
        {
          $match: {
            eventId: { $nin: canceledEventsIds },
            status: { $nin: ['reserve', 'ban'] },
          },
        },
        {
          $group: { _id: '$userId', total: { $sum: 1 } },
        },
      ])

      const preparedRes = res.reduce(function (result, { _id, total }) {
        result[_id] = total
        return result
      }, {})

      users = users.map((user) => ({
        ...user,
        signedUpEventsCount: preparedRes[user._id] || 0,
      }))
    }

    if (!seeFullNames) {
      users = users.map((user) => {
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
    console.log('')
    console.log('')
    console.log('-----------------------------')
    console.log('users :>> ', JSON.stringify(users).length)
    console.log('events :>> ', JSON.stringify(events).length)
    console.log('directions :>> ', JSON.stringify(directions).length)
    console.log('reviews :>> ', JSON.stringify(reviews).length)
    console.log(
      'additionalBlocks :>> ',
      JSON.stringify(additionalBlocks).length
    )
    // console.log('payments :>> ', JSON.stringify(payments).length)
    console.log('siteSettings :>> ', JSON.stringify(siteSettings).length)
    console.log('questionnaires :>> ', JSON.stringify(questionnaires).length)
    console.log(
      'questionnairesUsers :>> ',
      JSON.stringify(questionnairesUsers).length
    )
    console.log('rolesSettservicesings :>> ', JSON.stringify(services).length)
    // console.log('servicesUsers :>> ', JSON.stringify(servicesUsers).length)

    const fetchResult = {
      users: JSON.parse(JSON.stringify(users)),
      events: JSON.parse(JSON.stringify(events)),
      directions: JSON.parse(JSON.stringify(directions)),
      reviews: JSON.parse(JSON.stringify(reviews)),
      additionalBlocks: JSON.parse(JSON.stringify(additionalBlocks)),
      // eventsUsers: JSON.parse(JSON.stringify(eventsUsers)),
      // payments: JSON.parse(JSON.stringify(payments)),
      siteSettings: JSON.parse(
        JSON.stringify(siteSettings?.length > 0 ? siteSettings[0] : {})
      ),
      rolesSettings: JSON.parse(JSON.stringify(rolesSettings)),
      // histories: JSON.parse(JSON.stringify(histories)),
      questionnaires: JSON.parse(JSON.stringify(questionnaires)),
      questionnairesUsers: JSON.parse(JSON.stringify(questionnairesUsers)),
      services: JSON.parse(JSON.stringify(services)),
      // servicesUsers: JSON.parse(JSON.stringify(servicesUsers)),
      serverSettings: JSON.parse(
        JSON.stringify({
          dateTime: serverDateTime,
        })
      ),
      mode: process.env.NODE_ENV,
      location: process.env.LOCATION,
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
      // payments: [],
      siteSettings: {},
      rolesSettings: [],
      // histories: [],
      questionnaires: [],
      questionnairesUsers: [],
      services: [],
      // servicesUsers: [],
      serverSettings: JSON.parse(
        JSON.stringify({
          dateTime: serverDateTime,
        })
      ),
      mode: process.env.NODE_ENV,
      location: process.env.LOCATION,
      error: JSON.parse(JSON.stringify(error)),
    }
  }
}

export default fetchProps
