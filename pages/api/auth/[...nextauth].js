import NextAuth from 'next-auth'
// import Providers from 'next-auth/providers'
// import dbConnect from '@utils/dbConnect'
import Users from '@models/Users'
import CRUD from '@server/CRUD'
// import Auth0Provider from 'next-auth/providers/auth0'
// import GoogleProvider from 'next-auth/providers/google'
import { fetchingUserByPhone } from '@helpers/fetchers'
import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from '@utils/dbConnect'
// import usersSchema from '@schemas/usersSchema'
// import VkProvider from 'next-auth/providers/vk'
// import EmailProvider from 'next-auth/providers/email'
// import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
// import clientPromise from '@utils/mongodb'

// import { MongoClient } from 'mongodb'

// const uri = process.env.MONGODB_URI
// const options = {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
// }

// let client
// let clientPromise

// if (!process.env.MONGODB_URI) {
//   throw new Error('Please add your Mongo URI to .env.local')
// }

// if (process.env.NODE_ENV === 'development') {
//   // In development mode, use a global variable so that the value
//   // is preserved across module reloads caused by HMR (Hot Module Replacement).
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri, options)
//     global._mongoClientPromise = client.connect()
//   }
//   clientPromise = global._mongoClientPromise
// } else {
//   // In production mode, it's best to not use a global variable.
//   client = new MongoClient(uri, options)
//   clientPromise = client.connect()
// }

// const defaultUserProps = {
//   role: 'client',
//   phone: null,
//   whatsapp: null,
//   viber: null,
//   telegram: null,
//   instagram: null,
//   vk: null,
//   gender: null,
//   birthday: null,
//   updatedAt: Date.now(),
//   lastActivityAt: Date.now(),
//   prevActivityAt: Date.now(),
// }

export default async function auth(req, res) {
  return await NextAuth(req, res, {
    secret: process.env.SECRET,
    // Configure one or more authentication providers
    providers: [
      // Providers.Email({
      //   server: process.env.EMAIL_SERVER,
      //   from: process.env.EMAIL_FROM,
      // }),
      CredentialsProvider({
        id: 'credentials', // <- add this line
        name: 'credentials',
        credentials: {
          phone: { label: 'Phone', type: 'text', placeholder: '' },
          password: { label: 'Password', type: 'password' },
        },
        authorize: async (credentials, req) => {
          const { phone, password } = credentials
          // console.log('---------------- credentials', credentials)
          // return { name: 'test', email: '123@123.ru' }
          if (phone && password) {
            await dbConnect()
            // const userEmail = username.toLowerCase()
            const fetchedUser = await Users.find({ phone, password })
            // console.log('fetchedUser', fetchedUser)
            // return null
            if (fetchedUser?.length > 0) {
              // return { ...fetchedUser[0], name: 'test' }
              // console.log('fetchedUser[0].name', fetchedUser[0]?.name)
              return {
                name: phone,
                // email: 'test',
                // phone: fetchedUser[0].phone,
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
        // console.log('------- user', user)
        // console.log('------- session.user', session.user)
        // console.log('token', token)
        // return Promise.resolve(session)
        // const { user } = session
        const userPhone = session.user.name
        // const cached = await dbConnect()
        const result = await fetchingUserByPhone(
          userPhone,
          process.env.NEXTAUTH_SITE
        )

        console.log('result in nextauth', result)

        // console.log('result', result)
        // const result = await Users.find({
        //   email: userEmail,
        // })

        // Если пользователь есть в базе
        if (result?.length) {
          // Если аватарка пользователя не сохранена в cloudinary, то сохраняем в cloudinary и обнояем данные пользователя
          // if (
          //   result[0].image &&
          //   !result[0].image.includes('https://res.cloudinary.com')
          // ) {
          //   await fetch(process.env.CLOUDINARY_UPLOAD_URL, {
          //     method: 'POST',
          //     headers: {
          //       'Content-Type': 'application/json;charset=utf-8',
          //     },
          //     body: JSON.stringify({
          //       file: result[0].image,
          //       upload_preset: process.env.CLOUDINARY_FOLDER + '_users',
          //       public_id: result[0]._id,
          //     }),
          //   })
          //     .then((response) => response.json())
          //     .then(async (data) => {
          //       if (data.secure_url !== '') {
          //         await CRUD(Users, {
          //           method: 'PUT',
          //           query: { id: result[0]._id },
          //           body: { image: data.secure_url },
          //         })
          //         user.image = data.secure_url
          //       }
          //     })
          //     .catch((err) => console.error(err))
          // } else {
          //   user.image = result[0].image
          // }
          // for (var key in result[0]) {
          //   user[key] = result[0][key]
          // }
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

          if (result[0].role === 'client') {
          } else {
            // Если пользователь авторизован, то обновляем только время активности
            await Users.findOneAndUpdate(
              { phone: userPhone },
              {
                lastActivityAt: Date.now(),
                prevActivityAt: session.user.lastActivityAt,
              }
            )
          }
        } else {
          // если пользователь не зарегистрирован
          await CRUD(Users, {
            method: 'POST',
            body: {
              // firstName: session.user.name,
              phone: userPhone,
              images: [session.user.image],
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
