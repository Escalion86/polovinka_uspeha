// const { default: AdditionalBlocks } = require('@models/AdditionalBlocks')
// const { default: Directions } = require('@models/Directions')
// const { default: Events } = require('@models/Events')
// const { default: EventsUsers } = require('@models/EventsUsers')
// const { default: Payments } = require('@models/Payments')
// const { default: Reviews } = require('@models/Reviews')
// const { default: SiteSettings } = require('@models/SiteSettings')
// const { default: Users } = require('@models/Users')
// const { default: dbConnect } = require('@utils/dbConnect')

// import {
//   fetchingAdditionalBlocks,
//   fetchingDirections,
//   fetchingEvents,
//   fetchingEventsUsers,
//   fetchingPayments,
//   fetchingReviews,
//   fetchingSiteSettings,
//   fetchingUsers,
// } from '@helpers/fetchers'
// import { fetchingLog } from '@helpers/fetchers'
import isUserModer from '@helpers/isUserModer'
import AdditionalBlocks from '@models/AdditionalBlocks'
import Directions from '@models/Directions'
import Events from '@models/Events'
import EventsUsers from '@models/EventsUsers'
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

const fetchProps = async (user) => {
  const serverDateTime = new Date()
  try {
    // console.log(`start fetchProps`)
    // console.time('Loading time')
    // console.time('dbConnect')
    const db = await dbConnect()
    // console.timeEnd(`dbConnect`)
    // await fetchingLog({ from: 'fetchProps', db }, process.env.NEXTAUTH_SITE)
    // console.log('db', db)
    // const users = await Users.find({})
    // const events = await Events.find({})
    // const directions = await Directions.find({})
    // const reviews = await Reviews.find({})
    // const additionalBlocks = await AdditionalBlocksModel.find({})
    // const eventsUsers = await EventsUsers.find({})
    // const payments = await Payments.find({})
    // const siteSettings = await SiteSettings.find({})
    const isModer = isUserModer(user)
    var users = JSON.parse(JSON.stringify(await Users.find({})))
    if (!isModer) {
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
    // console.log('user.notifications?.telegram', user.notifications?.telegram)
    // console.log(
    //   'user.notifications?.telegram?.userName',
    //   user.notifications?.telegram?.userName
    // )
    // console.log('process.env.NEXTAUTH_SITE', process.env.NEXTAUTH_SITE)
    // const users = await fetchingUsers(process.env.NEXTAUTH_SITE)
    // console.log(`users`, users)
    // console.timeEnd('users')
    // console.time('events')
    const events = await Events.find({})
    // const events = await fetchingEvents(process.env.NEXTAUTH_SITE)
    // console.log(`events`, events)
    // console.timeEnd('events')
    // console.time('directions')
    const directions = await Directions.find({})
    // const directions = await fetchingDirections(process.env.NEXTAUTH_SITE)
    // console.log(`directions`, directions)
    // console.timeEnd('directions')
    // console.time('reviews')
    const reviews = await Reviews.find({})
    // const reviews = await fetchingReviews(process.env.NEXTAUTH_SITE)
    // console.log(`reviews`, reviews)
    // console.timeEnd('reviews')
    // console.time('additionalBlocks')
    const additionalBlocks = await AdditionalBlocks.find({})
    // const additionalBlocks = await fetchingAdditionalBlocks(
    //   process.env.NEXTAUTH_SITE
    // )
    // console.log(`additionalBlocks`, additionalBlocks)
    // console.timeEnd('additionalBlocks')
    // console.time('eventsUsers')
    const eventsUsers = await EventsUsers.find({})
    // const eventsUsers = await fetchingEventsUsers(process.env.NEXTAUTH_SITE)
    // console.log(`eventsUsers`, eventsUsers)
    // console.timeEnd('eventsUsers')
    // console.time('payments')
    const payments = await Payments.find({})
    // const payments = await fetchingPayments(process.env.NEXTAUTH_SITE)
    // console.log(`payments`, payments)
    // console.timeEnd('payments')
    // console.time('siteSettings')
    const siteSettings = await SiteSettings.find({})
    const questionnaires = await Questionnaires.find({})
    const questionnairesUsers = await QuestionnairesUsers.find({})
    // const siteSettings = await fetchingSiteSettings(process.env.NEXTAUTH_SITE)
    // console.log(`siteSettings`, siteSettings)
    // console.timeEnd('siteSettings')
    // const histories = isModer
    //   ? await Histories.find({
    //       // createdAt: { $gt: user.prevActivityAt },
    //     })
    //   : []

    const services = await Services.find({})
    const servicesUsers = await ServicesUsers.find({})
    // console.timeEnd('Loading time')
    // dbDisconnect()
    // console.log('return result', {
    //   users: JSON.parse(JSON.stringify(users)),
    //   events: JSON.parse(JSON.stringify(events)),
    //   directions: JSON.parse(JSON.stringify(directions)),
    //   reviews: JSON.parse(JSON.stringify(reviews)),
    //   additionalBlocks: JSON.parse(JSON.stringify(additionalBlocks)),
    //   eventsUsers: JSON.parse(JSON.stringify(eventsUsers)),
    //   payments: JSON.parse(JSON.stringify(payments)),
    //   siteSettings: JSON.parse(JSON.stringify(siteSettings)),
    // })

    // return {
    //   users,
    //   events,
    //   directions,
    //   reviews,
    //   additionalBlocks,
    //   eventsUsers,
    //   payments,
    //   siteSettings,
    // }

    const fetchResult = {
      users,
      events: JSON.parse(JSON.stringify(events)),
      directions: JSON.parse(JSON.stringify(directions)),
      reviews: JSON.parse(JSON.stringify(reviews)),
      additionalBlocks: JSON.parse(JSON.stringify(additionalBlocks)),
      eventsUsers: JSON.parse(JSON.stringify(eventsUsers)),
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
    console.log(6)

    // console.log('fetchResult', fetchResult)

    return fetchResult
  } catch (error) {
    return {
      users: [],
      events: [],
      directions: [],
      reviews: [],
      additionalBlocks: [],
      eventsUsers: [],
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
