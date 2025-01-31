// import { DEFAULT_ROLES } from '@helpers/constants'
// import getUserRole from '@helpers/getUserRole'
import isUserAdmin from '@helpers/isUserAdmin'
// import AdditionalBlocks from '@models/AdditionalBlocks'
//
//
//
//
//
//
//
//
//
//
//
//
//
//
import dbConnect from '@utils/dbConnect'
import getTelegramBotNameByLocation from './getTelegramBotNameByLocation'

const fetchProps = async (user, location, params) => {
  const serverDateTime = new Date()
  const telegramBotName = getTelegramBotNameByLocation(location)
  try {
    const isAdmin = isUserAdmin(user)
    const db = await dbConnect(location)
    if (!db)
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
        mode: process.env.MODE,
        error: 'db error',
        location,
        telegramBotName,
      }

    var users = isAdmin
      ? await db
          .model('Users')
          .find({})
          .select({
            password: 0,
            // orientation: 0,
            // firstname: 0,
            // secondname: 0,
            // thirdname: 0,
            // interests: 0,
            // profession: 0,
            // about: 0,
          })
          .lean()
      : null

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

    const events =
      params?.events === false
        ? []
        : await db
            .model('Events')
            .find({})
            .select({
              description: 0,
              address: 0,
              images: 0,
              organizerId: 0,
              warning: 0,
              googleCalendarId: 0,
              // maxMansMember: 0,
              // maxMansNovice: 0,
              // maxWomansMember: 0,
              // maxWomansNovice: 0,
              // maxParticipants: 0,
              // maxMans: 0,
              // maxWomans: 0,
              // minMansAge: 0,
              // minWomansAge: 0,
              // maxMansAge: 0,
              // maxWomansAge: 0,
              // usersStatusAccess: 0,
              // usersStatusDiscount: 0,
            })
            .lean()

    const directions = await db
      .model('Directions')
      .find({})
      .select({
        description: 0,

        // plugins: 0,
        ...(params?.directions?.shortDescription
          ? {}
          : { shortDescription: 0 }),
      })
      .lean()
    const reviews =
      params?.reviews === false ? [] : await db.model('Reviews').find({}).lean()
    const additionalBlocks =
      params?.additionalBlocks === false
        ? []
        : await db.model('AdditionalBlocks').find({}).lean()
    // const eventsUsers = await db.model('EventsUsers').find({}).lean()
    // const payments = await db.model('Payments').find({})
    //   .select({
    //     status: 0,
    //   })
    //   .lean()
    const siteSettings = await db.model('SiteSettings').find({}).lean()
    const rolesSettings =
      params?.rolesSettings === false
        ? []
        : await db.model('Roles').find({}).lean()
    const questionnaires =
      params?.questionnaires === false
        ? []
        : await db.model('Questionnaires').find({}).lean()
    const questionnairesUsers =
      params?.questionnairesUsers === false
        ? []
        : await db.model('QuestionnairesUsers').find({}).lean()
    // const histories = isModer
    //   ? await db.model('Histories').find({
    //       // createdAt: { $gt: user.prevActivityAt },
    //     })
    //   : []

    const services =
      params?.services === false
        ? []
        : await db.model('Services').find({}).lean()
    // const servicesUsers = await db.model('ServicesUsers').find({}).lean()

    // const userRole = getUserRole(user, [...DEFAULT_ROLES, ...rolesSettings])
    // const seeFullNames = userRole?.users?.seeFullNames

    if (isAdmin) {
      const canceledEventsIds = events
        .filter(({ status }) => status === 'canceled')
        .map(({ _id }) => String(_id))

      const res = await db.model('EventsUsers').aggregate([
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

    // if (!seeFullNames) {
    //   users = users.map((user) => {
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
    // const directions = []
    // const reviews = []
    // const additionalBlocks = []
    // const siteSettings = []
    // const questionnaires = []
    // const questionnairesUsers = []
    // const services = []

    console.log('')
    console.log('')
    console.log('-----------------------------')
    console.log('users :>> ', users ? JSON.stringify(users).length : 0)
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
    console.log('services :>> ', JSON.stringify(services).length)
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
      mode: process.env.MODE,
      location,
      telegramBotName,
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
      mode: process.env.MODE,
      error: JSON.parse(JSON.stringify(error)),
      location,
      telegramBotName,
    }
  }
}

export default fetchProps
