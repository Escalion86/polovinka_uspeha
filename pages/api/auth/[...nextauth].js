import NextAuth from 'next-auth'
import Users from '@models/Users'
import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from '@utils/dbConnect'

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
        },
        authorize: async (credentials, req) => {
          const { phone, password } = credentials
          if (phone && password) {
            await dbConnect()

            // await fetchingLog(
            //   { from: 'update User activity time in nextauth authorize' },
            //   process.env.NEXTAUTH_SITE
            // )

            const fetchedUser = await Users.findOne({ phone, password })
            // await Users.findOneAndUpdate(
            //   { phone, password },
            //   {
            //     lastActivityAt: Date.now(),
            //     // prevActivityAt: session.user.lastActivityAt,
            //   }
            // )

            if (fetchedUser) {
              return {
                name: phone,
              }
            } else {
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

        const userPhone = session.user.name

        // Находим данные пользователя и обновляем время активности
        // await fetchingLog(
        //   { from: 'start dbConnect in nextauth' },
        //   process.env.NEXTAUTH_SITE
        // )
        await dbConnect()
        // await fetchingLog(
        //   { from: 'finish dbConnect in nextauth' },
        //   process.env.NEXTAUTH_SITE
        // )

        console.log('dbConnect')

        const result = await Users.findOne({ phone: userPhone })
        // const result = await Users.findOneAndUpdate(
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
          session.user.birthday = result.birthday
          session.user.lastActivityAt = result.lastActivityAt
          session.user.prevActivityAt = result.prevActivityAt
          session.user.orientation = result.orientation
          session.user.profession = result.profession
          session.user.interests = result.interests
          session.user.about = result.about
          session.user.status = result.status
          session.user.images = result.images
          session.user.haveKids = result.haveKids
          session.user.security = result.security
          session.user.notifications = result.notifications
        }

        //  else {
        //   // если пользователь не зарегистрирован
        //   await CRUD(Users, {
        //     method: 'POST',
        //     body: {
        //       phone: userPhone,
        //       role: 'client',
        //     },
        //   })
        // }
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
