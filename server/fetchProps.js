// const { default: AdditionalBlocks } = require('@models/AdditionalBlocks')
// const { default: Directions } = require('@models/Directions')
// const { default: Events } = require('@models/Events')
// const { default: EventsUsers } = require('@models/EventsUsers')
// const { default: Payments } = require('@models/Payments')
// const { default: Reviews } = require('@models/Reviews')
// const { default: Site } = require('@models/Site')
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
import AdditionalBlocks from '@models/AdditionalBlocks'
import Directions from '@models/Directions'
import Events from '@models/Events'
import EventsUsers from '@models/EventsUsers'
import Payments from '@models/Payments'
import Reviews from '@models/Reviews'
import Site from '@models/Site'
import Users from '@models/Users'
import dbConnect from '@utils/dbConnect'

const fetchProps = async () => {
  try {
    console.log(`start fetchProps`)
    console.log(`start dbConnect`)
    await dbConnect()
    console.log(`finished dbConnect`)
    // const users = await Users.find({})
    // const events = await Events.find({})
    // const directions = await Directions.find({})
    // const reviews = await Reviews.find({})
    // const additionalBlocks = await AdditionalBlocksModel.find({})
    // const eventsUsers = await EventsUsers.find({})
    // const payments = await Payments.find({})
    // const siteSettings = await Site.find({})
    console.time('Loading time')
    console.time('users')
    const users = await Users.find({})
    // console.log('process.env.NEXTAUTH_SITE', process.env.NEXTAUTH_SITE)
    // const users = await fetchingUsers(process.env.NEXTAUTH_SITE)
    // console.log(`users`, users)
    console.timeEnd('users')
    console.time('events')
    const events = await Events.find({})
    // const events = await fetchingEvents(process.env.NEXTAUTH_SITE)
    // console.log(`events`, events)
    console.timeEnd('events')
    console.time('directions')
    const directions = await Directions.find({})
    // const directions = await fetchingDirections(process.env.NEXTAUTH_SITE)
    // console.log(`directions`, directions)
    console.timeEnd('directions')
    console.time('reviews')
    const reviews = await Reviews.find({})
    // const reviews = await fetchingReviews(process.env.NEXTAUTH_SITE)
    // console.log(`reviews`, reviews)
    console.timeEnd('reviews')
    console.time('additionalBlocks')
    const additionalBlocks = await AdditionalBlocks.find({})
    // const additionalBlocks = await fetchingAdditionalBlocks(
    //   process.env.NEXTAUTH_SITE
    // )
    // console.log(`additionalBlocks`, additionalBlocks)
    console.timeEnd('additionalBlocks')
    console.time('eventsUsers')
    const eventsUsers = await EventsUsers.find({})
    // const eventsUsers = await fetchingEventsUsers(process.env.NEXTAUTH_SITE)
    // console.log(`eventsUsers`, eventsUsers)
    console.timeEnd('eventsUsers')
    console.time('payments')
    const payments = await Payments.find({})
    // const payments = await fetchingPayments(process.env.NEXTAUTH_SITE)
    // console.log(`payments`, payments)
    console.timeEnd('payments')
    console.time('siteSettings')
    const siteSettings = await Site.find({})
    // const siteSettings = await fetchingSiteSettings(process.env.NEXTAUTH_SITE)
    // console.log(`siteSettings`, siteSettings)
    console.timeEnd('siteSettings')
    console.timeEnd('Loading time')
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

    return {
      users: JSON.parse(JSON.stringify(users)),
      events: JSON.parse(JSON.stringify(events)),
      directions: JSON.parse(JSON.stringify(directions)),
      reviews: JSON.parse(JSON.stringify(reviews)),
      additionalBlocks: JSON.parse(JSON.stringify(additionalBlocks)),
      eventsUsers: JSON.parse(JSON.stringify(eventsUsers)),
      payments: JSON.parse(JSON.stringify(payments)),
      siteSettings: JSON.parse(JSON.stringify(siteSettings)),
    }
  } catch (error) {
    return {
      users: null,
      events: null,
      directions: null,
      reviews: null,
      additionalBlocks: null,
      eventsUsers: null,
      payments: null,
      siteSettings: null,
      error: JSON.parse(JSON.stringify(error)),
    }
  }
}

export default fetchProps
