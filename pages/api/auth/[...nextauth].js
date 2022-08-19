import NextAuth from 'next-auth'
import Users from '@models/Users'
import CRUD from '@server/CRUD'
import { fetchingLog, fetchingUserByPhone } from '@helpers/fetchers'
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

            const fetchedUser = await Users.find({ phone, password })

            if (fetchedUser?.length > 0) {
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
        await fetchingLog(
          { from: 'nextauth callback session', user: session?.user },
          process.env.NEXTAUTH_SITE
        )

        const userPhone = session.user.name

        const result = await fetchingUserByPhone(
          userPhone,
          process.env.NEXTAUTH_SITE
        )
        await fetchingLog(
          { from: 'result in nextauth', result },
          process.env.NEXTAUTH_SITE
        )

        // Если пользователь есть в базе
        if (result?.length) {
          await fetchingLog(
            { from: 'after if (result?.length)' },
            process.env.NEXTAUTH_SITE
          )

          session.user._id = result[0]._id
          session.user.role = result[0].role
          session.user.firstName = result[0].firstName
          session.user.secondName = result[0].secondName
          session.user.thirdName = result[0].thirdName
          session.user.phone = result[0].phone
          session.user.email = result[0].email
          session.user.whatsapp = result[0].whatsapp
          session.user.viber = result[0].viber
          session.user.telegram = result[0].telegram
          session.user.instagram = result[0].instagram
          session.user.vk = result[0].vk
          session.user.gender = result[0].gender
          session.user.birthday = result[0].birthday
          session.user.lastActivityAt = result[0].lastActivityAt
          session.user.orientation = result[0].orientation
          session.user.profession = result[0].profession
          session.user.interests = result[0].interests
          session.user.about = result[0].about
          session.user.status = result[0].status
          session.user.images = result[0].images

          // Обновляем время активности
          await dbConnect()

          await Users.findOneAndUpdate(
            { phone: userPhone },
            {
              lastActivityAt: Date.now(),
              prevActivityAt: session.user.lastActivityAt,
            }
          )
        } else {
          // если пользователь не зарегистрирован
          await CRUD(Users, {
            method: 'POST',
            body: {
              phone: userPhone,
              role: 'client',
            },
          })
        }
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
