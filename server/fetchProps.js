// import { DEFAULT_ROLES } from '@helpers/constants'
// import getUserRole from '@helpers/getUserRole'
// import isUserAdmin from '@helpers/isUserAdmin'

import dbConnect from '@utils/dbConnect'
import getTelegramBotNameByLocation from './getTelegramBotNameByLocation'

const isObjectId = (value) =>
  value && typeof value === 'object' && value.constructor?.name === 'ObjectId'

const serializeLeanDoc = (doc) => {
  if (doc == null) return doc
  if (isObjectId(doc)) return doc.toString()
  if (doc instanceof Date) return doc.toISOString()
  if (Array.isArray(doc)) return doc.map(serializeLeanDoc)
  if (typeof doc === 'object') {
    return Object.entries(doc).reduce((acc, [key, value]) => {
      acc[key] = serializeLeanDoc(value)
      return acc
    }, {})
  }

  return doc
}

const fetchProps = async (user, location, params) => {
  const serverDateTime = new Date()
  const telegramBotName = getTelegramBotNameByLocation(location)
  try {
    // const isAdmin = isUserAdmin(user)
    const db = await dbConnect(location)
    if (!db)
      return {
        // users: [],
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
        serverSettings: {
          dateTime: serverDateTime.toISOString(),
        },
        mode: process.env.MODE,
        error: 'db error',
        location,
        telegramBotName,
      }

    // var users = isAdmin
    //   ? await db
    //       .model('Users')
    //       .find({})
    //       .select({
    //         password: 0,
    //         images: 0,
    //         haveKids: 0,
    //         security: 0,
    //         notifications: 0,
    //         soctag: 0,
    //         custag: 0,
    //         town: 0,
    //         prevActivityAt: 0,
    //         lastActivityAt: 0,
    //         archive: 0,
    //         role: 0,
    //         registrationType: 0,
    //       })
    //       .lean()
    //   : null

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

    const [
      events,
      directions,
      reviews,
      additionalBlocks,
      siteSettings,
      rolesSettings,
      questionnaires,
      questionnairesUsers,
      services,
    ] = await Promise.all([
      params?.events === false
        ? Promise.resolve([])
        : db
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
            .lean(),
      db
        .model('Directions')
        .find({})
        .select({
          description: 0,

          // plugins: 0,
          ...(params?.directions?.shortDescription
            ? {}
            : { shortDescription: 0 }),
        })
        .lean(),
      params?.reviews === false
        ? Promise.resolve([])
        : db.model('Reviews').find({}).lean(),
      params?.additionalBlocks === false
        ? Promise.resolve([])
        : db.model('AdditionalBlocks').find({}).lean(),
      db.model('SiteSettings').find({}).lean(),
      params?.rolesSettings === false
        ? Promise.resolve([])
        : db.model('Roles').find({}).lean(),
      params?.questionnaires === false
        ? Promise.resolve([])
        : db.model('Questionnaires').find({}).lean(),
      params?.questionnairesUsers === false
        ? Promise.resolve([])
        : db.model('QuestionnairesUsers').find({}).lean(),
      params?.services === false
        ? Promise.resolve([])
        : db.model('Services').find({}).lean(),
    ])
    // const eventsUsers = await db.model('EventsUsers').find({}).lean()
    // const payments = await db.model('Payments').find({})
    //   .select({
    //     status: 0,
    //   })
    //   .lean()
    // const histories = isModer
    //   ? await db.model('Histories').find({
    //       // createdAt: { $gt: user.prevActivityAt },
    //     })
    //   : []
    // const servicesUsers = await db.model('ServicesUsers').find({}).lean()

    // const userRole = getUserRole(user, [...DEFAULT_ROLES, ...rolesSettings])
    // const seeFullNames = userRole?.users?.seeFullNames

    // if (isAdmin) {
    //   const canceledEventsIds = events
    //     .filter(({ status }) => status === 'canceled')
    //     .map(({ _id }) => String(_id))

    //   const res = await db.model('EventsUsers').aggregate([
    //     {
    //       $match: {
    //         eventId: { $nin: canceledEventsIds },
    //         status: { $nin: ['reserve', 'ban'] },
    //       },
    //     },
    //     {
    //       $group: { _id: '$userId', total: { $sum: 1 } },
    //     },
    //   ])

    //   const preparedRes = res.reduce(function (result, { _id, total }) {
    //     result[_id] = total
    //     return result
    //   }, {})

    //   users = users.map((user) => ({
    //     ...user,
    //     signedUpEventsCount: preparedRes[user._id] || 0,
    //   }))
    // }

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
    // console.log('users :>> ', users ? JSON.stringify(users).length : 0)
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
      // users: JSON.parse(JSON.stringify(users)),
      events: serializeLeanDoc(events),
      directions: serializeLeanDoc(directions),
      reviews: serializeLeanDoc(reviews),
      additionalBlocks: serializeLeanDoc(additionalBlocks),
      // eventsUsers: JSON.parse(JSON.stringify(eventsUsers)),
      // payments: JSON.parse(JSON.stringify(payments)),
      siteSettings: serializeLeanDoc(siteSettings?.length > 0 ? siteSettings[0] : {}),
      rolesSettings: serializeLeanDoc(rolesSettings),
      // histories: JSON.parse(JSON.stringify(histories)),
      questionnaires: serializeLeanDoc(questionnaires),
      questionnairesUsers: serializeLeanDoc(questionnairesUsers),
      services: serializeLeanDoc(services),
      // servicesUsers: JSON.parse(JSON.stringify(servicesUsers)),
      serverSettings: {
        dateTime: serverDateTime.toISOString(),
      },
      mode: process.env.MODE,
      location,
      telegramBotName,
    }

    return fetchResult
  } catch (error) {
    return {
      // users: [],
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
      serverSettings: {
        dateTime: serverDateTime.toISOString(),
      },
      mode: process.env.MODE,
      error: error instanceof Error ? error.message : String(error),
      location,
      telegramBotName,
    }
  }
}

export default fetchProps
