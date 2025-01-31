import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from '@utils/dbConnect'
import userRegisterTelegramNotification from '@server/userRegisterTelegramNotification'

export default async function auth(req, res) {
  return await NextAuth(req, res, {
    secret: process.env.SECRET,
    providers: [
      // Providers.Email({
      //   server: process.env.EMAIL_SERVER,
      //   from: process.env.EMAIL_FROM,
      // }),
      CredentialsProvider({
        id: 'credentials',
        name: 'credentials',
        credentials: {
          phone: { label: 'Phone', type: 'text', placeholder: '' },
          password: { label: 'Password', type: 'password' },
          location: { label: 'Location', type: 'text' },
        },
        authorize: async (credentials, req) => {
          const { phone, password, location } = credentials
          // console.log('!! location :>> ', location)
          if (phone && password && location) {
            const db = await dbConnect(location)
            if (!db) return null

            // await fetchingLog(
            //   { from: 'update User activity time in nextauth authorize' },
            //   process.env.NEXTAUTH_SITE
            // )

            const fetchedUser = await db
              .model('Users')
              .findOne({ phone, password })
              .lean()
            // await db.model('Users').findOneAndUpdate(
            //   { phone, password },
            //   {
            //     lastActivityAt: Date.now(),
            //     // prevActivityAt: session.user.lastActivityAt,
            //   }
            // )

            if (fetchedUser) {
              return {
                name: fetchedUser._id,
                email: location,
              }
            } else {
              return null
            }
          } else {
            return null
          }
        },
      }),
      CredentialsProvider({
        id: 'telegram',
        name: 'telegram',
        credentials: {
          telegramId: { label: 'TelegramId', type: 'number', placeholder: '' },
          first_name: { label: 'first_name', type: 'text', placeholder: '' },
          last_name: { label: 'last_name', type: 'text', placeholder: '' },
          photo_url: { label: 'photo_url', type: 'text', placeholder: '' },
          username: { label: 'username', type: 'text', placeholder: '' },
          registration: {
            label: 'registration',
            type: 'text',
            placeholder: 'false',
          },
          location: { label: 'Location', type: 'text' },
        },
        authorize: async (credentials, req) => {
          const {
            telegramId,
            first_name,
            last_name,
            photo_url,
            username,
            registration,
            location,
          } = credentials
          if (telegramId) {
            const telegramIdNum = parseInt(telegramId)
            if (!telegramIdNum || !location) {
              return null
            }

            const db = await dbConnect(location)
            if (!db) return null

            const fetchedUser = await db
              .model('Users')
              .findOne({
                'notifications.telegram.id': telegramIdNum,
              })
              .lean()

            if (fetchedUser?._id) {
              return {
                name: fetchedUser._id,
                email: location,
              }
            } else {
              if (registration === 'true') {
                const newUser = await db.model('Users').create({
                  notifications: {
                    telegram: {
                      id: telegramIdNum,
                      active: false,
                      userName: username,
                    },
                  },
                  firstName: first_name,
                  secondName: last_name === 'undefined' ? undefined : last_name,
                  images: [photo_url],
                  registrationType: 'telegram',
                })
                await db.model('Histories').create({
                  schema: 'users',
                  action: 'add',
                  data: newUser,
                  userId: newUser._id,
                })
                await userRegisterTelegramNotification({
                  telegramId: telegramIdNum,
                  first_name,
                  last_name: last_name === 'undefined' ? undefined : last_name,
                  images: [photo_url],
                  location,
                })
                return {
                  name: newUser._id,
                  email: location,
                }
              }
              return null
            }
          } else {
            return null
          }
        },
      }),
      // GoogleProvider({
      //   clientId: process.env.GOOGLE_CLIENT_ID,
      //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      //   // authorizationUrl:
      //   //   'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
      // }),
      // VkProvider({
      //   clientId: process.env.VK_CLIENT_ID,
      //   clientSecret: process.env.VK_CLIENT_SECRET,
      // }),
      // ...add more providers here
    ],
    callbacks: {
      // async jwt({ token, user }) {
      //   return { ...token, ...user }
      // },
      async session({ session, user, token }) {
        // await fetchingLog(
        //   { from: 'nextauth callback session', user: session?.user },
        //   process.env.NEXTAUTH_SITE
        // )
        // console.log('session.user', session.user)
        const userId = session.user.name
        const location = session.user.email

        // Находим данные пользователя и обновляем время активности
        // await fetchingLog(
        //   { from: 'start dbConnect in nextauth' },
        //   process.env.NEXTAUTH_SITE
        // )
        const db = await dbConnect(location)
        if (!db) return null
        // await fetchingLog(
        //   { from: 'finish dbConnect in nextauth' },
        //   process.env.NEXTAUTH_SITE
        // )

        const result = await db.model('Users').findById(userId)
        // const result = await db.model('Users').findOneAndUpdate(
        //   { phone: userPhone },
        //   {
        //     lastActivityAt: Date.now(),
        //     // prevActivityAt: session.user.lastActivityAt,
        //   }
        // )
        // console.log('!!!!!!!!!!!result', result)

        // const result = await fetchingUserByPhone(
        //   userPhone,
        //   process.env.NEXTAUTH_SITE
        // )
        // await fetchingLog(
        //   { from: 'result in nextauth', result },
        //   process.env.NEXTAUTH_SITE
        // )

        // Если пользователь есть в базе (а он должен быть)
        if (result) {
          // await fetchingLog(
          //   {
          //     from: 'user finded. update User activity time in nextauth authorize',
          //   },
          //   process.env.NEXTAUTH_SITE
          // )
          result.prevActivityAt = result.lastActivityAt
          result.lastActivityAt = Date.now()
          result.save()

          // await fetchingLog(
          //   { from: 'user activity time saved' },
          //   process.env.NEXTAUTH_SITE
          // )

          session.user._id = result._id
          session.user.role = result.role
          session.user.firstName = result.firstName
          session.user.secondName = result.secondName
          session.user.thirdName = result.thirdName
          session.user.phone = result.phone
          session.user.email = result.email
          session.user.whatsapp = result.whatsapp
          session.user.viber = result.viber
          session.user.telegram = result.telegram
          session.user.instagram = result.instagram
          session.user.vk = result.vk
          session.user.gender = result.gender
          session.user.relationship = result.relationship
          session.user.town = result.town
          session.user.personalStatus = result.personalStatus
          session.user.birthday = result.birthday
          session.user.lastActivityAt = result.lastActivityAt
          session.user.prevActivityAt = result.prevActivityAt
          session.user.orientation = result.orientation
          // session.user.profession = result.profession
          // session.user.interests = result.interests
          // session.user.about = result.about
          session.user.status = result.status
          session.user.images = result.images
          session.user.haveKids = result.haveKids
          session.user.security = result.security
          session.user.notifications = result.notifications
          session.user.eventsTagsNotification = result.eventsTagsNotification
          session.user.registrationType = result.registrationType
          session.user.createdAt = result.createdAt
          session.user.updatedAt = result.updatedAt
        }

        session.location = location
        return Promise.resolve(session)
      },
    },
    jwt: {
      secret: 'test',
      encryption: true,
    },
    pages: {
      signIn: '/login',
    },
    // A database is optional, but required to persist accounts in a database
    // database: process.env.MONGODB_URI,
    // adapter: TypeORMLegacyAdapter(process.env.MONGODB_URI)
    // adapter: MongoDBAdapter({
    //   db: (await clientPromise).db(),
    // }),
  })
}
